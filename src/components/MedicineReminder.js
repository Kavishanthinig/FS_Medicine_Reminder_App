import React, { useState, useEffect } from 'react';
import './MedicineReminder.css';

const MedicineReminder = () => {
  const [medicines, setMedicines] = useState([]);
  const [form, setForm] = useState({ name: '', dosage: '', time: '', email: '' });

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5);
      medicines.forEach((med) => {
        if (med.time === currentTime) {
          notifyUser(med);
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [medicines]);

  const notifyUser = (med) => {
    if (Notification.permission === 'granted') {
      new Notification('⏰ Medicine Reminder', {
        body: `${med.name} - ${med.dosage} now!`,
        icon: 'https://cdn-icons-png.flaticon.com/512/2920/2920244.png',
      });
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedMedicines = [...medicines, form];
    setMedicines(updatedMedicines);
    setForm({ name: '', dosage: '', time: '', email: '' });

    try {
      const response = await fetch('http://localhost:5000/api/medicines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Failed to save medicine reminder');
      }

      console.log('Medicine reminder saved successfully');
    } catch (error) {
      console.error('Error saving medicine reminder:', error);
    }
  };

  return (
    <div className="app">
      <h1>Medicine Reminder</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Medicine Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="dosage"
          placeholder="Dosage"
          value={form.dosage}
          onChange={handleChange}
          required
        />
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Reminder</button>
      </form>

      <h2>Scheduled Medicines</h2>
      <ul>
        {medicines.map((med, index) => (
          <li key={index}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/2920/2920244.png"
              alt="pill"
            />
            <div className="medicine-info">
              <strong>{med.name}</strong>
              <span>{med.dosage}</span>
              <div className="time">
                <i className="far fa-clock"></i>
                {med.time}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MedicineReminder;
