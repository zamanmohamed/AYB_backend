const express = require("express");
const router = express.Router();
const capitalController = require("../controllers/capitalController");

router.post("/create", capitalController.addCapital);
router.get("/", capitalController.getAllCapitals);
router.put("/:id", capitalController.updateCapital);
router.delete("/:id", capitalController.deleteCapital);
router.get("/search", capitalController.paginateSearch);

module.exports = router;
