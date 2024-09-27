const express=require('express')
const mongoose=require('mongoose')
const {Schema}=mongoose;

const EmployeeSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true,
    },
    designation:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        required:true,
    },
    course:{
        type:String,
        required:true,
    },
    // image:{
    //     type:String,
    //     required:true,
    // },
})

const Employee=mongoose.model('Employee',EmployeeSchema);
module.exports=Employee;