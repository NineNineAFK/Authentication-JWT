const express = require("express");
const app= express();
const path = require("path");
const cookieParser = require("cookie-parser")
const {restrictToLoggedInUserOnly} = require("./middlewares/auth");


const router= express.Router();


const userRoute = require("./routes/user")
const staticRouter= require("./routes/staticRouter")

app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cookieParser());


app.use("/user", userRoute);
app.use("/home", restrictToLoggedInUserOnly, staticRouter);

app.set("view engine","ejs");
app.set("views", path.resolve("./views"));




const{connectMongoDB}= require('./connect')
connectMongoDB('mongodb://127.0.0.1:27017/auth')

app.listen(3000);