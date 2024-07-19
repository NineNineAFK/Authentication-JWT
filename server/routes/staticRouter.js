const express = require("express")
const {handleUserSignUP, handleUserlogin,} = require("../controllers/user")
const router= express.Router()

router.get("/", (req, res)=>{
    res.render("home")
})

router.get("/store", (req, res)=>{
    res.render("store")
})

router.get("/faq", (req, res)=>{
    res.render("faq")
})

module.exports = router;