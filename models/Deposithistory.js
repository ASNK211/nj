const mongoose = require("mongoose");

    const deposithistorySchema = new mongoose.Schema(
      {
        userId: { type: String, required: true },
        pastim: { type: String, required: true },
        status: { type: String, default: "pending" },
      },
      { timestamps: true }
    );
    
    module.exports = mongoose.model("dipostHistory", deposithistorySchema);
    