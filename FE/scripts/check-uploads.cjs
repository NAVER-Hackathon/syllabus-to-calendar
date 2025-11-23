// Check recent uploads and file_content column
require("dotenv").config({ path: ".env.local" });
const mysql = require("mysql2/promise");

async function checkUploads() {
  const config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || "3306"),
  };

  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log("✅ Connected to database\n");

    // Check if file_content column exists
    const [columns] = await connection.execute(
      "SHOW COLUMNS FROM syllabus_uploads LIKE 'file_content'"
    );
    
    if (columns.length > 0) {
      console.log("✅ file_content column exists");
      console.log("   Type:", columns[0].Type);
      console.log("");
    } else {
      console.log("❌ file_content column does NOT exist!");
      console.log("");
      return;
    }

    // Check recent uploads
    const [uploads] = await connection.execute(`
      SELECT 
        id, 
        file_name, 
        file_size, 
        LENGTH(file_content) as content_size,
        status,
        error_message,
        created_at
      FROM syllabus_uploads 
      ORDER BY created_at DESC 
      LIMIT 5
    `);

    console.log("📊 Recent uploads:");
    console.log("");
    
    if (uploads.length === 0) {
      console.log("   No uploads found");
    } else {
      uploads.forEach((upload, i) => {
        console.log(`${i + 1}. ${upload.file_name}`);
        console.log(`   ID: ${upload.id}`);
        console.log(`   File size: ${upload.file_size} bytes`);
        console.log(`   Content size: ${upload.content_size || 'NULL'} bytes`);
        console.log(`   Status: ${upload.status}`);
        if (upload.error_message) {
          console.log(`   Error: ${upload.error_message}`);
        }
        console.log(`   Created: ${upload.created_at}`);
        console.log("");
      });
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    if (connection) await connection.end();
  }
}

checkUploads();

