const Menu=require("../models/menu");
const Order=require("../models/orders");
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
   
    return res.render("cart",{cart:cartItems});
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
           quantity:anItem.quantity

        }
       }
     
     
       
    });
    orders=orders.filter((order)=>order!=undefined);
    if(orders.length){
        let userOrder=new Order({
            userId:req.user._id,
            items:orders,
            total:total
    
        });
       await userOrder.save();
       req.flash("success","Order placed successfully");
    }else{
        req.flash("error","Invalid cart items");
    }
    
   req.session.cart=[];
  return res.redirect("/menu");
}