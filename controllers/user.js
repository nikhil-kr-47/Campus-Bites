const User=require("../models/user");
const crypto=require("crypto");

const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports.getUserLogin=(req,res)=>{
    return res.render("users/login.ejs");
}

module.exports.getUserSignup=(req,res)=>{
    return res.render("users/signup.ejs");
}

module.exports.postUserSignup=async(req,res,next)=>{
  console.log("1");
    let otp=Math.floor(1000+Math.random()*9000).toString();
    let {username,email,password,phoneNo}=req.body; 
    console.log("2")
    let newUser=new User({
        username:username,
        email:email,
       phoneNo:phoneNo,
       otp:otp,
       otpExpiry:Date.now()+2*60*1000
    });
  
  let user=await User.register(newUser,password);
console.log(otp);

await sgMail.send({
  to: email,
  from: "CampusBites <kumar47nikhil@gmail.com>",
  subject: "Campus Bites - OTP Verification Code",
  html: `
  <h2>Campus Bites OTP Verification</h2>
  <p>Your OTP is:</p>
  <h1>${otp}</h1>
  <p>This code will expire in 2 minutes.</p>
  <br>
  <small>If you did not request this, ignore this email.</small>
`
});

  res.render("users/otpVerify",{email});
  
}

module.exports.postUserLogin=async(req,res,next)=>{
  if(!req.user.isVerified){
    req.logout((err)=>{
      if(err) return next(err);
    });
    req.flash("error","Please verify email");
    return res.redirect("/user/login");
  }
    req.flash("success","Logged in successfully");
    if(req.user.role==="user") return res.redirect("/menu");
   
    return res.redirect("/admin/orders"); 
    
}

module.exports.getResetPassword=(req,res)=>{
    res.render("users/resetPasswordForm");
}

module.exports.postResetPassword=async(req,res,next)=>{
     let user=await User.findOne({email:req.body.email});
    
     if(user){
      let token=crypto.randomBytes(32).toString("hex");
      user.resetToken=token;
      user.tokenExpiry=Date.now()+10*60*1000;
      await user.save();

      let resetUrl=`https://campus-bites-2-p5rw.onrender.com/user/setNewPassword?token=${token}`;

      await sgMail.send({
        to: user.email,
        from: "CampusBites <kumar47nikhil@gmail.com>", // or verified sender in SendGrid
        subject: "Password reset",
        html: `
          <h2>Campus Bites Password Rsest</h2>
          <p>Click here to reset password</p>
          <a href=${resetUrl}>Click here</a>
      
          <br>
          <small>If you did not request this, ignore this email.</small>`

      });
     
    
     }
     return res.send("If mail exists , reset link has been sent.  Note : Check spam section if you can't find it in inbox");
}

module.exports.getSetNewPassword=(req,res)=>{
  let token=req.query.token;
  res.render("users/newPasswordForm",{token});
}

module.exports.postSetNewPassword=async(req,res,next)=>{
  let {newPassword,confirmNewPassword}=req.body;
  if(newPassword!==confirmNewPassword) {
    req.flash("error","Password doesnt match");
   return res.redirect("/user/login");
  }
  let token=req.query.token;
  let user=await User.findOne({
    resetToken:token,
    tokenExpiry:{$gt:Date.now()}
  });
  if(!user){
    return res.status(400).send("No userfound");
    
  }
 await user.setPassword(newPassword);
 user.resetToken=undefined;
 user.tokenExpiry=undefined;
 await user.save();
 req.flash("success","Successfully updated password");
 return res.redirect("/user/login");
}

module.exports.signupVerify=async(req,res,next)=>{
  let {email,otp}=req.body;
  let user=await User.findOne({email:email,otp:otp,otpExpiry:{$gt:Date.now()}});
  if(user) {
    req.flash("success","Verification successful");
    user.isVerified=true;
    user.otp=undefined;
    user.otpExpiry=undefined;
    await user.save();
    return res.redirect("/user/login");
  }else{
    await User.deleteOne({email:email});
    req.flash("error","Invalid otp");
   return res.render("users/otpVerify",{email});
  }
}
