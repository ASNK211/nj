const mongoose = require("mongoose");

const DepositSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deposit", DepositSchema);
