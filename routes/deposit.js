const Deposit = require("../models/Deposit");
const Deposithistory = require("../models/Deposithistory.js");
// const History = require("../models/History");
const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const router = require("express").Router();

//CREATE

router.post("/",verifyTokenAndAdmin, async (req, res) => {
  const { userId } = req.body
  console.log(userId)
  const ordersn = await User.findOne({userId:userId});
  const newOrder = new Deposit({
    userId: userId,
  })
  console.log(ordersn)
  if (ordersn.active === "false") {
    return res.status(400).json({ massage: "Generating Wallet ID please wait…." });
  } else {
    try {
      const savedOrder = await newOrder.save();
      res.status(200).json(savedOrder);
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

//DELETE
router.delete("/find/:id",verifyTokenAndAdmin, async (req, res) => {
  try {

    const orders = await Deposit.findById(req.params.id);
    console.log(orders)
    const newHistory = new Deposithistory({
      userId: orders.userId,
      pastim: orders.createdAt
    })
    console.log(newHistory)
    const savedOrder = await newHistory.save();
    console.log(savedOrder)
    const result = await Deposit.findByIdAndDelete(req.params.id);
    console.log(result)




    res.status(200).json({ message: "Order has been deleted..." });

  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER ORDERS

router.get("/finda/:id",verifyTokenAndAdmin, async (req, res) => {
  try {

    const orders = await Deposit.findById(req.params.id);
    const user = await User.findOne({ userId: orders.userId });
    const { userId, ...others } = user._doc;
    res.status(200).json({ orders, others });
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL
router.get("/",verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Deposit.find();
    res.status(200).json(orders.reverse());
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
