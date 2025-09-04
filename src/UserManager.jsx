// admin-panel/src/UserManager.jsx (نسخه امن شده)

import React, { useEffect, useState } from 'react';

// تابع کمکی برای ارسال درخواست‌های امن به بک‌اند
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    alert('دسترسی غیرمجاز! لطفاً ابتدا به عنوان ادمین وارد شوید.');
    window.location.href = 'http://localhost:3000'; // آدرس اپلیکیشن اصلی شما
    return Promise.reject(new Error('No auth token found'));
  }

  const headers = {
    ...options.headers,
    'Authorization': token,
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401 || response.status === 403) {
    alert('نشست شما منقضی شده است. لطفاً دوباره وارد شوید.');
    window.location.href = 'http://localhost:3000';
    return Promise.reject(new Error('Unauthorized'));
  }

  return response;
};

function UserManager() {
  const [users, setUsers] = useState([]);

  // ✅ لود کردن لیست کاربران به صورت امن
  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetchWithAuth('http://localhost:5001/api/users'); // آدرس API برای گرفتن همه کاربران
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          throw new Error('خطا در دریافت لیست کاربران');
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    getUsers();
  }, []);

  const getAccessStatus = (user) => {
    // در آینده می‌توانید این بخش را بر اساس اشتراک کاربر کامل کنید
    return "رایگان"; 
  };

  return (
    <div>
      <h2 className="admin-content-header">مدیریت کاربران</h2>
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>نام</th>
              <th>شماره تلفن</th>
              <th>شرکت</th>
              <th>پوزیشن</th>
              <th>وضعیت پرداخت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map(user => (
                <tr key={user.phone || user._id}>
                  <td>{user.name}</td>
                  <td>{user.phone}</td>
                  <td>{user.companyName || '-'}</td>
                  <td>{user.position || '-'}</td>
                  <td>
                    <span className={`status-pill ${getAccessStatus(user) === 'رایگان' ? 'free' : 'paid'}`}>
                      {getAccessStatus(user)}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-edit">ویرایش</button>
                      <button className="btn-delete">حذف</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  در حال بارگذاری کاربران...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManager;