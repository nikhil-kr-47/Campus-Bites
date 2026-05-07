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
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVagGwiThgq7ncziWAtfISHSbaZ1gaknf-qw&s"
    },
    available:{
       type: Boolean,
       default:true
    }
});

const Menu=mongoose.model("Menu",menuSchema);
module.exports=Menu;