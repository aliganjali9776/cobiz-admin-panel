import React, { useState } from 'react';
import './App.css';
import KnowledgeManager from './KnowledgeManager';
import UserManager from './UserManager';
import ReviewManager from './ReviewManager'; // ۱. ایمپورت کامپوننت جدید

function App() {
  const [activeView, setActiveView] = useState('users'); // پیش‌فرض را روی کاربران می‌گذاریم

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <h1>پنل ادمین</h1>
        <nav>
          <ul>
            <li className={activeView === 'users' ? 'active' : ''} onClick={() => setActiveView('users')}>
              مدیریت کاربران
            </li>
            {/* ۲. افزودن آیتم جدید به منو */}
            <li className={activeView === 'reviews' ? 'active' : ''} onClick={() => setActiveView('reviews')}>
              راهنمای مدیران
            </li>
            <li className={activeView === 'knowledge' ? 'active' : ''} onClick={() => setActiveView('knowledge')}>
              کتابخانه دانش
            </li>
            <li className={activeView === 'quizzes' ? 'active' : ''} onClick={() => setActiveView('quizzes')}>
              آزمون‌ها
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content">
        {activeView === 'users' && <UserManager />}
        {/* ۳. رندر کردن کامپوننت جدید */}
        {activeView === 'reviews' && <ReviewManager />}
        {activeView === 'knowledge' && <KnowledgeManager />}
        {activeView === 'quizzes' && <div><h2>مدیریت آزمون‌ها</h2><p>این بخش به زودی ساخته می‌شود...</p></div>}
      </main>
    </div>
  );
}

export default App;

