const Order = require("../models/Order");
const History = require("../models/History");
const User = require("../models/User");
const Pdertt = require("../models/Pdertt");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const router = require("express").Router();

//CREATE

router.post("/",verifyToken, async (req, res) => {
      const { amount, usdtId, userId } = req.body
      const orders = await User.findOne( { userId:userId } );
      const Pdertts = await Pdertt.findOne();
      if(orders.active === "false") {
          return  res.status(400).json({massage:"You haven’t enough profit and balance"});
      }else {
      const orderNumber = await Order.find().count()
      const percentage = ((Pdertts.balance *amount) / 100).toFixed(2)
      const prs = amount - percentage
      const newOrder = new Order({
        userId: userId,
        amount: amount,
        usdtId: usdtId,
        prs: prs
    })
      newOrder.orderNumber = orderNumber
      try {
        const savedOrder = await newOrder.save();
        res.status(200).json({massage:"order success"});
      } catch (err) {
        res.status(500).json(err);
      }
    }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/find/:id",verifyTokenAndAdmin, async (req, res) => {
  try {
  
    const orders = await Order.findById(req.params.id);
   console.log(orders)
    const newHistory = new History({
     userId: orders.userId,
     amount: orders.amount,
     usdtId: orders.usdtId,
     prs: orders.prs
 })
  console.log(newHistory)
  const savedOrder = await newHistory.save();
   console.log(savedOrder)
   const result = await Order.findByIdAndDelete(req.params.id);
   console.log(result)
   

    

    res.status(200).json({message: "Order has been deleted..."});
     
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET USER ORDERS
router.get("/find/:userId",verifyTokenAndAdmin,async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders.reverse());
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/finda/:id",verifyTokenAndAdmin, async (req, res) => {
  try {
    
    const orders = await Order.findById(req.params.id);
    const user = await User.findOne({userId: orders.userId});
    const { userId, ...others } = user._doc;
    others.profit = others.profit.toFixed(2)
    others.balance = others.balance.toFixed(2)
    res.status(200).json({orders, others});
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL
router.get("/",verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders.reverse());
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
