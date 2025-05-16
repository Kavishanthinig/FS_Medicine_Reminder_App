import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [medicines, setMedicines] = useState([]);
  const navigate = useNavigate();

  
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login'); 
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
   
      <header className="header">
        <div className="app-name">Medicine Reminder App</div>
       
        <div className="auth-buttons">
          <button onClick={() => navigate('/login')}>Login</button>
          <button onClick={() => navigate('/register')}>Register</button>
        </div>
      </header>

      <div className="content">
        <h1>Welcome to  Medicine Reminder Dashboard</h1>
        <p>Here you can manage your medicine reminders.</p>
      </div>

      
      <footer className="footer">
        <p>&copy; 2025 Medicine Reminder App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
