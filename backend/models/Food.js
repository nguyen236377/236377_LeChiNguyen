const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  foodId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  cuisine: { type: String, default: '' },
  ingredients: [{ type: String }],
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, default: 0, min: 0 },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Food', foodSchema);
