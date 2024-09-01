//importing the dotenv object from the installed module
import dotenv from "dotenv";

//Configuring the .dotenv environment variables
dotenv.config();

//Importing bcryptjs to encrypt password
import bcrypt from "bcryptjs";

//Importing the User model for our database
import User from "./models/User.js";
//importing DB connection
import connectDB from "./config/db.js";

//importing bodyParser to help parse JSON request body to Javascript Object
import bodyParser from "body-parser";

//importing express from express module
import express from "express";

//initialising an express object
const app = express();

//Initialising the DB connection
connectDB();

//Using body parser in the middleware
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//Creating the post request route
app.post("/api/v1/post-user", async (req, res) => {
  try {
    const { fullName, email, passWord, isEmailVerified } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passWord, salt);
    const result = await User.create({
      fullName,
      email,
      passWord: hashedPassword,
      isEmailVerified,
    });
    if (result) {
      return res.status(200).json({ message: "User successfully added to Db" });
    }
    res.json({ message: "Something Went Wrong" });
  } catch (error) {
    console.log(`Error posting User to Db : ${error}`);
  }
});

//Creating a Get Request Route
app.get("/api/v1/get-user", async (req, res) => {
  try {
    const user = await User.find({});
    if (user) {
      console.log(`User: ${user}`);
      return res.status(200).json({ message: `User exists: ${user}` });
    } else {
      return res.json({ message: "User does not exist" });
    }
  } catch (error) {
    console.log(`Error fetching User from Db : ${error}`);
  }
});

//Creating a Put route used to change a User information using the Id property
app.put("/api/v1/put-user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedName = process.env.Update_Name;
    const updatedEmail = process.env.Update_Email;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullName: updatedName,
      },
      { email: updatedEmail }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User does not exist" });
    }
    console.log(`Updated User: ${updatedUser}`);
    res.status(200).json({ message: `Updated User: ${updatedUser}` });
  } catch (error) {
    console.log(`Error from Db operation : ${error}`);
  }
});

//Creating a route for DELETE end point
app.delete("/api/v1/delete-user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User does not exist" });
    }
    console.log(`Deleted User: ${deletedUser}`);
    res
      .status(200)
      .json({ message: `User data sucessfully deleted from database` });
  } catch (error) {
    console.log(`Error from Db operation : ${error}`);
  }
});

//importing the port number from the dotenv file
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is listening at port number ${port}`);
});
