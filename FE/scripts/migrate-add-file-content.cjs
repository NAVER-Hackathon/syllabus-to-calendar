// Migration script to add file_content column to syllabus_uploads
require("dotenv").config({ path: ".env.local" });
const mysql = require("mysql2/promise");

async function runMigration() {
  console.log("🔧 Running database migration...\n");

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

    console.log("Adding file_content column to syllabus_uploads...");
    await connection.execute(`
      ALTER TABLE syllabus_uploads 
      ADD COLUMN file_content LONGBLOB AFTER file_size
    `);

    console.log("\n✅ Migration completed successfully!");
    console.log("The syllabus_uploads table now has a file_content column.");
    console.log("Files will persist across serverless function invocations.\n");
  } catch (error) {
    if (error.code === "ER_DUP_FIELDNAME") {
      console.log("\n⚠️  Column already exists - migration skipped");
    } else {
      console.error("\n❌ Migration failed:", error.message);
      process.exit(1);
    }
  } finally {
    if (connection) await connection.end();
  }
}

runMigration();

