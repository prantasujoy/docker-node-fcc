const User = require("../models/userModels");
const bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
  const { username, password } = req.body;

  const hashedPasswod = await bcrypt.hash(password, 12);

  try {
    const newuser = await User.create({
      username,
      password: hashedPasswod,
    });
    req.session.user = newuser;

    res.status(201).json({
      status: "Success",
      data: {
        user: newuser,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    req.session.user = user;

    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User Not Found",
      });
    }

    const passwordValid = bcrypt.compare(password, user.password);

    if (passwordValid) {
      res.status(200).json({
        status: "success",
        data: {
          user: username,
        },
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Incorrect username or password",
      });
    }
  } catch (error) {}
};
