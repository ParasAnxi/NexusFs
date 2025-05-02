//** IMPORTS */
import mongoose, { SchemaType } from "mongoose";
import { Schema } from "mongoose";
/** USER SCHEMA */
const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      min: 2,
      max: 25,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
      max: 25,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    token: {
      type: String,
      default: "",
    },
    socketId: {
      type: String,
      default: "",
    },
    priority: {
      type: Number,
      default:0
    },
    friends: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
  },
  { timestamps: true }
);
//** FUNCTIONS */
userSchema.methods.addFriend = function(userId) {
  if (!this.friends.includes(userId)) {
    this.friends.push(userId);
  }
};

const User = mongoose.model("User", userSchema);
export default User;