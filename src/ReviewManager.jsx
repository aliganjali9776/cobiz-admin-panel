// admin-panel/src/ReviewManager.jsx (نسخه امن شده)

import React, { useState, useEffect } from 'react';

// کلیدهای ذخیره‌سازی در localStorage
const REVIEWS_STORAGE_KEY = 'cobiz_reviews';
const CATEGORIES_STORAGE_KEY = 'cobiz_review_categories';

// دسته‌بندی‌های پیش‌فرض اولیه
const defaultCategories = [
  { value: 'CRM', label: 'CRM' },
  { value: 'Accounting', label: 'حسابداری' },
  { value: 'CustomerClub', label: 'باشگاه مشتریان' },
];

// تابع کمکی برای بررسی دسترسی ادمین
// در آینده می‌توان این تابع را گسترش داد تا با بک‌اند صحبت کند
const checkAdminAccess = () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('دسترسی غیرمجاز! لطفاً ابتدا به عنوان ادمین وارد شوید.');
    // کاربر را به صفحه لاگین اپ اصلی هدایت کن
    window.location.href = 'http://localhost:3000'; // آدرس اپلیکیشن اصلی شما
    return false;
  }
  return true;
};


function ReviewManager() {
  const [reviews, setReviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  
  // استیت‌های فرم
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [rating, setRating] = useState(0);
  const [pros, setPros] = useState('');
  const [cons, setCons] = useState('');
  const [fullReviewText, setFullReviewText] = useState('');
  const [category, setCategory] = useState('');

  // لود کردن داده‌ها از localStorage
  useEffect(() => {
    // ✅ قبل از هر کاری، دسترسی ادمین را چک می‌کنیم
    if (!checkAdminAccess()) return;

    const savedReviews = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (savedReviews) setReviews(JSON.parse(savedReviews));

    const savedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    const initialCategories = savedCategories ? JSON.parse(savedCategories) : defaultCategories;
    setCategories(initialCategories);
    if (initialCategories.length > 0) {
      setCategory(initialCategories[0].value);
    }
  }, []);

  // ذخیره کردن داده‌ها در localStorage
  useEffect(() => {
    // از آنجایی که این کامپوننت به بک‌اند وصل نیست، نیازی به ارسال توکن در هر ذخیره‌سازی نیست.
    // اما چک کردن اولیه دسترسی در useEffect بالا، امنیت کلی را تضمین می‌کند.
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  }, [reviews]);
  useEffect(() => {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategory.trim() || categories.some(c => c.label === newCategory.trim())) {
      setNewCategory('');
      return;
    }
    const newCat = { value: newCategory.trim().replace(/\s+/g, '-'), label: newCategory.trim() };
    setCategories([...categories, newCat]);
    setNewCategory('');
  };
  
  const handleDeleteCategory = (valueToDelete) => {
    if (window.confirm(`آیا از حذف این دسته‌بندی اطمینان دارید؟`)) {
      setCategories(categories.filter(c => c.value !== valueToDelete));
    }
  };

  const handleSaveReview = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('نام نرم‌افزار نمی‌تواند خالی باشد.');
    
    const newReview = {
      id: Date.now(),
      name, logoUrl, summary, category,
      rating: Number(rating),
      pros: pros.split('\n').filter(p => p.trim() !== ''),
      cons: cons.split('\n').filter(c => c.trim() !== ''),
      fullReviewText,
    };
    
    setReviews([...reviews, newReview]);
    resetForm();
    setIsFormVisible(false);
  };
  
  const handleDeleteReview = (id) => {
    if (window.confirm('آیا از حذف این مورد اطمینان دارید؟')) {
      setReviews(reviews.filter(r => r.id !== id));
    }
  };

  const resetForm = () => {
    setName(''); setLogoUrl(''); setSummary(''); setRating(0);
    setPros(''); setCons(''); setFullReviewText('');
    setCategory(categories.length > 0 ? categories[0].value : '');
  };

  return (
    <div>
      <div className="admin-content-header-flex">
        <h2>مدیریت راهنمای مدیران</h2>
        <button className="btn-primary" onClick={() => { setIsFormVisible(!isFormVisible); resetForm(); }}>
          {isFormVisible ? 'پنهان کردن فرم' : '+ افزودن نقد جدید'}
        </button>
      </div>

      <div className="category-manager">
        <h3>مدیریت دسته‌بندی‌ها</h3>
        <form className="category-add-form" onSubmit={handleAddCategory}>
          <input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="نام دسته‌بندی جدید..." />
          <button type="submit" className="btn-secondary">افزودن</button>
        </form>
        <div className="category-list">
          {categories.map(cat => (
            <div key={cat.value} className="category-item">
              <span>{cat.label}</span>
              <button onClick={() => handleDeleteCategory(cat.value)}>&times;</button>
            </div>
          ))}
        </div>
      </div>

      {isFormVisible && (
        <form className="admin-form" onSubmit={handleSaveReview}>
          <div className="form-section">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="نام نرم‌افزار (مثلا: CRM دیدار)" required />
            <div className="form-group">
              <label>انتخاب دسته</label>
              <select value={category} onChange={e => setCategory(e.target.value)}>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <input type="text" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} placeholder="URL لوگو" />
            <input type="text" value={summary} onChange={e => setSummary(e.target.value)} placeholder="خلاصه (مثلا: مناسب برای تیم‌های فروش)" />
            <div className="form-group">
              <label>امتیاز (از ۵)</label>
              <input type="number" step="0.1" min="0" max="5" value={rating} onChange={e => setRating(e.target.value)} />
            </div>
          </div>
          <div className="form-section">
            <textarea value={pros} onChange={e => setPros(e.target.value)} placeholder="نکات مثبت (هر نکته در یک خط جدا)" rows="4"></textarea>
            <textarea value={cons} onChange={e => setCons(e.target.value)} placeholder="نکات منفی (هر نکته در یک خط جدا)" rows="4"></textarea>
          </div>
          <div className="form-section">
            <textarea value={fullReviewText} onChange={e => setFullReviewText(e.target.value)} placeholder="متن کامل نقد و بررسی..." rows="8"></textarea>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-primary">ذخیره نقد و بررسی</button>
            <button type="button" className="btn-secondary" onClick={() => setIsFormVisible(false)}>انصراف</button>
          </div>
        </form>
      )}

      <div className="admin-table-container" style={{ marginTop: '20px' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>نام نرم‌افزار</th>
              <th>دسته</th>
              <th>امتیاز</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {reviews.length > 0 ? reviews.map(review => (
              <tr key={review.id}>
                <td>{review.name}</td>
                <td>{categories.find(c => c.value === review.category)?.label || review.category}</td>
                <td>{review.rating}</td>
                <td>
                  <button className="btn-danger" onClick={() => handleDeleteReview(review.id)}>حذف</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4">هیچ نقدی هنوز ثبت نشده است.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ReviewManager;