// admin-panel/src/UserManager.jsx

import React from 'react';

function UserManager({ users }) {
  // یک تابع برای تبدیل وضعیت دسترسی به متن فارسی
  const getAccessStatus = (user) => {
    // این منطق را می‌توانید بر اساس داده‌های واقعی خود تغییر دهید
    // مثلاً اگر کاربر اشتراک خریده باشد
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
                  هنوز کاربری ثبت‌نام نکرده است.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// کامپوننت UserManager به صورت پیش‌فرض یک آرایه خالی می‌گیرد تا در صورت نبود کاربر، خطا ندهد
UserManager.defaultProps = {
  users: []
};

export default UserManager;