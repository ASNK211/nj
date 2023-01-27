const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  user.active = true
  const { usdtId } = req.body

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { active: user.active, usdtId: usdtId });


    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    if(others.inviteId) {
    const orders = await User.find({ userId: others.inviteId });
    const userinviteId = orders[0]._id.toString()
    others.profit = others.profit.toFixed(2)
    others.balance = others.balance.toFixed(2)
    res.status(200).json({others, userinviteId});
    } else {
      others.profit = others.profit.toFixed(2)
      others.balance = others.balance.toFixed(2)
      res.status(200).json({others});
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/findw/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    const orders = await User.find({ userId: others.inviteId });
    const userinviteId = orders[0]._id.toString()
    others.profit = others.profit.toFixed(2)
    others.balance = others.balance.toFixed(2)
    res.status(200).json({others, userinviteId});
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user by unuserId
router.get("/finds/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.id });
    console.log(user)
    const { password, ...others } = user._doc;
    console.log(user)
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const orders = await User.find({ active: true });
    res.status(200).json(orders.reverse());
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/notactive", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await User.find({ active: false });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get("/getadmin", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await User.find({ isAdmin: true });
    res.status(200).json(orders.reverse());
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/search", async (req, res) => {
  try {
    let search = req.body.search
    console.log(search)
    const orders = await User.find({ $text: { $search: search } });
    res.send(orders)
    // res.status(200).json(orders.reverse());
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
