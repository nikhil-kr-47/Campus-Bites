const Order=require("../models/orders");

module.exports.getOrder=async(req,res,next)=>{
    let orders=await Order.find({userId:req.user._id}).sort({createdAt:-1});
    return res.render("orders/orders.ejs",{orders});
}

module.exports.orderDetails=async(req,res,next)=>{
    let id=req.params.id;
    let order=await Order.findById(id);
   return res.render("orders/orderDetails",{order});
}

module.exports.showUserOrder=async(req,res,next)=>{
    let id=req.params.id;
    let order=await Order.findById(id);
    return res.render("orders/showUserOrder",{order});
}

