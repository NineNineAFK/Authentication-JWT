const express = require("express")
const {handleUserSignUP, handleUserlogin,} = require("../controllers/user")
const router= express.Router()

router.get("/", (req, res)=>{
    res.render("home")
})


router.get("/home2", (req, res)=>{
    res.render("home2")
})

module.exports = router;