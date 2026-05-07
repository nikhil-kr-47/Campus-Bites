const Menu=require("../models/menu");
module.exports.getMenu=async(req,res,next)=>{
    let menuData=await Menu.find({});
    // console.log(menuData);
    return res.render("menu",{menuData});
}

module.exports.getAddMenuItemForm=(req,res,next)=>{
   return res.render("addMenuItem");
}

module.exports.addMenuItem=async(req,res,next)=>{
   let newItem=new Menu(req.body);
   await newItem.save();
   req.flash("success","Item added");
   return res.redirect("/admin/orders");

}

module.exports.markOos=async(req,res,next)=>{
    let id=req.params.id;
   let item=await Menu.findById(id)
   await Menu.findByIdAndUpdate(id,{$set:{available:!item.available}});

    return res.redirect("/menu");
}

module.exports.showItemDetail=async(req,res,next)=>{
    let item= await Menu.findById(req.params.id);
  
    return res.render("menuItem.ejs",{item});
}

module.exports.editItemDetail=async(req,res,next)=>{
    let id=req.params.id;
    await Menu.findByIdAndUpdate(id,req.body);
   return res.redirect("/menu");
}