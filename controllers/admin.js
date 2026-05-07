const Order=require("../models/orders");

module.exports.adminOrders=async(req,res,next)=>{
    let orders=await Order.find({status:{$in:["pending","preparing","ready"]}}).populate("userId").sort({createdAt:-1});
    let pendingCnt=0,prepCnt=0,readyCnt=0;
   for(let order of orders){
    if(order.status==="pending") pendingCnt++;
    else if(order.status==="preparing") prepCnt++;
    else  readyCnt++;
    
   }
    res.render("admin",{orders,pendingCnt,prepCnt,readyCnt});
    // res.send("Hello");
}

module.exports.adminAction=async(req,res,next)=>{
    
   let id=req.params.id;
   await Order.findByIdAndUpdate(id,{$set:{status:req.body.status}});
   res.redirect("/admin/orders");
}

