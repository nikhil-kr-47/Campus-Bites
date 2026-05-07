const express=require('express');
if(process.env.NODE_ENV!="production"){require('dotenv').config();}

const app=express();
const path=require("path");
const engine=require("ejs-mate");
const session=require("express-session");
const flash=require("connect-flash");
const cookieParser=require("cookie-parser");
const passport=require("passport");
const localStrategy=require("passport-local");
const ExpressError=require("./utils/ExpressError")
const mongoose=require("mongoose");
const methOverride=require("method-override");
const MongoStore = require('connect-mongo').default;

const User=require("./models/user");
const {wrapAsync}=require("./middlewares/wrapAsync");
const checkLogin=require("./middlewares/checkLogin");
const cartRoute=require("./routes/cart");
const userRoute=require("./routes/user");
const menuRoute=require("./routes/menu");
const orderRoute=require("./routes/orders");
const adminRoute=require("./routes/admin");

app.use(flash());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(passport.initialize());
passport.use(new localStrategy((User.authenticate())));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.engine("ejs",engine);
app.use(session({
    resave:false,
    saveUninitialized:true,
    secret:"jbhjjhdscjhvvs",
    store: MongoStore.create({
        mongoUrl:process.env.DB_URL,
        crypto:{
           secret: process.env.SESION_SECRET
        },
        touchAfter:24*3600

    }),
    cookie:{
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        secure:false
    }
}));

app.use(methOverride("_method"));
app.use(cookieParser("jbhjjhdscjhvvs"));
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

async function main(){
    await mongoose.connect(process.env.DB_URL);
}

main().then(()=>{console.log("Connected to Atlas")}).catch(err=>console.log(err));


const port=8080;

app.listen(port,()=>{
    console.log("App is listening");
});

app.use(express.static(path.join(__dirname,"public")));

app.use((req,res,next)=>{
    res.locals.user=req.user;
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.isLoggedIn=req.isAuthenticated();
    res.locals.adminCheck=req.user?req.user.role:null;
    res.locals.cart=req.session.cart ? req.session.cart : null;
    next();
});

app.get("/",(req,res)=>{
    console.log(process.env.PORT);
    res.render("index.ejs");
});

app.use("/user",userRoute);

app.use("/menu",menuRoute);

// Route to add item in cart
app.use("/cart",cartRoute);

app.use("/admin",adminRoute);


app.get("/logout",checkLogin,wrapAsync(async(req,res,next)=>{
    req.logout((err)=>{
        if(err) return next(err);
        req.flash("success","Logged out");
        res.redirect("/");
    });
   
}));

app.use("/orders",orderRoute);


app.use((err,req,res,next)=>{
    let{message="Something went wrong"}=err;
   res.render("error.ejs",{message});
});