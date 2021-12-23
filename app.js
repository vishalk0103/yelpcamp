const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const ejsMate=require('ejs-mate')
const Campground= require('./models/campgrounds')
const methodOverride= require('method-override')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')
const Joi = require('joi')
const session = require('express-session')
const Review = require('./models/reviews')
const router= express.Router()
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')
const flash = require('connect-flash')
const passport = require('passport')
const localStr = require('passport-local')
const User = require('./models/users')
const userRouter = require('./routes/users')



const sessionConfig={
    secret:'thisshouldbebettersecret',
    resave:false,
    saveUninitialized :true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000 * 60*60 *24 *7,
        maxAge:1000 * 60*60 *24 *7
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStr(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
})
.then(()=>{
    console.log('database Connected')
})
.catch(err =>{
    console.log(err)
})

app.engine('ejs',ejsMate)
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')



app.use((req,res,next) =>{
    res.locals.currentUser = req.user;
  res.locals.success=  req.flash('success')
  res.locals.error= req.flash('error')
  next()
})
app.get('/',(req,res) =>{
    res.render('home')
})

app.use('/',userRouter)
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id',reviews)



app.all('*', (req,res,next) =>{
    next(new ExpressError('page not found',404))
})
app.use((err,req,res,next) =>{
    const {statusCode=500}=err;
    if (!err.message) err.message='Oh Something Went Wrong!'
    res.status(statusCode).render('error',{ err })
})

app.listen(3000 , () =>{
    console.log('App is Lisnting Port:3000')
})