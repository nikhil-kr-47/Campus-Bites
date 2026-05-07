const express=require("express");
const {wrapAsync}=require("../middlewares/wrapAsync");
const router=express.Router({mergeParams:true});

const checkLogin=require("../middlewares/checkLogin");
const {cartAdd,getCart,cartAction,placeOrder}=require("../controllers/cart");


router.route("/")
.get(checkLogin,wrapAsync(getCart));

router.route("/add/:id")
.post(checkLogin,wrapAsync(cartAdd));

router.route("/:id/action")
.post(checkLogin,wrapAsync(cartAction));

router.route("/placeOrder")
.post(checkLogin,wrapAsync(placeOrder));



module.exports=router;
