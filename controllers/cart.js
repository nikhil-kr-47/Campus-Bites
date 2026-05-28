const Menu=require("../models/menu");
const Order=require("../models/orders");
const ExpressError=require("../utils/ExpressError");
const genTimeSlots=require("../utils/timeSlots");
const MAX_ORDERS_IN_SLOT=10;
module.exports.cartAdd=async(req,res,next)=>{
    let id=req.params.id;
    if(!req.session.cart) req.session.cart=[];
    let item=await Menu.findById(id);
    let existingItem=req.session.cart.find((prod)=>prod.id==item._id.toString());
    if(existingItem) existingItem.quantity+=1;
    else {
        req.session.cart.push({
            id:item._id,
            quantity:1
        });
    }
    return res.redirect("/menu");
}

module.exports.getCart=async(req,res)=>{
    const cart=req.session.cart || [];
     const ids=cart.map((item)=>item.id);
     let availableSlots=genTimeSlots();
     let slots=[];
     for(let slot of availableSlots){
        let count=await Order.countDocuments({slot:slot,orderType:"slot"});
        if(count<MAX_ORDERS_IN_SLOT) slots.push(slot);
     }
     slots=slots.filter(slot=>slot!=undefined);
     const allItems=await Menu.find({_id : {$in:ids}});
     const cartItems=allItems.map((item)=>{
       const anItem= cart.find((c)=>c.id===item._id.toString());
       
       if(anItem){
        return{
            id:item._id,
            name:item.name,
            price:item.price,
            quantity:anItem.quantity,
            image:item.image,
            
           }
       }else return null;
       
     });
   
    return res.render("cart/cart.ejs",{cart:cartItems,slots:slots});
}

module.exports.cartAction=async(req,res,next)=>{
    let id=req.params.id;
    let {action}=req.body;
    let item=req.session.cart.find((prod)=>prod.id===id);
    if(!item) return res.redirect("/cart");
    if(action=="decrease") item.quantity-=1;
    else if(action=="increase")item.quantity+=1;
    else {
        req.session.cart=req.session.cart.filter((prod)=>prod.id!=item.id);
    }
    if(item.quantity<=0){
        req.session.cart=req.session.cart.filter((prod)=>prod.id!=item.id);
    }
   
   return res.redirect("/cart");
}

module.exports.placeOrder=async(req,res,next)=>{
    if(!req.session.cart || !req.session.cart.length) {
        req.flash("error","PLease add items to cart!");
        return res.redirect("/menu");
    }
    const cart=req.session.cart;
    const ids=cart.map((item)=>item.id);
    const cartItems=await Menu.find({_id:{$in:ids}});
    let total=0;
    let orders=cartItems.map((item)=>{
        const anItem=cart.find((prod)=>prod.id===item._id.toString());
       if(anItem){
        total+=item.price*anItem.quantity;
        return {
           name:item.name,
           price:item.price,
           quantity:anItem.quantity,
        }
       }
     });
     if(req.body.orderType==="slot"){
        let countInSLot=await Order.countDocuments({slot:req.body.slot,orderType:"slot"});
     if(countInSLot>=MAX_ORDERS_IN_SLOT) return next(new ExpressError(404,"Slot fulfilled"));
     }
     
    orders=orders.filter((order)=>order!=undefined);
    if(orders.length){

        let today=new Date();
        today.setHours(0,0,0,0);
        let tomorrow=new Date(today);
        tomorrow.setDate(today.getDate()+1);
        let lastOrder=await Order.findOne({
            createdAt:{$gte:today,$lt:tomorrow}
        }).sort({orderNumber:-1});
        let orderno=1;
        if(lastOrder){
            orderno=lastOrder.orderNumber+1;
        }

        let userOrder=new Order({
            userId:req.user._id,
            items:orders,
            total:total,
            deliveryMode:req.body.deliveryMode,
            orderType:req.body.orderType,
            slot:req.body.slot,
            orderNumber:orderno
        });
       await userOrder.save();
       req.flash("success","Order placed successfully");
    }else{
        req.flash("error","Invalid cart items");
    }
    
   req.session.cart=[];
  return res.redirect("/menu");
}