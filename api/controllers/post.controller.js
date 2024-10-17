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
    query += ` ORDER BY p.updated_date ${order}`;  // Safely using order by validated value

    // Add limit and offset
    query += ` LIMIT ? OFFSET ?`;
    params = [...params, limit, offset];

    try {
        const [rows] = await dbconnection.promise().query(query, params);
        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const searchposts = async (req,res) =>{
    let searchTerm = req.query.q;
    if(!searchTerm) return res.status(400).json({ success: false, statusCode: 400, message: "Search term is required." })
     
   //search in db
    const query = `SELECT p.post_id AS postId, p.title, slug, p.category, p.content, p.thumbnail_url AS thumbnailURL, p.created_date AS createdDATE, p.updated_date AS updatedDATE, d.version, d.supported_versions AS supportedVersions, d.file_url AS fileUrl
    FROM posts p
    LEFT JOIN downloadables d ON p.post_id = d.post_id
    
    WHERE p.title LIKE ? OR p.content LIKE ?`;

    const [rows] = await dbconnection.promise().query(query, [`%${searchTerm}%`,`%${searchTerm}%`]);

    res.status(200).json(rows);
  }