const express=require("express");
const {wrapAsync}=require("../middlewares/wrapAsync");
const router=express.Router({mergeParams:true});
const passport=require("passport");
const {userValidate}=require("../middlewares/joiValidate");

const {getUserLogin,getUserSignup,postUserLogin,postUserSignup}=require("../controllers/user");

router.route("/login")
.get(getUserLogin)
.post(passport.authenticate("local",{failureRedirect:"/user/login",failureFlash:true}),wrapAsync(postUserLogin));

router.route("/signup")
.get(getUserSignup)
.post(userValidate,wrapAsync(postUserSignup));

module.exports=router;