//** IMPORTS */
import User from "../models/User.js";
import File from "../models/File.js";

//** UPLOAD */
export const uploadFile = async(req,res)=>{
  try{
    const {sender, receiver, unqId, timeAt} = req.body;
    const file = req.file;
    console.log(unqId)
    if(!file) return res.status(400).json({message: "NO file uploaded"});
    const newFile = new File({
      participants: [sender, receiver],
      unqId,
      sender,
      receiver,
      filename: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      data: file.buffer,
      timeAt
    });
    await newFile.save();
    res.status(200).json({message: "Upload success"});
  }catch(error){
    res.status(500).json({error: error})
  }
};

//** GET SINGLE FILE */
export const getFile = async (req, res) => {
  try {
    const file = await File.findOne({unqId:req.params.unqId});
    if (!file) return res.status(404).send('Not found');

    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `inline; filename="${file.filename}"`,
    });
    // console.log(file);
    res.send(file.data);
    
  } catch (error) {
    res.status(500).json({ message: 'Fetch failed' });
  }
};


//** GET MESSAGED USERS */
export const messagedPeople = async (req, res) => {
  try {
    const { userName } = req.body;

    const allMessages = await File.find({
      $or: [{ sender: userName }, { receiver: userName }],
    });

    const users = new Set();
    allMessages.forEach((message) => {
      if (message.sender !== userName) {
        users.add(message.sender);
      }
      if (message.receiver !== userName) {
        users.add(message.receiver);
      }
    });

    const userList = Array.from(users);

    const userDetails = await User.find({
      userName: { $in: userList },
    });

    const userListMap = new Map();
    userDetails.forEach((user) => {
      userListMap.set(user.userName, {
        userId: user._id,
      });
    });

    const enrichedUsers = userList.map((userName) => ({
      userName,
      ...userListMap.get(userName),
    }));

    res.status(200).json({ users: enrichedUsers });
  }catch (error) {
    res.status(401).json({ error: error.message });
  }
};
//** GET PARTICIPATNS MESSAGES */
export const getParticipantsChats = async (req, res) => {
  const { sender, receiver } = req.body;
  const senderExist = await User.findOne({ userName: sender });
  if (!senderExist) {
    return res.status(404).json({ error: "User not found!" });
  }
  const chats = await File.find({
    participants: { $all: [sender, receiver] },
  }).sort({ updatedAt: -1 });
  const allMessages = chats
    .map((message) => {
      return {
        id: message._id,
        unqId: message.unqId,
        sender: message.sender,
        filename: message.filename,
        file: message.file,
        mimeType: message.mimeType,
        size:message.size,
        timeAt: message.timeAt,
      };
    }).reverse();
  res.status(200).json({ messages: allMessages });
};

//** DELETE */
export const deleteFile = async(req,res)=>{
  try{
    const file = await File.findOneAndDelete({ unqId: req.params.unqId });
    if(!file)return res.staus(400).json({error: "file not found!"});
    res.status(200).json({ message: "Message deleted successfully" });
  }catch(e){
    res.status(400).json({error: e})
  }
}