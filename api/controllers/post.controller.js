import { dbconnection } from "../config/dbconnect.js";

export const getposts = async (req, res) => {
  const offset = parseInt(req.query.offset) || 0;
  const limit = parseInt(req.query.limit) || 9;

  let query = `SELECT p.post_id AS postId, p.title, slug, p.category, p.content, p.thumbnail_url AS thumbnailURL, p.created_date AS createdDATE, p.updated_date AS updatedDATE, d.version, d.supported_versions AS supportedVersions, d.file_url AS fileUrl
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
  const query = `SELECT p.post_id AS postId, p.title, slug, p.category, p.content, p.thumbnail_url AS thumbnailURL, p.created_date AS createdDATE, p.updated_date AS updatedDATE, d.version, d.supported_versions AS supportedVersions, d.file_url AS fileUrl
    FROM posts p
    LEFT JOIN downloadables d ON p.post_id = d.post_id
    
    WHERE p.title LIKE ? OR p.content LIKE ?`;

  const [rows] = await dbconnection
    .promise()
    .query(query, [`%${searchTerm}%`, `%${searchTerm}%`]);

  res.status(200).json(rows);
};

export const createPost = async (req, res) => {
    try {
      let { title, slug, content, imageUrl, category } = req.body;
  
      // Check provided data
      if (!title || !slug || !content || !imageUrl || !category) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "All fields are required.",
        });
      }
  
      // Check if slug is available
      const checkQuery = "SELECT slug FROM posts WHERE slug = ?";
      const [rows] = await dbconnection.promise().query(checkQuery, [slug]);
      if (rows.length > 0) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Slug is already used.",
        });
      }
  
      // Insert post into the database
      const insertQuery =
        "INSERT INTO posts (title, slug, category, content, thumbnail_url) VALUES (?, ?, ?, ?, ?)";
      const [result] = await dbconnection
        .promise()
        .execute(insertQuery, [title, slug, category, content, imageUrl]);
  
      // Insert downloadable data if available
      if (req.body.fileUrl && req.body.supportedVersion) {
        const insertDownloadQuery =
          "INSERT INTO downloadables (version, supported_versions, file_url, post_id) VALUES (1, ?, ?, ?)";
        
        const [insertDownloadResult] = await dbconnection
          .promise()
          .execute(insertDownloadQuery, [req.body.supportedVersion, req.body.fileUrl, result.insertId]);
  
        return res.status(201).json({
          success: true,
          statusCode: 201,
          message: { postId: result.insertId },
        });
      }
  
      // Respond with success if no downloadable data is provided
      res.status(201).json({
        success: true,
        statusCode: 201,
        message: { postId: result.insertId },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal server error!",
      });
      console.log(err);
    }
  };
  