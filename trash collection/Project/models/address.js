const mongoose =require("mongoose")
const bcrypt=require("bcrypt")
const locationSchema = new mongoose.Schema({
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        require:true,
        
    },
    zip:{
        type:Number,
        required:true,
        
    }

})



const Location =new mongoose.model("Location",locationSchema)

module.exports=Location