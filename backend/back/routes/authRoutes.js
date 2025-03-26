const JWT = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const express = require("express")
const router = express.Router()
const User = require("../models/auth")
require("dotenv").config()
const nodemailer = require("nodemailer");



router.get('/',async(req,res)=>{
    try{
        const allget = await User.find();
        res.status(201).json(allget)
    }
   
    catch(err){
        res.status(500).json({message:"error", err})
    }
})

router.post('/register', async (req, res) => {
    try {
        const {email, password} = req.body
        const aeuser = await User.findOne({email})
        if(aeuser) { return res.status(409).json({message: "user already exist"}) }
        
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password, salt)
        
        const newuser = new User({email, password: hashedpassword})
        const saveduser = await newuser.save()
        res.status(201).json({saveduser})
    }
    catch(err) {
        res.status(500).json({message: "error", err})
    }
})
router.post('/login', async(req,res)=>{
    try{
    const {email,password}= req.body
    const auser= await User.findOne({email})
    if(!auser){ 
        return res.status(409).json({message:"user doesnt exist"})
    }
    const isMatch = await bcrypt.compare(password.trim(), auser.password)
    if(!isMatch) {return res.status(400).json({message:"password incorrect"})} 

    const token = JWT.sign({_id:auser._id},process.env.JWT_SECRET,{expiresIn:"1h"})
    res.json({token})
    }
    catch(err){
        res.status(500).json({message:"error", err})

    }
})









const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


router.post("/forgot-password", async (req,res)=>{

    try{
        const {email} = req.body
        const findmail = await User.findOne({email})
        if(!findmail) return res.status(404).json({message:"email not found"})
        const token = JWT.sign({_id:findmail._id},process.env.JWT_SECRET,{expiresIn:"1h"})   
        const resetlink = `https://localhost:5174/reset-password/${token}`
        await transporter.sendMail({
            from : process.env.EMAIL_USER,
            to: email,
            subject : "Resetting password",
            text: `reset link : ${resetlink} `
        })
        res.status(201).json({message:"email sent"})
    }
    catch(err){
        res.status(500).json({error:err.message})
    }
})

router.post('/reset-password/:token', async (req, res) => {
    const {newpassword} = req.body
    const {token} = req.params
    try {
        const decode = JWT.verify(token, process.env.JWT_SECRET)
        const getUser = await User.findOne({_id: decode._id})
        if(!getUser) return res.status(404).json({message: "user not found"})
        
        const checkold = await bcrypt.compare(newpassword, getUser.password)
        if(checkold) return res.status(409).json({message: "password shouldnt be the same as the old one"})
        
        // Hash the new password directly before saving
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newpassword, salt)
        
        getUser.password = hashedPassword
        await getUser.save()
        
        return res.status(201).json({message: "the new password has been reseted"})
    } catch(err) {
        res.status(500).json({error: err.message})
    }
})
module.exports = router