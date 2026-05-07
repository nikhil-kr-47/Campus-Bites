const User=require("../models/user");

module.exports.getUserLogin=(req,res)=>{
    return res.render("login.ejs");
}

module.exports.getUserSignup=(req,res)=>{
    return res.render("signup.ejs");
}

module.exports.postUserSignup=async(req,res,next)=>{
    let {username,email,password,phoneNo}=req.body;
    let newUser=new User({
        username:username,
        email:email,
       phoneNo:phoneNo
    });
  let user=await User.register(newUser,password);
 
   req.login(user,(err=>{
    if(err) return next(err);
    req.flash("success","Registered successfully");
    res.redirect("/menu");
   }));
  
}

module.exports.postUserLogin=async(req,res,next)=>{
    req.flash("success","Logged in successfully");
    if(req.user.role==="user") return res.redirect("/menu");
   
    return res.redirect("/admin/orders"); 
    
}

