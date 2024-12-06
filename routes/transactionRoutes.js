const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router.post("/create", transactionController.createTransaction);
router.get("/", transactionController.getAllTransactions);
router.get(
  "/profit-loss/company",
  transactionController.calculateCompanyProfitOrLoss
);
router.get(
  "/profit-loss/customer/:customerId",
  transactionController.calculateCustomerProfitOrLoss
);
router.put("/:id", transactionController.updateTransaction);
router.delete("/:id", transactionController.deleteTransaction);
router.get("/search", transactionController.paginateSearch);

module.exports = router;
