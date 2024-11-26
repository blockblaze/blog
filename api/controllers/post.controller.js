import { dbconnection } from "../config/dbconnect.js";

export const getposts = async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 9;

  try {
    // Check for search term
    const searchTerm = req.query.q;

    // Step 1: Query to get distinct posts
    let postQuery = `
      SELECT 
        p.post_id AS postId, 
        p.title, 
        p.slug, 
        p.category, 
        p.content, 
        p.thumbnail_url AS thumbnailUrl,
        p.views,
        p.created_date AS createdDATE, 
        p.updated_date AS updatedDATE
      FROM posts p`;

    let params = [];

    // If search term exists, modify the query to search for posts
    if (searchTerm) {
      postQuery += ` WHERE (p.title LIKE ? OR p.content LIKE ?)`;
      params.push(`%${searchTerm}%`, `%${searchTerm}%`);
    } else {
      // Filter conditions if search term is not provided
      if (req.query.postId) {
        postQuery += ` WHERE p.post_id = ?`;
        params.push(req.query.postId);
      } else if (req.query.slug) {
        postQuery += ` WHERE p.slug = ?`;
        params.push(req.query.slug);
      } else if (req.query.category) {
        postQuery += ` WHERE p.category = ?`;
        params.push(req.query.category);
      }
    }

    // Exclude posts based on the provided IDs
    if (req.query.excludeIds) {
      const excludeIds = req.query.excludeIds.split(",").map(Number); // Convert to array of numbers
      if (excludeIds.length > 0) {
        postQuery += params.length > 0 ? ` AND` : ` WHERE`;
        postQuery += ` p.post_id NOT IN (?)`;
        params.push(excludeIds);
      }
    }

    // Validate the order value and prevent SQL injection
    const order = req.query.order === "asc" ? "ASC" : "DESC";
    postQuery += ` ORDER BY p.updated_date ${order}`;

    // Add limit and offset
    postQuery += ` LIMIT ? OFFSET ?`;
    params = [...params, limit, offset];

    // Step 1: Get the distinct posts
    const [posts] = await dbconnection.promise().query(postQuery, params);

    if (posts.length === 0) {
      return res.status(200).json([]); // No posts found
    }

    // Step 2: Get all downloadables and their total downloads for the selected posts
    const postIds = posts.map(post => post.postId); // Extract postIds
    const downloadablesQuery = `
      SELECT 
        d.post_id AS postId, 
        d.download_id AS downloadId,
        d.version, 
        d.supported_versions AS supportedVersions, 
        d.file_url AS fileUrl,
        d.changelog,
        d.downloads,
        d.created_date AS createdDate,
        SUM(d.downloads) OVER (PARTITION BY d.post_id) AS totalDownloads
      FROM downloadables d
      WHERE d.post_id IN (?)`; // Use IN clause to get downloadables for all selected posts

    const [downloadables] = await dbconnection.promise().query(downloadablesQuery, [postIds]);

    // Step 3: Group downloadables and their total downloads by postId
    const downloadablesMap = {};
    downloadables.forEach(downloadable => {
      if (!downloadablesMap[downloadable.postId]) {
        downloadablesMap[downloadable.postId] = {
          downloadables: [],
          totalDownloads: 0,
        };
      }
      downloadablesMap[downloadable.postId].downloadables.push({
        version: downloadable.version,
        downloadId:downloadable.downloadId,
        supportedVersions: downloadable.supportedVersions,
        fileUrl: downloadable.fileUrl,
        changelog: downloadable.changelog,
        downloads: downloadable.downloads,
        createdDate: downloadable.createdDate
      });
      downloadablesMap[downloadable.postId].totalDownloads = downloadable.totalDownloads;
    });

    // Step 4: Attach downloadables and total downloads to the posts
    const postsWithDownloadables = posts.map(post => ({
      ...post,
      downloadables: downloadablesMap[post.postId]?.downloadables || [], // Attach downloadables or an empty array if none
      totalDownloads: downloadablesMap[post.postId]?.totalDownloads || 0, // Attach total downloads or 0 if none
    }));

    return res.status(200).json(postsWithDownloadables);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error.",
    });
  }
};


export const createPost = async (req, res) => {
  try {
    let { title, slug, content, thumbnailUrl, category, fileUrl, supportedVersions } = req.body;

    // Validate required fields
    if (!title || !slug || !content || !thumbnailUrl || !category) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "All fields are required.",
      });
    }

    // Check if slug is already in use
    const checkQuery = "SELECT slug FROM posts WHERE slug = ?";
    const [rows] = await dbconnection.promise().query(checkQuery, [slug]);
    if (rows.length > 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Slug is already used.",
      });
    }
    
    slug = slug.split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
    // Insert the post into the posts table
    const insertQuery = "INSERT INTO posts (title, slug, category, content, thumbnail_url) VALUES (?, ?, ?, ?, ?)";
    const [result] = await dbconnection.promise().execute(insertQuery, [title, slug, category, content, thumbnailUrl]);

    // Check if downloadable data exists and insert into the downloadables table
    if (fileUrl && supportedVersions) {
      const insertDownloadQuery = "INSERT INTO downloadables (version, supported_versions, file_url, post_id) VALUES ('1.0', ?, ?, ?)";
      const [downloadableResult] = await dbconnection.promise().execute(insertDownloadQuery, [supportedVersions, fileUrl, result.insertId]);
    }

    // Respond with success
    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: { postId: result.insertId },
    });
  } catch (err) {
    // Handle errors
    console.error(err);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error!",
    });
  }
};

export const updatePost = async (req , res) =>{
  
  let { title, postId, slug, content, thumbnailUrl, category, downloadables} = req.body;
  // Validate required fields
  if (!title || !slug || !content || !thumbnailUrl || !category || !postId) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "All fields are required.",
    });
  }

  // Check if slug is already in use
  slug = slug.split(' ')
  .join('-')
  .toLowerCase()
  .replace(/[^a-zA-Z0-9-]/g, '');

  try{
    const checkQuery = "SELECT slug,post_id AS postId FROM posts WHERE slug = ?";
    const [rows] = await dbconnection.promise().query(checkQuery, [slug]);
    if (rows.length > 0 && rows[0].postId !== postId) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Slug is already used.",
      });
    }
    
  
    const updateQuery = 'UPDATE posts SET title = ?, slug=?,content=?,category=?,thumbnail_url=?,updated_date = CURRENT_TIMESTAMP() WHERE post_id =?';
    const updateParams = [title,slug,content,category,thumbnailUrl,postId]
  
    const [updateResult] = await dbconnection.promise().execute(updateQuery,updateParams);
      
    // Check if downloadable data exists and insert into the downloadables table
      if (downloadables) {
        const d = downloadables[downloadables.length-1]
        if( !d.supportedVersions || !d.version || !d.changelog || !d.fileUrl) return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "All fields are required.",
        });
        
        const versionArray = d.version.split('.')
        const newVersion = `${versionArray[0]}.${parseInt(versionArray[1])+1}`;
        const updateDownloadQuery = "INSERT INTO downloadables (version, changelog ,supported_versions, file_url, post_id) VALUES (?, ?,?, ?,?)";
        const [updateDownloadResult] = await dbconnection.promise().execute(updateDownloadQuery, [newVersion,d.changelog,d.supportedVersions, d.fileUrl, postId]);
      }
  
      res.status(200).json({
        success: true,
        statusCode: 201,
        message: "Post updated successfully"
      }
      )
  }catch(err){
    console.error(err);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error.",
    });
  }
  


};

export const updatePostActivity = async (req, res) => {
  const { action } = req.body;

  if (!action) {
    return res.status(400).json({
      success: false,
      message: "Action type is required."
    });
  }

  try {
    let updateQuery;
    let params = [];

    switch (action) {
      case 'view':
        if (!req.body.id) {
          return res.status(400).json({
            success: false,
            message: "Post Id is required."
          });
        }
        updateQuery = `UPDATE posts SET views = views + 1 WHERE post_id = ?`;
        params.push(req.body.id);
        break;

      case 'download':
        if (!req.body.id) {
          return res.status(400).json({
            success: false,
            message: "Download Id is required."
          });
        }
        updateQuery = `UPDATE downloadables SET downloads = downloads + 1 WHERE download_id = ?`;
        params.push(req.body.id);
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Invalid action type."
        });
    }

    // Execute the query to update views or downloads
    await dbconnection.promise().query(updateQuery, params);

    // Dynamically return the action type in the response message
    res.status(200).json({
      success: true,
      message: `${action.charAt(0).toUpperCase() + action.slice(1)} count updated successfully.`
    });

  } catch (err) {
    console.error(err); // Add this for debugging purposes
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error.",
    });
  }
};

export const deletePost = async (req,res) =>{
  const postId = req.params.postId;

  if(!postId) return res.status(400).json({
    success: false,
    statusCode: 400,
    message: "Post id is required.",
  });

  try{

    // Delete from downloadables table
    const deleteDownloadablesQuery = "DELETE FROM downloadables WHERE post_id = ?";
    const [deleteDownloadablesResult] = await dbconnection.promise().execute(deleteDownloadablesQuery, [postId]);

    // Delete from posts table
    const deletePostQuery = "DELETE FROM posts WHERE post_id = ?";
    const [deletePostResult] = await dbconnection.promise().execute(deletePostQuery, [postId]);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "The post has been deleted successfully.",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error.",
    });
  }
};