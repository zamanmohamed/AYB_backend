const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    // description: { type: String, required: true },
    customer_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    amount: { type: Number, required: true },
    cashType: { type: String, enum: ["debit", "credit"], required: true },
    transactionType: {
      type: String,
      enum: ["cash_in_hand", "cash_in_bank"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
