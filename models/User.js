const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      //regex makes sure the email address contains: some characters followed by `@` then `.`
      match: /.+\@.+\..+/,
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJson: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

//Get total friend count
UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

// create Pizza model using Schema
const User = model("User", UserSchema);

module.exports = User;
