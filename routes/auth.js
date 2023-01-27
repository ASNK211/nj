const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const _ = require('lodash');
const nodemailer = require('nodemailer');
const { result } = require("lodash");

const transporter = nodemailer.createTransport({
    name: 'domainname',
    host: 'domainname.com',
    port: 443,
    secure: true,
    service: 'gmail',
    auth: {
      user: 'asnk2aa@gmail.com',
      pass: 'rrnhxznxsyeoxeds'
    }
  });

//REGISTER
router.post("/register", async (req, res) => {
  const { email, password, inviteId } = new User({
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    inviteId: req.body.inviteId
  });
  User.findOne({ email: email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({ error: "user already exists" })
    } else {
      const accessToken = jwt.sign({ password, email, inviteId },
        process.env.JWT_account_activated,
        { expiresIn: "50m" }
      );
      const mailOptions = {
        from: 'HATCHAIN',
        to: email,
        subject: 'HATCHAIN ',
        html: `<div>
    <h1>WELCOME TO HATCHAINS</h1>
    <a href="${process.env.CLIENT_URL}activated/${accessToken}">Press here to activate your account then you can go to log in</a>
    </div>`
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log('Unable to send the mail :'+error.message);
        } else {
          return res.status(200).json({ message: "please go to your email for your activation account" })
        }
      });
    }
  })

});
router.post("/register/activated", async (req, res) => {
  const accessT = req.body.sorer
  if (accessT) {
    jwt.verify(accessT, process.env.JWT_account_activated, function (err, decodedToken) {
      if (err) {
        return res.status(400).json({ message: "incorrect or Expired link" })
      }
      const { inviteId, email, password } = decodedToken;

      User.findOne(email).exec(async (err, user) => {
        if (user) {
          return res.status(400).json({ error: "user already exists" })
        }
        const newUser = new User({ email, password, inviteId })
        console.log(newUser)
        const orderNumber = await User.find().count()
        const numb = Number(5732691000) + Number(orderNumber) 
        newUser.userId = numb
        try {
          const sendUser = await newUser.save();
          console.log(sendUser)
          // const sendUser = _.pick(senxdUser, ["_id", "username", "email", "isAdmin"])
          return res.status(200).json("done now sign in");
        } catch (err) {
          res.status(500).json(err);
        }
      })
    })
  }
  else {
    return res.json({ error: "Something went wrong" })
  }
})
//LOGIN

router.post('/login', async (req, res) => {
  try {
    let user = await User.findOne(
      {
        email: req.body.email
      }
    );
    if (user === null) {
      res.status(401).json({ error: "wrong password or email" });
    } else {
      const hashedPassword = CryptoJS.AES.decrypt(
        user.password,
        process.env.PASS_SEC
      );
      const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
      const inputPassword = req.body.password;
      if (originalPassword != inputPassword) {
        res.status(401).json({ error: "wrong password or email" });
      } else {
        const accessToken = jwt.sign(
          {
            id: user._id,
            isAdmin: user.isAdmin,
          },
          process.env.JWT_SEC,
          { expiresIn: "365d" }
        );
        const sendUser = _.pick(user, ["_id", "userId", "username", "email", "isAdmin"])
        return res.status(200).json({ sendUser, accessToken });
      }
    }


  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
