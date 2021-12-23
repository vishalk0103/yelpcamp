const express= require('express')
const router = express.Router()
const User = require('../models/users')
const catchAsync= require('../utils/catchAsync')
const passport = require('passport')


router.get('/register',(req,res) =>{
    res.render('../views/users/register.ejs')
})
router.post('/register',catchAsync(async(req, res ,next) =>{
    try{
    const {email, username, password} = req.body;
    const user =await new User({email,username})
    const registerUser= await User.register(user, password)
    req.login(registerUser,err =>{
        if(err) return next(err)
        req.flash('success' , 'Successfully Logged In')
        res.redirect('/campgrounds')
    })

    }
    catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }

}))
router.get('/login', (req,res) =>{
    res.render('../views/users/login')
})
router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}) ,(req,res) =>{
    req.flash('success','Welcome Back!')
    const returnUrl= req.session.returnTo || '/campgrounds'
    delete req.session.returnTo
    res.redirect(returnUrl)
})

router.get('/logout',(req,res) =>{
    req.logOut()
    req.flash('success','GoodBye!')
    res.redirect('/campgrounds')
})

module.exports = router;