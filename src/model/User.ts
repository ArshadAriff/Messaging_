import mongoose, { Schema, Document } from "mongoose";

//this is a class /a custom data type
//String in typescript is lower case

//TODO:Think of the interface as the "rules" that describe what a message should look like in your code.
//The schema is the "rules" that describe what a message should look like in your database.
//By passing the interface to the schema, you're making sure that the "rules" in your code and your database are the same.
//TODO:

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

//this is an object of the above defined class with schema<Message>
//String in mongoose is UpperCase
const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    //regex is used for simple custom validation take from web
    match: [/.+\@.+\..+/, "please use valid email address"],
  },
  password: {
    type: String,
    required: [true, "Passsword is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "verify Code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verifyCodeExpiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
});

//Model is to be defined
//to ensure that the server is already running or is to be initialized?
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
