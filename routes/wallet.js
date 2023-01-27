const router = require("express").Router();
const User = require("../models/User");
// const Order = require("../models/Order");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const _ = require('lodash');
const nodemailer = require('nodemailer');
const { result } = require("lodash");
const Pdertt = require("../models/Pdertt");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifyToken");
const Joi = require('joi');

//get all users balance
router.get("/getbalance", verifyTokenAndAdmin, async (req, res) => {
    try {
        let pdertt = await Pdertt.findOne()
        let orders = await User.find({ active: true });
        let sum = 0;
        for (const value of orders) {
            sum += value.balance;
        }
        let sun = 0;
        for (const value of orders) {
            sun += value.profit;
        }
    sum = sum.toFixed(2)
     sun   =  sun.toFixed(2)
        res.status(200).json({ sum, sun, orders, pdertt });
    } catch (err) {
        res.status(500).json(err);
    }
})
//get user balance by id
router.get("/find/:userId", async (req, res) => {
    console.log("1")
    const orders = await User.findOne({ _id: req.params.userId });
    if(orders.active === "false") {
        return  res.status(400).json({massage:"you are not active"});
    }else {
       try {
        const orders = await User.findOne({ _id: req.params.userId });
        const balance = orders.balance.toFixed(2)
        const usdtId = orders.usdtId
        const percentages = orders.percentage * 1440
        const profit = orders.profit.toFixed(2)
        const userId = orders.userId
        const percentage = percentages.toFixed(2)
        //  profit.toFixed(2)
        res.status(200).json({ balance, usdtId, percentage,  profit, userId});
    } catch (err) {
        res.status(500).json(err);
    } 
    }
    
})

router.post("/crdet",verifyTokenAndAdmin, async (req, res) => {
    const { userId, balance } = req.body;
    console.log(userId)
    let user = await User.findOne({_id: userId })
    console.log(user)
    if (!user) {
        res.status(500).json("user is not find");
    } else {
        const debt = Number(user.balance) + Number(balance)
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                balance: debt
            },
            { new: true }
        );
        res.status(200).json(updatedUser.balance);
    }
})
router.post("/percentage",verifyTokenAndAdmin, async (req, res) => {
    const { userId, balance } = req.body;
    console.log(userId)
    let user = await User.findOne({_id: userId })
    console.log(user)
    if (!user) {
        res.status(500).json("user is not find");
    } else {
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                percentage: balance
            },
            { new: true }
        );
        res.status(200).json(updatedUser.percentage);
    }
})

router.post("/debt",verifyTokenAndAdmin, async (req, res) => {
    const {  userId, balance } = req.body;
    let user = await User.findOne({ _id: userId })
    if (!user) {
        res.status(500).json("user is not find");
    }
    if (user.balance <= 0 || user.balance < balance) {
        res.status(500).json("user balance is not enough");
    } else {
        const debt = user.balance - balance
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                balance: debt
            },
            { new: true }
        );
        res.status(200).json(updatedUser.balance);
    }
})

router.post("/acceptwithdraw",verifyTokenAndAdmin, async (req, res) => {
    const {  userId, balance } = req.body;
    let user = await User.findOne({ _id: userId })
    if (!user) {
        res.status(500).json("user is not find");
    }
    if (user.balance <= 0 && user.profit <= 0) {
        res.status(500).json("user balance is not enough");
    } else {
        if (user.profit >= balance) {
            user.profit -= balance;
            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                {
                    profit: user.profit
                },
                { new: true }
            );
            res.status(200).json(updatedUser.profit);
        } else {
            user.balance -= (balance - user.profit);
            user.profit = 0;
            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                {
                    balance: user.balance,
                    profit: user.profit
                },
                { new: true }
            );
            res.status(200).json(updatedUser);
        }
    }
})

router.post("/profitcrdet",verifyTokenAndAdmin, async (req, res) => {
    const { userId, balance } = req.body;
    console.log(userId)
    let user = await User.findOne({_id: userId })
    console.log(user)
    if (!user) {
        res.status(500).json("user is not find");
    } else {
        const debt = Number(user.profit) + Number(balance)
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                profit: debt
            },
            { new: true }
        );
        res.status(200).json(updatedUser.profit);
    }
})

router.post("/profitdebt",verifyTokenAndAdmin, async (req, res) => {
    const {  userId, balance } = req.body;
    let user = await User.findOne({ _id: userId })
    if (!user) {
        res.status(500).json("user is not find");
    }
    if (user.profit <= 0 || user.profit < balance) {
        res.status(500).json("user balance is not enough");
    } else {
        const debt = user.profit - balance
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                profit: debt
            },
            { new: true }
        );
        res.status(200).json(updatedUser.profit);
    }
})

router.post("/usdtId",verifyTokenAndAdmin, async (req, res) => {
    const { userId, balance } = req.body;
    console.log(userId)
    let user = await User.findOne({_id: userId })
    console.log(user)
    if (!user) {
        res.status(500).json("user is not find");
    } else {
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                usdtId: balance
            },
            { new: true }
        );
        res.status(200).json(updatedUser.usdtId);
    }
})
module.exports = router;
