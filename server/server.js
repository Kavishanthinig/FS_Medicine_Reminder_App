const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://localhost:27017/healthapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});
const User = mongoose.model('User', userSchema);


const medicineSchema = new mongoose.Schema({
  name: String,
  dosage: String,
  time: String,
  email: String, 
});
const Medicine = mongoose.model('Medicine', medicineSchema);


app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ msg: 'User registered successfully' });

  } catch (err) {
    console.error('Error in registration:', err);
    res.status(500).json({ msg: 'Server error during registration' });
  }
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    res.status(200).json({ msg: 'Login successful', user: { name: user.name, email: user.email } });

  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ msg: 'Server error during login' });
  }
});


app.post('/api/medicines', async (req, res) => {
  try {
    const { name, dosage, time, email } = req.body;

    const newMedicine = new Medicine({
      name,
      dosage,
      time,
      email,
    });

    await newMedicine.save();
    res.status(201).json({ msg: 'Medicine reminder saved successfully' });
  } catch (err) {
    console.error('Error saving medicine reminder:', err);
    res.status(500).json({ msg: 'Server error saving medicine reminder' });
  }
});


app.get('/api/medicines', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.status(200).json(medicines);
  } catch (err) {
    console.error('Error fetching medicines:', err);
    res.status(500).json({ msg: 'Server error fetching medicines' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});