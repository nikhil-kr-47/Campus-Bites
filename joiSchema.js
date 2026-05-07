const joi=require("joi");

const userSchema=joi.object({
    username:joi.string().required(),
    email:joi.string().email().required(),
    password:joi.string().required().min(6),
    phoneNo:joi.string().pattern(/^[6-9]\d{9}$/).required()
});

const menuSchema=joi.object({
    name:joi.string().required(),
       
     price:joi.number().required().min(1),
       
     
        
});

const orderSchema=joi.object({
   
    items:joi.array().items(joi.object({
        name:joi.string().required(),
        price:joi.number().required(),
        quantity:joi.number().required().min(1)
    })).min(1).required(),
        

   
   
      
});

module.exports={userSchema,orderSchema,menuSchema};