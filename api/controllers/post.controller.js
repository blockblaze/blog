import { dbconnection } from "../config/dbconnect.js";

export const getposts = async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 9;

  let query = `SELECT p.post_id AS postId, p.title, slug, p.category, p.content, p.thumbnail_url AS thumbnailUrl, p.created_date AS createdDATE, p.updated_date AS updatedDATE, d.version, d.supported_versions AS supportedVersions, d.file_url AS fileUrl
    FROM posts p
    LEFT JOIN downloadables d ON p.post_id = d.post_id`;

  let params = [];

  // Filter conditions
  if (req.query.postId) {
    query += ` WHERE p.post_id = ?`;
    params.push(req.query.postId);
  } else if (req.query.slug) {
    query += ` WHERE p.slug = ?`;
    params.push(req.query.slug);
  } else if (req.query.category) {
    query += ` WHERE p.category = ?`;
    params.push(req.query.category);
  }

  // Validate the order value and prevent SQL injection
  const order = req.query.order === "asc" ? "ASC" : "DESC";
  query += ` ORDER BY p.updated_date ${order}`; // Safely using order by validated value

  // Add limit and offset
  query += ` LIMIT ? OFFSET ?`;
  params = [...params, limit, offset];

  try {
    const [rows] = await dbconnection.promise().query(query, params);
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const searchposts = async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 9;

  let searchTerm = req.query.q;
  if (!searchTerm)
    return res
      .status(400)
      .json({
        success: false,
        statusCode: 400,
        message: "Search term is required.",
      });

  //search in db
  const query = `SELECT p.post_id AS postId, p.title, slug, p.category, p.content, p.thumbnail_url AS thumbnailUrl, p.created_date AS createdDATE, p.updated_date AS updatedDATE, d.version, d.supported_versions AS supportedVersions, d.file_url AS fileUrl
    FROM posts p
    LEFT JOIN downloadables d ON p.post_id = d.post_id
    
    WHERE p.title LIKE ? OR p.content LIKE ? ORDER BY p.updated_date DESC LIMIT ? OFFSET ?;`;

  const [rows] = await dbconnection
    .promise()
    .query(query, [`%${searchTerm}%`, `%${searchTerm}%` , limit , offset]);

  res.status(200).json(rows);
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
      const insertDownloadQuery = "INSERT INTO downloadables (version, supported_versions, file_url, post_id) VALUES (1, ?, ?, ?)";
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
  
  let { title, postId, slug, content, thumbnailUrl, category, fileUrl, version ,supportedVersions } = req.body;
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
    if (fileUrl && supportedVersions && version) {
      const newVersion = parseInt(version) +0.1;
      const updateDownloadQuery = "UPDATE downloadables set version = ? , supported_versions = ?,file_url = ? WHERE post_id = ?";
      const [updateDownloadResult] = await dbconnection.promise().execute(updateDownloadQuery, [newVersion,supportedVersions, fileUrl, postId]);
    }

    res.status(200).json({
      success: true,
      statusCode: 201,
      message: "Post updated successfully"
    }
    )

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