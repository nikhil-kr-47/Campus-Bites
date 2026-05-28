const mongoose=require('mongoose');
const passportLocalMongoose=require("passport-local-mongoose").default;
const menuSchema=mongoose.Schema({
    name:{
       type: String,
       required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
       url:{
           type:String,
           required:true
       },
       public_id:{
        type:String,
        required:true
       }
    },
    available:{
       type: Boolean,
       default:true
    }
});

const Menu=mongoose.model("Menu",menuSchema);
module.exports=Menu;