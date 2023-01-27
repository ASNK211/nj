const router = require("express").Router();
const User = require("../models/User");
const Order = require("../models/Order");

// const nodemailer = require('nodemailer');
const Product = require("../models/Product");
var cron = require('node-cron');
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const { findById } = require("../models/User");



// cron.schedule('*1/2 * * * *', () => {
//     console.log('running a task every two minutes');
//   });

cron.schedule('*/59 * * * *', async (req, res) => {
  const user = await User.find();
  user.forEach(async element => {
    const prs = element.percentage * 0.01 ;
    const ser = element.balance
    console.log(prs)
    const newBalance = element.balance +=
      element.balance * prs
    const nes = newBalance - ser
    console.log(nes,"nes")
    console.log(ser)
    const newProfit = Number(element.profit) +  Number(nes);
    console.log(newBalance)
    console.log(element.profit, "profit")
    const dsve = element._id.toString()
    console.log(dsve)
    try {
      const savedOrder = await User.updateOne({ _id: dsve}, { $set: { profit: newProfit } });
      console.log(savedOrder)   
    }catch (err) {
      console.log(err)
    }
    
  });
})


module.exports = router;
