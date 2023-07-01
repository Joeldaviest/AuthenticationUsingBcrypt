require("dotenv").config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const saltRounds = 10
const app =express()
const { Schema } = mongoose;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))
const port = 3000

app.listen(port,async()=>{
    console.log("Server started @Port:3000")
})

mongoose.connect("mongodb://localhost:27017/secretsDB")

const userSchema = new Schema({
    email: String,
    password: String
})

const user = mongoose.model("user",userSchema)

app.get("/",async(req,res)=>{
    res.render("home")
})


app.route("/login")

.get(async(req,res)=>{
    res.render("login")
})

.post(async(req,res)=>{
  try{
    var findUser = await user.findOne({email:req.body.username})
    bcrypt.compare(req.body.password,findUser.password,function(err,result){
        if(result==true){
            res.render("secrets")
        }else{
            res.redirect("/")
        }
    })
  }catch(err){
    console.log(err)
  }
})

app.route("/register")

.get(async(req,res)=>{
    res.render("register")
})

.post(async(req,res)=>{
    try{
        bcrypt.hash(req.body.password, saltRounds, function(err,hash){
            var newUser = new user({
                email:req.body.username,
                password: hash
            })
            newUser.save()
            res.render("secrets")
        })
    }catch(err){
        comsole.log(err)
    }
})