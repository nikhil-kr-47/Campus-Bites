function checkAdmin(req,res,next){
    if(req.isAuthenticated() && req.user.role==="admin") return next();
    else{
        req.flash("error","Acess Denied");
        res.redirect("/");
    }
}

module.exports=checkAdmin;