const Customer = require("../models/customer");
const moment = require("moment");

exports.createCustomer = async (req, res) => {
  try {
    const { name } = req.body;

    // console.log(name)

    // Check if a customer with the same name already exists
    const existingCustomer = await Customer.findOne({ name });
    if (existingCustomer) {
      console.log(name)

      return res.status(400).json({ message: "Customer name already exists" });
    }

    // If not, create and save the new customer
    const customer = new Customer({ name });
    await customer.save();

    res
      .status(201)
      .json({ message: "Customer created successfully", customer });
  } catch (error) {
    res.status(500).json({ message: "Error creating customer", error });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res
      .status(200)
      .json({ message: "Customer updated successfully", updatedCustomer });
  } catch (error) {
    res.status(500).json({ message: "Error updating customer", error });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting customer", error });
  }
};

exports.paginateSearch = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      searchText = "",
      startDate,
      endDate,
    } = req.query;

    // Parse the dates using Moment.js
    const start = startDate ? moment(startDate).startOf("day") : null;
    const end = endDate ? moment(endDate).endOf("day") : null;

    // Build the query conditions
    const query = {
      name: { $regex: searchText, $options: "i" },
    };

    // If startDate and endDate are provided, add the date range filter
    if (start && end) {
      query.createdAt = { $gte: start.toDate(), $lte: end.toDate() };
    } else if (start) {
      query.createdAt = { $gte: start.toDate() };
    } else if (end) {
      query.createdAt = { $lte: end.toDate() };
    }

    // Perform pagination and search
    const customers = await Customer.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ _id: -1 });

    // Get total count for pagination
    const totalCount = await Customer.countDocuments(query);

    // Send response
    res.status(200).json({
      data: customers,
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
