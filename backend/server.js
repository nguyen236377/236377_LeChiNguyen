const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Food = require('./models/Food');

const app = express();
app.use(cors());
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas successfully!'))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// GET /health - Kiểm tra server
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is running smoothly' });
});

// 1. GET /api/foods & GET /api/foods?search=pho (Lấy danh sách & Tìm kiếm món ăn)
app.get('/api/foods', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { cuisine: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const foods = await Food.find(query);
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. GET /api/foods/:id (Xem chi tiết một món ăn)
app.get('/api/foods/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Không tìm thấy món ăn' });
    res.status(200).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. POST /api/foods (Thêm món ăn mới)
app.post('/api/foods', async (req, res) => {
  try {
    const { foodId, name, category, price } = req.body;
    if (!foodId || !name || !category || price === undefined) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc (foodId, name, category, price)' });
    }

    const existingFood = await Food.findOne({ foodId });
    if (existingFood) {
      return res.status(400).json({ message: 'Mã món ăn (foodId) đã tồn tại!' });
    }

    const newFood = new Food(req.body);
    const savedFood = await newFood.save();
    res.status(201).json(savedFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 4. PUT /api/foods/:id (Cập nhật món ăn)
app.put('/api/foods/:id', async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedFood) return res.status(404).json({ message: 'Không tìm thấy món ăn để cập nhật' });
    res.status(200).json(updatedFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 5. DELETE /api/foods/:id (Xóa món ăn)
app.delete('/api/foods/:id', async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) return res.status(404).json({ message: 'Không tìm thấy món ăn để xóa' });
    res.status(200).json({ message: 'Đã xóa món ăn thành công', deletedFood });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
