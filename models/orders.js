const mongoose=require('mongoose');
const passportLocalMongoose=require("passport-local-mongoose").default;
const orderSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    items:[
        {
            name:String,
            price:Number,
            quantity:Number
        }
    ],
    total:Number,
    status:{
        type:String,
        enum:["pending","preparing","ready","delivered"],
        default:"pending"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
});

const Order=mongoose.model("Order",orderSchema);
module.exports=Order;