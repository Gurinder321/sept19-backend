const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const userSchema = mongoose.Schema(
  {
    // full_name: {
    //   type: String,
    //   required: [true, 'First name is required'],
    //   trim: true,
    //   text: true,
    // },

    name: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      text: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      text: true,
    },
    password: {
      type: String,
      required: [true, 'password is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
