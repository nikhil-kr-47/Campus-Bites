const express=require("express");
const router=express.Router();

const {wrapAsync}=require("../middlewares/wrapAsync");
const checkAdmin=require("../middlewares/checkAdmin");
const {adminOrders,adminAction}=require("../controllers/admin");

router.route("/orders")
.get(checkAdmin,wrapAsync(adminOrders));

router.route("/:id/update")
.patch(checkAdmin,wrapAsync(adminAction));

module.exports=router;