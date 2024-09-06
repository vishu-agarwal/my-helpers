const userModel = require("../model/UserModel");

const nodemailer = require("nodemailer");

/*
https://stackoverflow.com/questions/60701936/error-invalid-login-application-specific-password-required

If you have enabled 2-factor authentication on your Google account you can't use your regular password to access Gmail programmatically.
 You need to generate an app-specific password and use that in place of your actual password.

Steps:

Log in to your Google account Go to My Account > Sign-in & Security > App Passwords (Sign in again to confirm it's you) 
Scroll down to Select App (in the Password & sign-in method box) and choose Other (custom name) Give this app password a name,
 e.g. "nodemailer" Choose Generate Copy the long generated password and paste it into your Node.js script instead of your actual Gmail password.
 */

//call from otp generate function
async function otpFunction(email) {
  const receiverMail = email;
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log("otp--", otp);
  const mailText =
    "MyHelpers Login OTP is :: " + otp + " . \nIt is expired after One minute!";
  console.log(mailText, "text", receiverMail, "mail");
  try {
    let testAccount = await nodemailer.createTestAccount();
    // create reusable transporter object using the default SMTP transport
    // let transporter = nodemailer.createTransport({
    //   host: "smtp.gmail.com",
    //   service: "gmail",
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: "realadtest@gmail.com", // generated ethereal user
    //     pass: "smartdevs@123", // generated ethereal password
    //   },
    // });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "realadtest@gmail.com", // generated ethereal user
        pass: "smartdevs@123", // generated ethereal password
      },
    });
    console.log("transporter----", transporter);
    let info = await transporter.sendMail({
      from: "realadtest@gmail.com", // sender address
      to: receiverMail, // list of receivers
      subject: "Otp SMS My Helpers ✔", // Subject line
      text: mailText, // plain text body
    });

    if (info) {
      return otp;
    } else {
      throw new Error("Some problem while sending OTP !");
    }
  } catch (error) {
    console.log("error---", error);
    return error.message;
  }
}
// generate otp at otp send and resend
const otpLoginController = async (req, res) => {
  try {
    const role = req.params.role.charAt(0);
    const email = req.body.email;
    const found = await userModel.find({ email: email });
    if (found.length) {
      const fnd_role = found[0]?.r_id.charAt(0);
      if (role !== fnd_role) {
        throw new Error("You are unauthorized for this role!");
      } else {
        const otp = await otpFunction(email);
        const updateOtp = await userModel.findOneAndUpdate(
          { email: email },
          { otp: otp },
          { new: true }
        );
        return res
          .status(200)
          .send({ message: "OTP Message sent successfully.", otp });
      }
    }
    //call otp function
    const otp = await otpFunction(email);
    const userLogin = {
      email: email,
      otp,
    };
    // generate r_id depends on role
    const id = await userModel.findOne().sort({ createdAt: -1 });
    let rid;
    if (id) {
      rid = id.r_id.slice(1);
    } else {
      rid = 100;
    }
    const r_id = role + ++rid;
    const user = { r_id, ...userLogin };
    newUser = new userModel(user);
    await newUser.save();
    return res
      .status(200)
      .send({ message: "OTP Message sent successfully.", otp });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const loginController = async (req, res) => {
  try {
    const found = await userModel.findOne({ email: req.body.email });
    const user = new userModel(found);
    const token = await user.generateAuthToken();
    const removeOtp = await userModel.findOneAndUpdate(
      { email: found.email },
      { otp: " " },
      { new: true }
    );
    return res.status(200).send({ removeOtp, token });
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports = {
  loginController,
  otpLoginController,
};
