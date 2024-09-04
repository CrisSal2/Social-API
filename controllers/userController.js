const { User, Thought } = require('../models');
const mongoose = require('../config/connection');

module.exports = {

  async getUsers(_req, res) {
    try {
      const users = await User.find()
        .populate('thoughts', 'thoughtText createdAt reactions')
        .select('-__v');
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getSingleUser(req, res) {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
      }
      const user = await User.findById(req.params.userId)
        .select('-__v')
        .populate('thoughts', 'thoughtText createdAt reactions')
        .populate('friends', 'username');
  
      if (!user) {
        return res.status(404).json({ message: 'No user found with this ID' });
      }
      res.json(user);
    } catch (err) {
      console.error('Error fetching user:', err); // Log the error
      res.status(500).json({ message: 'Server error', error: err.message }); // Provide a cleaner error response
    }
  },

  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
        runValidators: true,
        new: true,
      });
      if (!user) {
        return res.status(404).json({ message: 'No user found with this ID' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: 'No user found with this ID' });
      }
      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async addFriend(req, res) {
    try {
      const friend = await User.findById(req.params.friendId);
      if (!friend) {
        return res.status(404).json({ message: 'No user found with friend ID' });
      }
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'No user found with this ID' });
      }
      res.json({ message: 'Friend added successfully', user });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async deleteFriend(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.userId,
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'No user found with this ID' });
      }
      res.json({ message: 'Friend removed successfully', user });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};