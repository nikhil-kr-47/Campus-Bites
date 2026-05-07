const {userSchema,orderSchema,menuSchema} =require("../joiSchema");

module.exports.userValidate=(req,res,next)=>{
   let {error}=userSchema.validate(req.body);
    if(error) return next(error);
    else next();
}

module.exports.menuValidate=(req,res,next)=>{
    let {error}=menuSchema.validate(req.body);
    if(error) return next(error);
    else next();
}

