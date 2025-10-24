import UserModel from "../models/user.js";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Function to validate email domain
const validateEmailDomain = (email) => {
  const domain = email.substring(email.lastIndexOf('@') + 1);
  return domain.toLowerCase() === 'bitsathy.ac.in';
};

// Function to determine role based on email
const determineRole = (email) => {
  const superAdminEmails = [
    'svj@bitsathy.ac.in',
    'surya@bitsathy.ac.in',
    'harisastha@bitsathy.ac.in'
  ];
  if (superAdminEmails.includes(email.toLowerCase())) {
    return 'super admin';
  }
  const charBeforeAt = email.charAt(email.indexOf('@') - 1);
  if (/[a-zA-Z]/.test(charBeforeAt)) {
    return 'admin';
  } else if (/[0-9]/.test(charBeforeAt)) {
    return 'user';
  }
  return 'user'; // Default role
};

const Register = async (req, res) => {
  try {
    console.log("Register request received:", req.body, req.file);
    const { Register, email, password } = req.body;
    if (!Register || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate email domain
    if (!validateEmailDomain(email)) {
      return res.status(400).json({
        success: false,
        message: "Email must belong to bitsathy.ac.in domain",
      });
    }

    const existUser = await UserModel.findOne({ email });
    if (existUser) {
      return res.status(409).json({
        success: false,
        message: "User Already Exists",
      });
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    
    // Determine role based on email
    const role = determineRole(email);

    const NewUser = new UserModel({
      Register,
      email,
      password: hashedPassword,
      role,
      profile: req.file ? req.file.path : undefined, // Handle profile image
    });
    await NewUser.save();
    return res.status(201).json({
      success: true,
      message: "User Registered successfully",
      user: {
        email: NewUser.email,
        role: NewUser.role
      },
    });
  } catch (error) {
    console.error('Register error:', {
      message: error.message,
      stack: error.stack,
      body: req.body,
      file: req.file,
    });
    return res.status(500).json({
      success: false,
      message: `Internal server error: ${error.message}`,
    });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate email domain
    if (!validateEmailDomain(email)) {
      return res.status(400).json({
        success: false,
        message: "Email must belong to bitsathy.ac.in domain",
      });
    }

    const FindUser = await UserModel.findOne({ email });
    if (!FindUser) {
      return res.status(400).json({
        success: false,
        message: "No user found",
      });
    }

    // Verify role consistency
    const expectedRole = determineRole(email);
    if (FindUser.role !== expectedRole) {
      return res.status(403).json({
        success: false,
        message: "Role mismatch. Please contact support.",
      });
    }

    const comparePassword = await bcryptjs.compare(password, FindUser.password);
    if (!comparePassword) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: FindUser._id, email: FindUser.email, role: FindUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.status(200).json({
      success: true,
      message: "Login successful",
      user: { 
        email: FindUser.email,
        role: FindUser.role
      },
      token,
    });
  } catch (error) {
    console.log('Login error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const Logout = async (req, res) => {
  try {
    res.clearCookie('token');
    res.status(200).json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.log('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const editUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No user ID found in token",
      });
    }

    // Check if the authenticated user is an admin or super admin
    const authenticatedUser = await UserModel.findById(req.user.id);
    if (!authenticatedUser || !['admin', 'super admin'].includes(authenticatedUser.role)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized - Only admins or super admins can edit users",
      });
    }

    const { id } = req.params;
    const { name, email, role, Register } = req.body;

    // Validate inputs
    if (!email || !role) {
      return res.status(400).json({
        success: false,
        message: "Email and role are required",
      });
    }

    // Validate email domain
    if (!validateEmailDomain(email)) {
      return res.status(400).json({
        success: false,
        message: "Email must belong to bitsathy.ac.in domain",
      });
    }

    // Validate role
    const validRoles = ['admin', 'user', 'super admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Role must be 'admin', 'user', or 'super admin'",
      });
    }

    // Check if email is already in use by another user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser && existingUser._id.toString() !== id) {
      return res.status(409).json({
        success: false,
        message: "Email is already in use by another user",
      });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { name, email, role, Register },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        register: updatedUser.Register,
      },
    });
  } catch (error) {
    console.error('editUser error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No user ID found in token",
      });
    }

    // Check if the authenticated user is an admin or super admin
    const authenticatedUser = await UserModel.findById(req.user.id);
    if (!authenticatedUser || !['admin', 'super admin'].includes(authenticatedUser.role)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized - Only admins or super admins can delete users",
      });
    }

    const { id } = req.params;

    // Prevent admin or super admin from deleting themselves
    if (id === req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Admins or super admins cannot delete themselves",
      });
    }

    const userToDelete = await UserModel.findByIdAndDelete(id);
    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error('deleteUser error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getUsers = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No user ID found in token",
      });
    }

    // Check the role of the authenticated user
    const authenticatedUser = await UserModel.findById(req.user.id).select('-password');
    if (!authenticatedUser) {
      return res.status(404).json({
        success: false,
        message: "Authenticated user not found",
      });
    }

    let users;
    if (['admin', 'super admin'].includes(authenticatedUser.role)) {
      // Admins and super admins can see all users
      users = await UserModel.find().select('-password');
    } else {
      // Non-admins can only see their own details
      users = [authenticatedUser];
    }

    return res.status(200).json({
      success: true,
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        register: user.Register,
      })),
    });
  } catch (error) {
    console.error('getUsers error:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { email, name, sub: googleId } = ticket.getPayload();

    // Validate email domain
    if (!validateEmailDomain(email)) {
      return res.status(400).json({
        success: false,
        message: "Email must belong to bitsathy.ac.in domain",
      });
    }

    const role = determineRole(email);

    let user = await UserModel.findOne({ email });
    if (!user) {
      user = new UserModel({
        googleId,
        email,
        name,
        role,
      });
      await user.save();
    } else if (user.role !== role) {
      // Update role if it has changed (e.g., super admin assignment)
      user.role = role;
      await user.save();
    }

    const jwtToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const redirectUrl = ['admin', 'super admin'].includes(role) ? '/home' : '/home';
    res.status(200).json({
      success: true,
      message: "Google Login successful",
      user: { email: user.email, role: user.role },
      token: jwtToken,
      redirectUrl,
    });
  } catch (error) {
    console.error('googleLogin error:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export { Register, Login, Logout, getUsers, editUser, deleteUser, googleLogin };