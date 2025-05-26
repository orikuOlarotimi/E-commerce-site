const { createSecretToken } = require("../utils/SecretToken");
const User = require('../models/userModel'); 
const bcrypt = require('bcryptjs');

const signupUser = async (req, res ) => {
  try {
      const { name, email, mobile, password } = req.body;
      
    // Basic validation
    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email,
      mobile,
      password: hashedPassword     
    });
      
    const token = createSecretToken(newUser._id);
    
    console.log("Generated token:", token);

    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
      secure: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user: newUser, token });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error });
  }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
  
      // Check if fields are provided
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      // Find user
        const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const token = createSecretToken(user._id);
      
       res.cookie("token", token, {
         withCredentials: true,
         secure: false,
       httpOnly: false,
     });
     res.status(201).json({ message: "User logged in successfully", success: true, user, token });

      // Success — send user data (in real apps, send JWT token too)
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
};
  
const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: false, // match how you set it
    secure: false,   // for localhost; use true in production (with https)
    sameSite: "lax",
  });

  return res.status(200).json({ message: "Logged out successfully" });
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    signupUser,
    loginUser,
    logoutUser,
    getUserById
};
