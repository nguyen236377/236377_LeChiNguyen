const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();
const Food = require('./models/Food');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const data = JSON.parse(fs.readFileSync('./foods.json', 'utf-8'));
    await Food.deleteMany({});
    await Food.insertMany(data);
    console.log('✅ Đã nạp dữ liệu thành công vào MongoDB Atlas!');
    process.exit();
  })
  .catch(err => {
    console.error('❌ Lỗi:', err);
    process.exit(1);
  });
