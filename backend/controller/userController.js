const User = require("../model/userModel.js");
const jwt = require("jsonwebtoken");
const jwtSecret = "secret";
const bcrypt = require("bcryptjs");
const {
  userRegistrationSchema,
  userLoginSchema,
} = require("../validation/index.js");
const transporter = require("../config/mailConfig.js");
const contactUsSchema = require("../model/contactUsModel.js");

module.exports.createUser = async (req, res) => {
  console.log("req.body===>", req.body);

  const { error } = userRegistrationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, email, password } = req.body;
  const userData = new User({
    name,
    email,
    password,
  });
  try {
    if (
      !userData.name ||
      !userData.email ||
      !userData.password ||
      !req.body.confirmPassword
    ) {
      return res.status(404).json("Required Payload not found");
    }
    if (userData.password !== req.body.confirmPassword) {
      return res.status(404).json("Password not match");
    }

    userData.isVerified = false;

    const fetchUser = await User.find({ email: userData.email });
    if (fetchUser) {
      const emailValidation = fetchUser.filter(
        (user) => user.email === userData.email
      );
      if (emailValidation.length)
        return res
          .status(403)
          .json({ message: "this email already registered !" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    userData.password = hashedPassword;

    const saveUser = await userData.save();

    const token = jwt.sign({ user: saveUser }, jwtSecret, {
      expiresIn: "1h",
    });

    const mailData = {
      from: "noreply@gmail.com",
      to: userData.email,
      subject: "Confirmation Email",
      html: `
      <h1>Thank you for registration, please click on the link to verify your account</h1>
      <a href=${`http://localhost:4200/email-verification?token=${token}`}>Click here</a>
      `,
    };

    transporter.sendMail(mailData, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
    });

    return res.status(200).json({ saveUser });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports.loginUser = async (req, res) => {
  const { error } = userLoginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { email, password } = req.body;
  const fetchUser = await User.find({ email: email });
  if (!fetchUser.length) {
    return res.status(404).json({ error: "Email and Password are Incorrect" });
  }

  const isMatch = await bcrypt.compare(password, fetchUser[0].password);
  if (!fetchUser.length || !isMatch) {
    return res
      .status(404)
      .json({ message: "Email and Password are Incorrect" });
  }
  if (!fetchUser[0].isVerified) {
    return res.status(404).json({ message: "Please Verify your email" });
  }

  const token = jwt.sign({ user: fetchUser[0] }, jwtSecret, {
    expiresIn: "1d",
  });

  return res.status(200).json({ token });
};

module.exports.verifyUser = async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, jwtSecret);
    const { user } = decoded;
    const userDetail = await User.findOne({ _id: user._id }).exec();
    console.log("userDetail===>", userDetail);
    if (!userDetail) {
      return res.status(404).json({ message: "User not found" });
    }
    if (userDetail.isVerified) {
      return res.status(404).json({ message: "User already verified" });
    }
    user.isVerified = true;
    console.log("ITS SA  USER", user);
    await User.updateOne({ _id: user._id }, user);
    return res.status(200).json(user);
  } catch (error) {
    console.log("Verifying email error", error);
    return res.status(500).json(error);
  }
};

module.exports.resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const fetchUser = await User.find({ email: email });

    if (!fetchUser.length) {
      return res.status(404).json("User not found");
    }

    const token = jwt.sign({ user: fetchUser[0] }, jwtSecret, {
      expiresIn: "1h",
    });

    const mailData = {
      from: "noreply@gmail.com",
      to: fetchUser[0].email,
      subject: "Verify your Email",
      html: `
        <h1>Thank you for registration, please click on the link to verify your account</h1>
        <a href=${`http://localhost:4200/email-verification?token=${token}`}>Click here</a>
        `,
    };

    transporter.sendMail(mailData, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
    });

    return res
      .status(200)
      .json({ message: "Resend Email verfication successfully !" });
  } catch (error) {
    console.log("resend email verfication error", error);
    return res.status(500).json(error);
  }
};

module.exports.me = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("tokentoken", token);
    const decoded = jwt.verify(token, jwtSecret);
    console.log("decoded", decoded);
    const { user } = decoded;
    const userDetail = await User.findOne({ _id: user._id }).exec();
    if (!userDetail) {
      return res.status(404).json({ message: "User not found" });
    }
    delete user.password;
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports.contactUs = async (req, res) => {
  try {
    if(!req.body.name || !req.body.email || !req.body.message || !req.body.phone){
      return res.status(404).json({message:"Required Payload not found"});
    }
    const contactUs = new contactUsSchema(req.body);
    const saveContactUs = await contactUs.save();

    const mailData = {
      from: saveContactUs.email,
      to: "admin@nms.com",
      subject: "Contact Us Enquiry NMS",
      html: `
      <p>Name: ${saveContactUs.name}</p>
      <p>Email: ${saveContactUs.email}</p>
      <p>Message: ${saveContactUs.message}</p>
      <p>Phone: ${saveContactUs.phone}</p>
      `,
    };

    transporter.sendMail(mailData, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Contact us message sent: %s", info.messageId);
    });

    return res.status(200).json(saveContactUs);
  } catch (error) {
    return res.status(500).json(error);
  }
};
