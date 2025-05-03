const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/", userController.index);
router.post("/", userController.store);
router.put("/:id", userController.update);
router.delete("/:id", userController.destroy);

module.exports = router;
