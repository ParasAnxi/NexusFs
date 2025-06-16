//** IMPROTS */
import mongoose from "mongoose";

//** FILE SCHEMA */
const fileSchema = new mongoose.Schema({
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
  filename: String,
  mimeType: String,
  size: Number,
  data: Buffer,
  unqId:{
    type:String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  timeAt:{
    type:String,
    required: true
  }
});

const File = mongoose.model("File", fileSchema);
export default File;
