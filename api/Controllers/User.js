const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/User.js");
const PlaceModel = require("../models/Place.js");
const BookingModel = require("../models/Booking.js");
const nodemailer = require("nodemailer");
require("dotenv").config();

const jwtSecret = process.env.jwtSecret;
const bcryptSalt = bcrypt.genSaltSync(10);

var passwordotp = 0;

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const user = await UserModel.findOne({ email: email });
  if (user) {
    res.status(409).json("user already exist");
  }
  try {
    const newUser = await UserModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });

    res.json(newUser);
  } catch (err) {
    res.status(422).json(err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email: email });
  if (user) {
    const passOk = bcrypt.compareSync(password, user.password);
    if (passOk) {
      jwt.sign(
        {
          email: user.email,
          id: user._id,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) {
            throw err;
          }
          res.cookie("token", token).json(user);
        }
      );
    } else {
      res.status(422).json("PAss not ok");
    }
  } else {
    res.status(422).json("Not found");
  }
};

const updatePassword = async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await UserModel.findOne({ email: email });
  if (user) {
    user.set({
      name: user.name,
      email,
      password: bcrypt.hashSync(newPassword, bcryptSalt),
    });
    jwt.sign(
      {
        email: user.email,
        id: user._id,
        isAdmin: user.isAdmin,
        isSuperAdmin: user.isSuperAdmin,
      },
      jwtSecret,
      {},
      (err, token) => {
        if (err) {
          throw err;
        }
        res.cookie("token", token).json(user);
      }
    );
    await user.save();
  } else {
    res.status(422).json("Not found");
  }
};

const profile = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, user) => {
      if (err) throw err;
      const { name, email, _id, isAdmin, isSuperAdmin } =
        await UserModel.findById(user.id);
      res.json({ name, email, _id, isAdmin, isSuperAdmin });
    });
  } else {
    res.json(null);
  }
};

const logout = (req, res) => {
  res.cookie("token", "").json(true);
};

const UpdateUser = async (req, res) => {
  const { id, name, email } = req.body;
  const checkExistingUser = await UserModel.findOne({ email: email });
  if (checkExistingUser && checkExistingUser?._id != id) {
    res.status(409).json("this mail id is already registered");
    console.log("hello");
  } else {
    const user = await UserModel.findOne({ _id: id });

    if (user) {
      user.set({
        name: name,
        email: email,
        password: user.password,
      });
      jwt.sign(
        {
          email: user.email,
          id: user._id,
          isAdmin: user.isAdmin,
          isSuperAdmin: user.isSuperAdmin,
        },
        jwtSecret,
        {},
        (err, token) => {
          if (err) {
            throw err;
          }
          res.cookie("token", token).json(user);
        }
      );
      await user.save();
    } else {
      res.status(422).json("Not found");
    }
  }
};

const ChangeUserToAdmin = async (req, res) => {
  const { id } = req.body;
  const requiredUser = await UserModel.findOne({ _id: id });
  if (requiredUser) {
    requiredUser.set({
      isAdmin: true,
    });
    await requiredUser.save();
    jwt.sign(
      {
        email: requiredUser.email,
        id: requiredUser._id,
        isAdmin: true,
        isSuperAdmin: requiredUser.isSuperAdmin,
      },
      jwtSecret,
      {},
      (err, token) => {
        if (err) {
          throw err;
        }
        res.cookie("token", token).json(user);
      }
    );
    await requiredUser.save();
  } else {
    res.status(500).json("Not found");
  }
};

const getAllUsers = async (req, res) => {
  res.json(await UserModel.find());
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const deletedUser = await UserModel.findByIdAndDelete(id);
  await BookingModel.deleteMany({ user: id });
  await PlaceModel.deleteMany({ owner: id });
  res.json(deletedUser);
};

const updateUserBySuperAdmin = async (req, res) => {
  const { id, name, email } = req.body;
  const checkExistingUser = await UserModel.findOne({ email: email });
  if (checkExistingUser && checkExistingUser?._id != id) {
    res.status(409).json("this mail id is already registered");
  } else {
    const user = await UserModel.findOne({ _id: id });

    if (user) {
      user.set({
        name: name,
        email: email,
        password: user.password,
      });
      res.json("Ok");
      await user.save();
    } else {
      res.status(422).json("Not found");
    }
  }
};

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const findUser = await UserModel.findOne({ email: email });

    if (!findUser) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(findUser);
    passwordotp = Math.floor(100000 + Math.random() * 900000);

    console.log(findUser);

    await sendOTP(email, passwordotp);
    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const findUser = await UserModel.findOne({ email });
    console.log(passwordotp);
    console.log(otp);
    if (!findUser) {
      return res.status(400).json({ error: "User not found" });
    }
    if (!findUser || passwordotp != otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Update password and clear OTP
    findUser.password = await bcrypt.hash(newPassword, 10);
    await findUser.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
module.exports = {
  register,
  login,
  profile,
  logout,
  updatePassword,
  UpdateUser,
  ChangeUserToAdmin,
  getAllUsers,
  deleteUser,
  updateUserBySuperAdmin,
  forgotPassword,
  resetPassword,
};
