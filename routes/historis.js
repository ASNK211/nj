const Deposithistory = require("../models/Deposithistory.js");
const History = require("../models/History");
const User = require("../models/User");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  } = require("./verifyToken");
  const router = require("express").Router();




//deposithistory

router.get("/",verifyTokenAndAdmin, async (req, res) => {
    try {
      const orders = await Deposithistory.find();
      res.status(200).json(orders.reverse());
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get("/find/:id",verifyTokenAndAdmin, async (req, res) => {
    try {
      
      const orders = await Deposithistory.findById(req.params.id);
      const user = await User.findOne({userId: orders.userId});
      const { userId, ...others } = user._doc;
      others.profit = others.profit.toFixed(2)
      others.balance = others.balance.toFixed(2)
      res.status(200).json({orders, others});
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //withdrawhistory

  router.get("/withdraw",verifyTokenAndAdmin, async (req, res) => {
    try {
      const orders = await History.find();
      res.status(200).json(orders.reverse());
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get("/finda/:id",verifyTokenAndAdmin, async (req, res) => {
    try {
      
      const orders = await History.findById(req.params.id);
      const user = await User.findOne({userId: orders.userId});
      const { userId, ...others } = user._doc;
      res.status(200).json({orders, others});
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  module.exports = router;
