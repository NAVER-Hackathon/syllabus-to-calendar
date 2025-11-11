const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("Hello from Express backend!");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

const mysql = require('mysql2');

// Thay bằng thông tin thực tế của bạn
const connection = mysql.createConnection({
  host: 'db-3c34ls-kr.vpc-pub-cdb.ntruss.com',  // VD: '10.0.1.5' hoặc DB endpoint
  user: 'dbadmin',       // VD: 'dbadmin'
  password: 'Hackathon@2025',   // VD: 'Hackathon@2025'
  database: 'hackathondb',   // VD: 'hackathondb'
  port: 3306                  // hoặc port khác nếu bạn cấu hình
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Kết nối thất bại:', err.message);
    return;
  }
  console.log('✅ Kết nối thành công!');

  connection.query('SELECT NOW() AS currentTime', (err, results) => {
    if (err) {
      console.error('❌ Truy vấn thất bại:', err.message);
    } else {
      console.log('🕒 Giờ hiện tại từ DB:', results[0].currentTime);
    }

    // Đóng kết nối
    connection.end();
  });
});


connection.query(`
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`, (err, results) => {
  if (err) {
    console.error('❌ Tạo bảng thất bại:', err.message);
  } else {
    console.log('✅ Bảng "users" đã được tạo!');
  }
});

       