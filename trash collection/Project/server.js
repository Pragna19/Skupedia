if(process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}

const stripeSECRETKey = process.env.stripesecretkey
const stripePUBLICKey = process.env.stripepublickey
// console.log(stripePUBLICKey,stripeSECRETKey);
const { json } = require('body-parser');
const express =require('express')
const app = express()
require("./db/conn");
const Register =require("./models/register")
const Location =require("./models/address")
const fs =require('fs')
const bcrypt=require('bcrypt')
const stripe = require('stripe')(stripeSECRETKey)

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended:false}))

app.get('/trash',function(req,res){
    fs.readFile('items.json',function(error,data){
        if(error){
            res.status(500).end()
        }
        else{
            res.render('trash.ejs',{
                stripePUBLICKey :stripePUBLICKey,
                items: JSON.parse(data)
            })
        }
    })
})

app.post('/purchase',function(req,res){
    fs.readFile('items.json',function(error,data){
        if(error){
            res.status(500).end()
        }
        else{
            const itemsJSON =JSON.parse(data)
            const itemsArray =itemsJSON.music.concat(itemsJSON.merch)
            let total =0
            req.body.items.forEach(function(item){
                const itemJSON =itemsArray.find(function(i){
                    return i.id ==item.id
                })
                total=total+ itemJSON.price*item.quantity
            })
            stripe.charges.create({
                amount:total,
                source:req.body.stripeTokenId, 
                currency :'inr',
               
            }).then(function(){
                console.log("Charge Successful")
                res.json({message:'Request Successful'})
            }).catch(function(e){
                console.log(e)
                res.status(500).end()
            }) 
        }
    })
})

app.get("/register",(req,res)=>{
    res.render("register")
})

app.post("/register",async(req,res)=>{
   try {
       const password=req.body.password
       const cpassword=req.body.confirmpassword

       if(password===cpassword){
            const registerUser = new Register({
                firstname :req.body.firstname,
                lastname :req.body.lastname,
                email :req.body.email,
                phone :req.body.phone,
                password :req.body.password,
                confirmpassword :req.body.confirmpassword
            })

            //middleware

            const register=await registerUser.save();
            res.status(201).redirect('/index')
       }
       else{
           res.send("Passwords not matching")
       }
       
   } catch (error) {
       res.status(400).send(error)
   }
})

app.post("/trash",async(req,res)=>{
    try {
      
             const location = new Location({
                address:req.body.address,
                city:req.body.city,
                state:req.body.state,
                zip:req.body.zip
                
             })
             var addre= req.body.address
            //  console.log(addre)
 
             //middleware
 
             const loc=await location.save();
             res.status(201).redirect('/trash')
        
       
        
    } catch (error) {
        res.status(400).send(error)
    }
 })

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login",async (req,res)=>{
    try{
        const email =req.body.email
        const password =req.body.password

        const useremail=await Register.findOne({email:email});
        const isMatch = await bcrypt.compare(password,useremail.password )
        if(isMatch){
            res.status(201).redirect('/index')
        }else{
            res.send("Invalid Data")
        }


    }catch(e){
        res.status(400).send("Invalid")
    }
})

app.get("/",(req,res)=>{
    res.render("login")
})

app.get("/index",(req,res)=>{
    res.render("index2")
})


app.listen(3000)