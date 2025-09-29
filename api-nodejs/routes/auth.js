const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateOTP = require("../services/generateOTP");
const User = require("../models/user");
const auth = require("../middleware/auth");
const sendMailOtp = require("../services/sendMailOtp");

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    const otp = generateOTP();
    const otpTime = new Date(Date.now() + 3600 * 1000);

    let user = await User.findOne({
      email: {
        $regex: email,
        $options: "i",
      },
    });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({ email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.otp = otp;
    user.otpTime = otpTime;
    user.status = "WAIT_OTP";

    await user.save();

    sendMailOtp(user.email, user.otp);

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      "secret", // use a better secret in production
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Signin route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({
      email: {
        $regex: email,
        $options: "i",
      },
    });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, "secret", { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        firstName: user?.firstName,
        status: user?.status,
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Signin route
router.post("/check-otp", auth, async (req, res) => {
  const { otp } = req.body;

  try {
    const user = await User.findById(req.user.id).select("-password");
    const otpNew = generateOTP();

    if (!user) {
      user.otp = otpNew;
      return res.status(404).json({ error: "User not found" });
    }

    if (user.otp !== otp) {
      user.otp = otpNew;
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (user.otpTime < new Date()) {
      user.otp = otpNew;
      return res.status(400).json({ error: "OTP has expired" });
    }

    user.status = "WAIT_INFORMATION";
    await user.save();

    res.status(200).json({ message: "OTP is valid", status: user?.status });
  } catch (err) {
    res.status(500).json({ error: "Error checking OTP" });
  }
});

// Signin route
router.post("/forgot", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({
      email: {
        $regex: email,
        $options: "i",
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpTime = new Date(Date.now() + 3600 * 1000);
    await user.save();

    sendMailOtp(user.email, user.otp);

    res.status(200).json({ message: "OTP has been sent to your email" });
  } catch (err) {
    res.status(500).json({ error: "Error checking OTP" });
  }
});

// Signin route
router.post("/check-otp-forgot", async (req, res) => {
  const { otp, email, password: newPassword } = req.body;

  try {
    const user = await User.findOne({
      email: {
        $regex: email,
        $options: "i",
      },
    }).select("-password");
    const otpNew = generateOTP();

    if (!user) {
      user.otp = otpNew;
      return res.status(404).json({ error: "User not found" });
    }

    if (user.otp !== otp) {
      user.otp = otpNew;
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (user.otpTime < new Date()) {
      user.otp = otpNew;
      return res.status(400).json({ error: "OTP has expired" });
    }

    user.status = "DONE";
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      "secret", // use a better secret in production
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, message: "OTP is valid", status: user?.status });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error checking OTP" });
  }
});

module.exports = router;
