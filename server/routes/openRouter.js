const express = require("express")
const {handleUserSignUP, handleUserlogin,} = require("../controllers/user")
const router= express.Router()



router.get("/", (req, res)=>{
    res.render("open");
})

module.exports = router;

