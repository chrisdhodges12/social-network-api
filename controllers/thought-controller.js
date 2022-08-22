const { User, Thought } = require("../models");

const thoughtController = {

    //get all thoughts @ /api/thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .select("-__v")
        .sort({ _id: -1 })
        .then((dbThoughtData) => res.json(dbThoughtData))
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    //get thought by id @ /api/thoughts/:thoughtId
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
        .select("-__v")
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.json({ message: "No thought found with this id!" });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.json(err));
    },

    //add a thought @ /api/thoughts
    //  expects { 'username', 'userId', 'thoughtText' }
    createNewThought({ body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
            return User.findByIdAndUpdate(
                body.userId,
                { $push: { thoughts: _id } },
                { new: true }
            );
        })
        .then((dbUserData) => {
            if (!dbUserData) {
                res.status(404).json({ message: "No user found with this id!" });
                return;
            }
            res.json({ message: "Thought created!" });
        })
        .catch((err) => res.json(err));
    },

    //update thought @ /api/thoughts/:thoughtId
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $set: body },
            { new: true, runValidators: true }
        )
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.json({ message: "No thought found with this id!" });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.json(err));
    },

    //delete a thought @ /api/thoughts/:thoughtId
    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.json({ message: "No thought found with this id!" });
                return;
            }
            res.json({ message: "Thought deleted!" });
        })
        .catch((err) => res.json(err));
    },

    //create a reaction to a thought @ /api/thoughts/:thoughtId/reactions
    //expects { 'reactionBody', 'username' }
    createReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
        .then ((dbThoughtData) => {
            if (!dbThoughtData) {
                res.status(404).json({ message: "No thought found with this id!" });
                return;
            }
            res.json(dbThoughtData);
        })
        .catch((err) => res.json(err));
    },

    // remove a reaction @ /api/thoughts/:thoughtId/reactions/:reactionId
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
        .then((dbThoughtData) => {
            if (!dbThoughtData) {
                res.json({ message: "No thought found with this id!" });
                return;
            }
            res.json({ message: "Reaction removed!" });
        })
        .catch((err) => res.json(err));
    }
};


module.exports = thoughtController;