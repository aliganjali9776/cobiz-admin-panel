// admin-panel/src/KnowledgeManager.js
import React, { useState, useEffect } from 'react';

// یک فرم خالی برای ریست کردن
const emptyForm = {
  title: '', summary: '', tags: '', content: '',
  access: 'free', price: 0,
};

function KnowledgeManager() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formats, setFormats] = useState([]);
  
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null); // استیت برای نگهداری فایل آپلود شده
  const [isEditing, setIsEditing] = useState(null);
  
  const [newCategory, setNewCategory] = useState('');
  const [newFormat, setNewFormat] = useState('');

  // لود کردن تمام داده‌ها از بک‌اند
  useEffect(() => {
    // در یک اپلیکیشن واقعی، بهتر است اینها همزمان fetch شوند
    fetch('http://localhost:5001/api/articles').then(res => res.json()).then(setArticles);
    fetch('http://localhost:5001/api/knowledge/categories').then(res => res.json()).then(setCategories);
    fetch('http://localhost:5001/api/knowledge/formats').then(res => res.json()).then(setFormats);
  }, []);
  
  // توابع مدیریت دسته و نوع (افزودن و حذف)
  const handleAddItem = async (type, value) => {
    if (!value.trim()) return;
    const url = `http://localhost:5001/api/knowledge/${type}s`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: value }),
    });
    if (response.ok) {
      const newItem = await response.json();
      if (type === 'category') {
        setCategories(prev => [...prev, newItem]);
        setNewCategory('');
      } else {
        setFormats(prev => [...prev, newItem]);
        setNewFormat('');
      }
    }
  };

  const handleDeleteItem = async (type, id) => {
    if (window.confirm('آیا از حذف این آیتم مطمئن هستید؟')) {
      const url = `http://localhost:5001/api/knowledge/${type}s/${id}`;
      const response = await fetch(url, { method: 'DELETE' });
      if (response.ok) {
        if (type === 'category') setCategories(prev => prev.filter(c => c._id !== id));
        else setFormats(prev => prev.filter(f => f._id !== id));
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleEdit = (article) => {
    setIsEditing(article._id);
    setForm({ ...article, tags: Array.isArray(article.tags) ? article.tags.join(', ') : '' });
  };
  
  const cancelEdit = () => {
    setIsEditing(null);
    setForm(emptyForm);
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // از FormData برای ارسال همزمان متن و فایل استفاده می‌کنیم
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      // ارسال تگ‌ها به صورت آرایه
      if (key === 'tags') {
        form.tags.split(',').map(tag => formData.append('tags', tag.trim()));
      } else {
        formData.append(key, form[key]);
      }
    });
    if (file) {
      formData.append('file', file); // فایل را به فرم اضافه می‌کنیم
    }

    const url = isEditing ? `http://localhost:5001/api/articles/${isEditing}` : 'http://localhost:5001/api/articles';
    const method = isEditing ? 'PUT' : 'POST';

    const response = await fetch(url, { method, body: formData });
    
    if (response.ok) {
      const savedArticle = await response.json();
      if (isEditing) {
        setArticles(prev => prev.map(a => a._id === isEditing ? savedArticle : a));
        alert('مطلب با موفقیت ویرایش شد!');
      } else {
        setArticles(prev => [...prev, savedArticle]);
        alert('مطلب با موفقیت افزوده شد!');
      }
      cancelEdit();
    } else {
      alert('خطا در ذخیره مطلب.');
    }
  };

  return (
    <div>
      <h2 className="admin-content-header">مدیریت بانک دانش</h2>

      {/* بخش جدید مدیریت دسته و نوع */}
      <div className="dynamic-manager">
        <h3>مدیریت دسته‌بندی‌ها</h3>
        <form onSubmit={(e) => {e.preventDefault(); handleAddItem('category', newCategory)}} className="dynamic-add-form">
          <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="نام دسته‌بندی جدید..."/>
          <button type="submit" className="btn-secondary">افزودن</button>
        </form>
        <div className="dynamic-list">
          {categories.map(cat => <div key={cat._id} className="dynamic-item"><span>{cat.name}</span><button onClick={() => handleDeleteItem('category', cat._id)}>&times;</button></div>)}
        </div>
      </div>
      <div className="dynamic-manager">
        <h3>مدیریت نوع مطالب</h3>
        <form onSubmit={(e) => {e.preventDefault(); handleAddItem('format', newFormat)}} className="dynamic-add-form">
          <input value={newFormat} onChange={e => setNewFormat(e.target.value)} placeholder="نام نوع جدید (مثلا: پادکست)..."/>
          <button type="submit" className="btn-secondary">افزودن</button>
        </form>
        <div className="dynamic-list">
          {formats.map(f => <div key={f._id} className="dynamic-item"><span>{f.name}</span><button onClick={() => handleDeleteItem('format', f._id)}>&times;</button></div>)}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <h3>{isEditing ? 'ویرایش مطلب' : 'افزودن مطلب جدید'}</h3>
        <input name="title" value={form.title} onChange={handleInputChange} placeholder="عنوان" required />
        <textarea name="summary" value={form.summary} onChange={handleInputChange} placeholder="خلاصه" required />
        <input name="tags" value={form.tags} onChange={handleInputChange} placeholder="تگ‌ها (با کاما جدا کنید)" />
        
        <div className="form-section">
          <select name="format" value={form.format} onChange={handleInputChange}>
            {formats.map(f => <option key={f._id} value={f.name}>{f.name}</option>)}
          </select>
          <select name="category" value={form.category} onChange={handleInputChange}>
            {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        {/* بخش جدید قیمت‌گذاری و آپلود فایل */}
        <div className="form-section">
          <div className="form-group">
            <label>نوع دسترسی</label>
            <select name="access" value={form.access} onChange={handleInputChange}>
              <option value="free">رایگان</option>
              <option value="paid">پولی</option>
            </select>
          </div>
          {form.access === 'paid' && (
            <div className="form-group">
              <label>قیمت (تومان)</label>
              <input name="price" type="number" value={form.price} onChange={handleInputChange} placeholder="مثلا: 50000" />
            </div>
          )}
        </div>
        <div className="form-section">
            <div className="form-group">
                <label>فایل ضمیمه (اختیاری)</label>
                <label htmlFor="file-upload" className="file-input-label">
                    <i className="fa-solid fa-upload"></i> انتخاب فایل
                </label>
                <input id="file-upload" type="file" onChange={handleFileChange} />
                {file && <span className="file-name">فایل انتخاب شده: {file.name}</span>}
                {isEditing && form.fileUrl && <span className="file-name">فایل فعلی: <a href={form.fileUrl} target="_blank" rel="noopener noreferrer">دانلود</a></span>}
            </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn-primary">{isEditing ? 'ذخیره تغییرات' : 'ذخیره مطلب'}</button>
          {isEditing && <button type="button" className="btn-secondary" onClick={cancelEdit}>انصراف</button>}
        </div>
      </form>
      
      <h3 style={{marginTop: '40px'}}>لیست مطالب موجود</h3>
      <div className="admin-table-container">
        <table className="admin-table">
            <thead><tr><th>عنوان</th><th>نوع</th><th>دسته</th><th>دسترسی</th><th>عملیات</th></tr></thead>
            <tbody>
            {articles.map(article => (
                <tr key={article._id}>
                <td>{article.title}</td>
                <td>{article.format}</td>
                <td>{article.category}</td>
                <td>
                    <span className={`status-pill ${article.access === 'paid' ? 'paid' : 'free'}`}>
                    {article.access === 'paid' ? `${article.price.toLocaleString('fa-IR')} تومان` : 'رایگان'}
                    </span>
                </td>
                <td>
                    <div className="table-actions">
                        <button className="btn-edit" onClick={() => handleEdit(article)}>ویرایش</button>
                        <button className="btn-delete" onClick={() => handleDelete(article._id)}>حذف</button>
                    </div>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}

export default KnowledgeManager;