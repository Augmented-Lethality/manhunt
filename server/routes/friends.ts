import e, { Router } from "express";
import { User } from '../database/models.js';
import { error } from "console";
const { Op } = require("sequelize");
export const Friends = Router();

// GET FRIENDS AND RECEIVED REQUESTS USING USER'S AUTHID
Friends.get('/:userId', async (req, res) => {
  try {
    const user = await User.findOne({where: { authId: req.params.userId }});
    
    if (!user) {
      return res.status(404).send({error: "User not found"});
    }

    // Get user's friends and received requests
    const friends = await Promise.all(user.friends.map(friendId => 
      User.findByPk(friendId, {attributes: ['username']})
    ));
    const receivedRequests = await Promise.all(user.receivedRequests.map(requesterId => 
      User.findByPk(requesterId, {attributes: ['username']})
    ));

    return res.status(200).json({
      friends: friends,
      receivedRequests: receivedRequests
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({error: "An error occurred while retrieving the friends and requests."});
  }
});

// SEND A REQUEST USING USER'S AUTHID AND FRIEND'S USERNAME
Friends.post('/:userId', async (req, res) => {
  try {
    const {userId, friendName} = req.body
    const initiator = await User.findOne({where: { authId: userId }});
    const recipient = await User.findOne({where: { username: friendName }});
    console.log(initiator, "INITIATOR")
    console.log(recipient, "recipient")
    if (!initiator) {
      return res.status(404).send({ error: "User not found" });
    } else if (!recipient) {
      return res.status(404).send({ error: "Friend not found" });
    } else if (initiator.friends && initiator.friends.includes(recipient.id)) {
      return res.status(409).send({ message: "Friendship already exists" });
    } else if (initiator.sentRequests && initiator.sentRequests.includes(recipient.id)) {
      return res.status(409).send({ message: "Request already exists" });
    } else if (initiator.receivedRequests && initiator.receivedRequests.includes(recipient.id)) {
      await addFriend(initiator, recipient);
      return res.status(201).send({ message: "Accepted already existing request." });
    } else {
      //Create new friend request
      await createFriendRequest(initiator, recipient);
      return res.status(200).send({ message: "Created request" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({error: "An error occurred while sending the friend request."});
  }
});

//HELPER FUNCITONS

//ADDS FRIENDSHIP FOR BOTH INITIATOR AND RECIPIENT
async function addFriend(initiator: User, recipient: User) {
  try {
    // Removes the request from both users' sent and received requests.
    initiator.sentRequests = initiator.sentRequests.filter(id => id !== recipient.id);
    recipient.receivedRequests = recipient.receivedRequests.filter(id => id !== initiator.id);

    recipient.sentRequests = recipient.sentRequests.filter(id => id !== initiator.id);
    initiator.receivedRequests = initiator.receivedRequests.filter(id => id !== recipient.id);

    // Adds the new friend to both users' friends list.
    initiator.friends = [...initiator.friends, recipient.id];
    recipient.friends = [...recipient.friends, initiator.id];

    // Save the updated user instances.
    await initiator.save();
    await recipient.save();

  } catch (error) {
    console.error('There was an error while adding the friends:', error);
  }
}

// CREATES FRIEND REQUEST FOR BOTH INITATOR AND RECIPIENT
async function createFriendRequest(initiator: User, recipient: User) {
  try {
    initiator.sentRequests = [...initiator.sentRequests, recipient.id];
    await initiator.save();
    recipient.receivedRequests = [...recipient.receivedRequests, initiator.id];
    await recipient.save();
  } catch (error) {
    console.error('There was an error while sending the friend request:', error);
  }
}

//DECLINES FRIEND REQUEST
async function declineFriendRequest(initiator: User, recipient: User) {
  try {
    // Removes the recipient's id from the initiator's sent requests
    if (initiator.sentRequests.includes(recipient.id)) {
      initiator.sentRequests = initiator.sentRequests.filter(id => id !== recipient.id);
      await initiator.save();
    }

    // Removes the initiator's id from the recipient's received requests
    if (recipient.receivedRequests.includes(initiator.id)) {
      recipient.receivedRequests = recipient.receivedRequests.filter(id => id !== initiator.id);
      await recipient.save();
    }

  } catch (error) {
    console.error('There was an error while declining the friend request:', error);
  }
}

// REMOVES FRIEND FOR BOTH INITIATOR AND RECIPIENT
async function removeFriend(initiator: User, recipient: User) {
  try {
    // Removes the user's id from each other's friends list
    if (initiator.friends.includes(recipient.id)) {
      initiator.friends = initiator.friends.filter(id => id !== recipient.id);
      await initiator.save();
    }

    if (recipient.friends.includes(initiator.id)) {
      recipient.friends = recipient.friends.filter(id => id !== initiator.id);
      await recipient.save();
    }

  } catch (error) {
    console.error('There was an error while removing the friend:', error);
  }
}