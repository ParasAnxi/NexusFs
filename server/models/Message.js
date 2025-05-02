//** IMPORTS */
import mongoose from "mongoose";
/** MESSAGE SCHEMA */
const messageSchema = mongoose.Schema(
  {
    participants: {
      type: [String],
    },
    sender: {
      type: String,
      required: true,
    },
    receiver: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    file: {
      type: String,
      required: true,
    },
    priority: {
      type: Number,
      default: 0,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    seen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
