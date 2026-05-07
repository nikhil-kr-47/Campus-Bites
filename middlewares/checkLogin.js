function checkLogin(req,res,next){
    if(req.isAuthenticated()) return next();
    else return res.redirect("/user/login");
}
 module.exports=checkLogin;