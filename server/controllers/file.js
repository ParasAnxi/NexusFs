//** IMPORTS */
import Message from "../models/Message.js";
import User from "../models/User.js";

export const saveMessage = async(req, res)=>{
    try{
        const {sender, receiver, filename,file,priority} = req.body;
        console.log(sender,receiver,filename,file)
        const senderExist = await User.findOne({
            userName: sender
        });
        const receiverExist = await User.findOne({
            userName: receiver
        });
        if(!senderExist || !receiverExist){
            return res.status(404).json({error: "User not found"})
        }
        const data = new Message({
          participants: [sender, receiver],
          sender: senderExist.userName,
          receiver: receiverExist.userName,
          filename,
          file,
          priority,
        });
        const sM = await data.save();
        res.status(200).json({message: sM});
    }catch(e){
        res.status(401).json({error:e});
    }
};
//** GET MESSAGED USERS */
export const messagedPeople = async (req, res) => {
  try {
    const { userName } = req.body;

    const allMessages = await Message.find({
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
  const chats = await Message.find({
    participants: { $all: [sender, receiver] },
  }).sort({ updatedAt: -1 });
  const allMessages = chats
    .map((message) => {
      return {
        sender: message.sender,
        filename: message.filename,
        priority: message.priority,
        file: message.file,
        time: message.sentAt,
      };
    }).reverse();
  res.status(200).json({ messages: allMessages });
};
