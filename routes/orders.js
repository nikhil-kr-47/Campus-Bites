const express=require("express");
const {wrapAsync}=require("../middlewares/wrapAsync");
const router=express.Router({mergeParams:true});

const checkLogin=require("../middlewares/checkLogin");
const {getOrder,orderDetails,showUserOrder}=require("../controllers/order");
const checkAdmin = require("../middlewares/checkAdmin");

router.route("/")
.get(checkLogin,wrapAsync(getOrder));

router.route("/:id")
.get(checkLogin,wrapAsync(orderDetails));

router.route("/:id/show")
.get(checkLogin,checkAdmin,wrapAsync(showUserOrder));
module.exports=router;
