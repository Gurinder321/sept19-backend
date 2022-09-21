const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const colors = require('colors');
const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 5500;
connectDB();

const app = express();
app.use(cors());

// middleware
app.use(express.json());
app.use(express.urlencoded());

app.post('/api/register', async (req, res) => {
  console.log(req.body);

  const user_exists = await User.findOne;
  ({
    email: req.body.email.trim(),
  });
  if (user_exists) {
    return res.status(400).json({
      message: `User already exists`,
      status: 400,
    });
  }
  // register
  try {
    const hashed_password = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10));
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      //hash password fd
      password: hashed_password,
    });
    if (!user) {
      //
      return res.status(500).json({
        message: `Unable to create user`,
        status: 500,
      });
    }
    const jwt_token = jwt.sign({ id: user._id, operation: 'auth' }, 'secretkeydata', {
      expiresIn: '10d',
    });
    return res.status(200).json({
      message: `User has been created`,
      status: 200,
      token: jwt_token,
    });

    // res.json({ status: 'ok' });
  } catch (error) {
    res.status(500).json({ status: 'error' });
  }
});

// login
app.post('/api/login', async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
  });

  if (!user) {
    return res.status(500).json({ status: 'error', error: 'Invalid login' });
  }

  const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

  if (isPasswordValid) {
    //
    const token = jwt.sign(
      {
        id: user._id,
        operation: 'auth',
      },
      'secretkeydata',
      { expiresIn: '10d' }
    );

    return res.status(200).json({ status: 'ok', token });
  } else {
    return res.status(500).json({ status: 'error', user: false });
  }
});

app.listen(port, () => console.log(`Server start on port ${port}`));
