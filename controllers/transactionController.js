const Transaction = require("../models/transaction");
const Customer = require("../models/customer");
const moment = require("moment");

exports.createTransaction = async (req, res) => {
  try {
    const { customer_Id, amount, cashType, transactionType } = req.body;

    console.log(customer_Id, amount, cashType, transactionType);

    const customer = await Customer.findById(customer_Id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const transaction = new Transaction({
      customer_Id,
      amount,
      cashType,
      transactionType,
    });
    await transaction.save();

    res
      .status(201)
      .json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    res.status(500).json({ message: "Error creating transaction", error });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("customer_Id");
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, customer_Id, amount, cashType } = req.body;

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      { description, customer_Id, amount, cashType },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res
      .status(200)
      .json({ message: "Transaction updated successfully", transaction });
  } catch (error) {
    res.status(500).json({ message: "Error updating transaction", error });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting transaction", error });
  }
};

exports.paginateSearch = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    // Parse the dates using Moment.js
    const start = startDate ? moment(startDate).startOf("day") : null;
    const end = endDate ? moment(endDate).endOf("day") : null;

    // Build the query conditions
    const query = {
      // name: { $regex: searchText, $options: "i" },
    };

    // If startDate and endDate are provided, add the date range filter
    if (start && end) {
      query.createdAt = { $gte: start.toDate(), $lte: end.toDate() };
    } else if (start) {
      query.createdAt = { $gte: start.toDate() };
    } else if (end) {
      query.createdAt = { $lte: end.toDate() };
    }

    // if (searchText) {
    //   query["customer_Id.name"] = { $regex: searchText, $options: "i" };
    // }

    const transactions = await Transaction.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("customer_Id")
      .sort({ _id: -1 });

    const totalCount = await Transaction.countDocuments(query);

    res.status(200).json({
      data: transactions,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error paginating search", error });
  }
};

exports.calculateCompanyProfitOrLoss = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    const profitOrLoss = transactions.reduce((total, transaction) => {
      const amount =
        transaction.cashType === "credit"
          ? transaction.amount
          : -transaction.amount;
      return total + amount;
    }, 0);
    res.status(200).json({
      data: profitOrLoss,
      message: "calculated Company ProfitOr Loss successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error paginating search", error });
  }
};

exports.calculateCustomerProfitOrLoss = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate } = req.query;

    const { customerId } = req.params;

    // Parse start and end dates using Moment.js
    const start = startDate ? moment(startDate).startOf("day") : null;
    const end = endDate ? moment(endDate).endOf("day") : null;

    // Build query conditions with the customer ID and date range
    const query = { customer_Id: customerId };

    // Date range filter
    if (start && end) {
      query.createdAt = { $gte: start.toDate(), $lte: end.toDate() };
    } else if (start) {
      query.createdAt = { $gte: start.toDate() };
    } else if (end) {
      query.createdAt = { $lte: end.toDate() };
    }

    // Find and paginate transactions
    const transactions = await Transaction.find(query)
      .populate("customer_Id")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Count total transactions
    const totalCount = await Transaction.countDocuments(query);

    // Calculate profit or loss
    const profitOrLoss = transactions.reduce((total, transaction) => {
      const amount =
        transaction.cashType === "credit"
          ? transaction.amount
          : -transaction.amount;
      return total + amount;
    }, 0);

    // Send response
    res.status(200).json({
      data: transactions,
      profitOrLoss,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
      message: "Calculated customer profit or loss successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error calculating profit or loss", error });
  }
};
