const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        userId: { type: Number },
        usdtId: {
            type: String,
            default: ""
        },
        balance: {
            type: Number,
            default: 0,
        },
        percentage: {
            type: Number,
            default: 0.00138,
        },
        profit: {
            type: Number,
            default: 0,
        },
        active: {
            type: String,
            default: false,
        },
        inviteId: { type: Number },
        date: { type: String, default: new Date() }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);