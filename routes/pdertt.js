const router = require("express").Router();
const Pdertt = require("../models/Pdertt");
// const Order = require("../models/Order");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const _ = require('lodash');
const nodemailer = require('nodemailer');
const { result } = require("lodash");
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
} = require("./verifyToken");
const Joi = require('joi');

router.post("/pderttidt", async (req, res) => {
    const { balance } = req.body;
    
    let pdertt = await Pdertt.findOne()
    if(pdertt) {
    try {
        const updatedUser = await Pdertt.findByIdAndUpdate(
            pdertt._id,
            {
                balance: balance
            },
            { new: true }
        );
        res.status(200).json(updatedUser.balance);
    } catch (error) {
        console.log(error)
    }
    }else {
        const newOrder = new Pdertt({
            balance: balance,
        })
        try {
            const savedOrder = await newOrder.save();
            res.status(200).json(savedOrder);
          } catch (err) {
            res.status(500).json(err);
          }
    }
})


module.exports = router;
