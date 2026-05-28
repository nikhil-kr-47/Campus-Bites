const express=require("express");
const {wrapAsync}=require("../middlewares/wrapAsync");
const router=express.Router({mergeParams:true});
const passport=require("passport");
const {userValidate}=require("../middlewares/joiValidate");

const {getUserLogin,getUserSignup,postUserLogin,postUserSignup,getResetPassword,postResetPassword,getSetNewPassword,postSetNewPassword,signupVerify}=require("../controllers/user");

router.route("/login")
.get(getUserLogin)
.post(passport.authenticate("local",{failureRedirect:"/user/login",failureFlash:true}),wrapAsync(postUserLogin));

router.route("/signup")
.get(getUserSignup)
.post(userValidate,wrapAsync(postUserSignup));

router.route("/resetPassword")
.get(getResetPassword)
.post(wrapAsync(postResetPassword));

router.route("/setNewPassword")
.get(getSetNewPassword)
.post(wrapAsync(postSetNewPassword));

router.route("/signup/otpVerify")
.post(wrapAsync(signupVerify));

module.exports=router;