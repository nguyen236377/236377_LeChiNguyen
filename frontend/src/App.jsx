import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Trash2, Edit, Eye, RefreshCw, Utensils } from 'lucide-react';

// Tự động nhận diện đường dẫn Backend khi chạy trên Codespaces hoặc Localhost
const getApiUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.dev')) {
    return `${window.location.protocol}//${window.location.hostname.replace('-5173', '-5000')}/api/foods`;
  }
 return 'https://api-236377.onrender.com/api/foods';
};

const API_URL = getApiUrl();

export default function App() {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedFood, setSelectedFood] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    foodId: '',
    name: '',
    category: 'Món chính',
    cuisine: 'Miền Bắc',
    price: '',
    quantity: '',
    description: '',
    imageUrl: '',
    ingredients: ''
  });

  const fetchFoods = async (search = '') => {
    setLoading(true);
    try {
      const res = await axios.get(search ? `${API_URL}?search=${encodeURIComponent(search)}` : API_URL);
      setFoods(res.data);
    } catch (err) {
      alert('Không thể kết nối với server Backend!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFoods(searchTerm);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      foodId: `F${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      category: 'Món chính',
      cuisine: 'Miền Bắc',
      price: '',
      quantity: 10,
      description: '',
      imageUrl: '',
      ingredients: ''
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (food) => {
    setEditingId(food._id);
    setFormData({
      foodId: food.foodId,
      name: food.name,
      category: food.category,
      cuisine: food.cuisine || '',
      price: food.price,
      quantity: food.quantity,
      description: food.description || '',
      imageUrl: food.imageUrl || '',
      ingredients: food.ingredients ? food.ingredients.join(', ') : ''
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      ingredients: formData.ingredients ? formData.ingredients.split(',').map(s => s.trim()) : []
    };

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, payload);
        alert('Cập nhật món ăn thành công!');
      } else {
        await axios.post(API_URL, payload);
        alert('Thêm món ăn mới thành công!');
      }
      setIsFormOpen(false);
      fetchFoods();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa món ăn này không?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchFoods();
      } catch (err) {
        alert('Không thể xóa món ăn!');
      }
    }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Utensils size={32} color="#2563eb" />
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', color: '#1e293b' }}>Hệ Thống Quản Lý Món Ăn</h1>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Sinh viên thực hiện: 236377_LeChiNguyen</p>
            </div>
          </div>
          <button onClick={handleOpenAdd} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
            <Plus size={18} /> Thêm món ăn mới
          </button>
        </header>

        <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '12px', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '0 12px', borderRadius: '8px' }}>
              <Search size={18} color="#64748b" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên món ăn, loại món ăn, hoặc vùng miền..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', border: 'none', backgroundColor: 'transparent', padding: '10px', outline: 'none' }}
              />
            </div>
            <button type="submit" style={{ backgroundColor: '#0f172a', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '8px', cursor: 'pointer' }}>Tìm kiếm</button>
            <button type="button" onClick={() => { setSearchTerm(''); fetchFoods(); }} style={{ backgroundColor: '#e2e8f0', color: '#334155', border: 'none', padding: '0 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <RefreshCw size={16} /> Tải lại
            </button>
          </form>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Đang tải danh sách món ăn...</p>
        ) : foods.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>Không tìm thấy món ăn nào!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {foods.map((food) => (
              <div key={food._id} style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                <img 
                  src={food.imageUrl || 'https://via.placeholder.com/300x180?text=Food+Image'} 
                  alt={food.name} 
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
                />
                <div style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '11px', fontWeight: 'bold', backgroundColor: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '4px' }}>{food.foodId}</span>
                    <span style={{ fontSize: '11px', backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px' }}>{food.cuisine || 'Chưa rõ'}</span>
                  </div>
                  <h3 style={{ margin: '8px 0 4px 0', fontSize: '18px', color: '#0f172a' }}>{food.name}</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Loại: <strong>{food.category}</strong></p>
                  <p style={{ margin: '8px 0 0 0', fontSize: '16px', fontWeight: 'bold', color: '#16a34a' }}>{food.price?.toLocaleString()} VNĐ</p>
                  
                  <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                    <button onClick={() => { setSelectedFood(food); setIsDetailOpen(true); }} style={{ flex: 1, backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', color: '#334155', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Eye size={14} /> Chi tiết
                    </button>
                    <button onClick={() => handleOpenEdit(food)} style={{ flex: 1, backgroundColor: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Edit size={14} /> Sửa
                    </button>
                    <button onClick={() => handleDelete(food._id)} style={{ flex: 1, backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '6px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Trash2 size={14} /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {isDetailOpen && selectedFood && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '500px', padding: '24px' }}>
              <h2 style={{ marginTop: 0 }}>{selectedFood.name} ({selectedFood.foodId})</h2>
              <p><strong>Loại món:</strong> {selectedFood.category}</p>
              <p><strong>Vùng miền:</strong> {selectedFood.cuisine}</p>
              <p><strong>Giá:</strong> {selectedFood.price?.toLocaleString()} VNĐ</p>
              <p><strong>Số lượng tồn:</strong> {selectedFood.quantity}</p>
              <p><strong>Mô tả:</strong> {selectedFood.description || 'Chưa có mô tả'}</p>
              <p><strong>Nguyên liệu:</strong> {selectedFood.ingredients?.join(', ') || 'Chưa có thông tin'}</p>
              <button onClick={() => setIsDetailOpen(false)} style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '16px' }}>Đóng</button>
            </div>
          </div>
        )}

        {isFormOpen && (
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px', width: '90%', maxWidth: '500px', padding: '24px', maxHeight: '90vh', overflowY: 'auto' }}>
              <h2 style={{ marginTop: 0 }}>{editingId ? 'Sửa món ăn' : 'Thêm món ăn mới'}</h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input type="text" placeholder="Mã món ăn (foodId)" value={formData.foodId} onChange={e => setFormData({...formData, foodId: e.target.value})} required disabled={!!editingId} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <input type="text" placeholder="Tên món ăn" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <input type="text" placeholder="Loại món ăn (vd: Món chính)" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <input type="text" placeholder="Vùng miền (vd: Miền Bắc)" value={formData.cuisine} onChange={e => setFormData({...formData, cuisine: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <input type="number" placeholder="Giá tiền (VNĐ)" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <input type="number" placeholder="Số lượng" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <input type="text" placeholder="URL Hình ảnh" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <textarea placeholder="Nguyên liệu (ngăn cách bằng dấu phẩy)" value={formData.ingredients} onChange={e => setFormData({...formData, ingredients: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <textarea placeholder="Mô tả món ăn" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Lưu thông tin</button>
                  <button type="button" onClick={() => setIsFormOpen(false)} style={{ flex: 1, padding: '10px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Hủy</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
