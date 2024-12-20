import mongoose from "mongoose";

const user = new mongoose.Schema({
  username: {
    require: true,
    type: mongoose.Schema.Types.String,
    unique: true,
  },
  email: {
    require: false,
    type: mongoose.Schema.Types.String,
  },
  password: {
    require: true,
    type: mongoose.Schema.Types.String,
  },
  deliveryaddress: {
    type: mongoose.Schema.Types.Mixed,
  },
  name: {
    type: mongoose.Schema.Types.String,
  },
  phonenumber: {
    type: mongoose.Schema.Types.Number,
  },
  admin: {
    type: mongoose.Schema.Types.Number,
  },
  avatarId: {
    type: mongoose.Schema.Types.Number,
  },
  shiprocket: {
    token: {
      type: mongoose.Schema.Types.String,
    },
    email: {
      type: mongoose.Schema.Types.String,
    },
    password: {
      type: mongoose.Schema.Types.String,
    },
  },
});

export const NewUser = mongoose.model("NewUser", user);
