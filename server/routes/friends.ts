import e, { Router } from "express";
import { Friend, User } from '../database/models.js';
const { Op } = require("sequelize");
export const Friends = Router();

//GET RELATIONSHIPS
Friends.get('/:userId', async (req, res) => {
  try {
    const authId = req.params.userId;
    const status = req.query.status;
    
    let relationships;
    
    if (status) {
      relationships = await Friend.findAll({
        where: {
          status: status,
          [Op.or]: [
            { userId: authId },
            { friendId: authId }
          ]
        },
        attributes: ['userId', 'friendId', 'status'], 
        include: [
          { model: User, as: 'Self', attributes: [ 'username'] },
          { model: User, as: 'Other', attributes: ['username'] }
        ]
      });
    } else {
      relationships = await Friend.findAll({
        where: {
          [Op.or]: [
            { userId: authId },
            { friendId: authId }
          ]
        },
        attributes: ['userId', 'friendId', 'status'], 
        include: [
          { model: User, as: 'Self', attributes: ['username'] },
          { model: User, as: 'Other', attributes: ['username'] }
        ]
      });
    }

    //sort the relations to only include the friend's authId
    console.log(relationships);
    const relations = relationships.map(relationship => {
      if (relationship.dataValues.userId === authId) {
        return {
          friend: relationship.dataValues.friendId,
          status: relationship.dataValues.status
        }
      }
      else {
        return {
          friend: relationship.dataValues.userId,
          status: relationship.dataValues.status
        }
      }
    })
    res.status(200).send(relations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while trying to retrieve friends.' });
  }
});

//FRIEND REQUEST
Friends.post('/', async (req, res) => {
  try {
    const { initiator, requestee } = req.body;
    if (initiator === requestee) {
      return res.status(400).send({ message: "User ID and Friend ID cannot be the same." });
    }
    
    // Ensure both users exist
    const user1 = await User.findOne({ where: { authId: initiator } });
    const user2 = await User.findOne({ where: { authId: requestee } });
    if (!user1 || !user2) {
      return res.status(404).send({message: 'Could not find user(s)'});
    }

    // Check if this friendship already exists
    const existingFriendship = await Friend.findOne({
      where: {
        [Op.or]: [
          { initiatorId: initiator, requesteeId: requestee },
          { initiatorId: requestee, requesteeId: initiator }
        ]
      }
    });

    if (existingFriendship) {
      if(existingFriendship.status === 'accepted'){
        return res.status(400).send({ message: "This relationship already exists." });
      } else if(existingFriendship.status === 'pending' && existingFriendship.initiatorId === initiator) {
        return res.status(400).send({ message: "There is already a pending friend request" });
      } else if(existingFriendship.status === 'pending' && existingFriendship.requesteeId === initiator) {
        existingFriendship.status = 'accepted';
        await existingFriendship.save();
        return res.status(200).send({ message: "User accepted an existing request" });
      }
    }

    // Create the new friendship
    const newFriendship = await Friend.create({
      initiatorId: initiator,
      requesteeId: requestee,
      status: 'pending'
    });

    return res.status(201).send(newFriendship);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "An error occurred while adding the friend." });
  }
});

//FRIEND REQUEST RESPONSE
Friends.patch('/accept/:id', async (req, res) => {
  const { friendshipAccepted } = req.body;
  try {
    const friendRequest = await Friend.findByPk(req.params.id);
    if (!friendRequest) {
      return res.status(404).send({message: 'Friend request not found'});
    }
    if (friendshipAccepted){
      friendRequest.status = 'accepted';
      await friendRequest.save();
      res.status(200).send({message: 'Friend request accepted'});
    } else {
      
    }
  } catch (error) {
    res.status(500).send({message: 'An error occurred', error});
  }
});

//DELETE FRIENDSHIP
Friends.delete('/:userId/:friendId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const friendId = req.params.friendId;

    const result = await Friend.destroy({
      where: {
        userId: userId,
        friendId: friendId
      }
    });

    if (result) {
      res.status(200).json({ message: 'Friendship deleted.' });
    } else {
      res.status(404).json({ message: 'Friendship not found.' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'An error occurred while trying to delete the friendship.' });
  }
});
