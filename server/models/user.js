import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  Register: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  profile: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'super admin'], // Added superadmin
    default: 'user'
  },
  googleId: {
    type: String,
  }
}, { timestamps: true });

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel;