const express=require("express");
const {wrapAsync}=require("../middlewares/wrapAsync");
const router=express.Router({mergeParams:true});
const adminCheck=require("../middlewares/checkAdmin");
const {menuValidate}=require("../middlewares/joiValidate");


const checkLogin=require("../middlewares/checkLogin");
const {getMenu,getAddMenuItemForm,addMenuItem,markOos,showItemDetail,editItemDetail}=require("../controllers/menu");
const checkAdmin = require("../middlewares/checkAdmin");

router.route("/")
.get(checkLogin,wrapAsync(getMenu));

router.route("/add")
.get(checkLogin,adminCheck,getAddMenuItemForm)
.post(checkLogin,adminCheck,menuValidate,addMenuItem);

router.route("/:id/update")
.patch(checkLogin,adminCheck,markOos);

router.route("/:id/item")
.get(checkLogin,adminCheck,showItemDetail)
.post(checkLogin,checkAdmin,menuValidate,editItemDetail);

module.exports=router;