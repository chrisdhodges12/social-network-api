const { User, Thought } = require("../models");

const userController = {
  //get all users @ /api/users
  getAllUsers(req, res) {
    User.find({})
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => {
        res.status(400).json(err);
      });
  },

  //get one user by id @ /api/users/:userId
  getUserById({ params }, res) {
    User.findOne({ _id: params.userId })
      .populate({
        path: "thoughts",
        select: "-__v",
      })
      .select("-__v")
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with that id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  //create a user @ /api/users
  // expects { 'username', 'email'}
  createNewUser({ body }, res) {
    User.create(body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },

  //update user by id @ /api/users/:userId
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.userId }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user with this id found!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },

  //delete user @ /api/users/:userId
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.userId })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user with this id found!" });
          return;
        }
        res.json({ message: "User was deleted!" });
      })
      .catch((err) => res.status(400).json(err));
  },

  //add Friend @ /api/users/:userId/friends/:friendId
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $push: { friends: params.friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  //delete friend @ /api/users/:userId/friends/:friendId
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json({ message: "Friend removed!" });
      })
      .catch((err) => res.json(err));
  },
};

module.exports = userController;
