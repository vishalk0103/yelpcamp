const express = require('express')
const app = express()
const path = require('path')
const Campground= require('../models/campgrounds')
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

const camp = require('../controllers/campgrounds')
const router = express.Router()
const isLoggedIn = require('../middleware')
const { index } = require('../controllers/campgrounds')



router.route('/')
    .get(catchAsync(camp.index) )
    .post(catchAsync(camp.createCampPost))

router.get('/new',isLoggedIn,camp.createCamp)
router.route('/:id')
    .get(catchAsync(camp.show))
    .put( camp.editPost)
    .delete(isLoggedIn, catchAsync(camp.delete))

router.get('/:id/edit',isLoggedIn,catchAsync(camp.edit))



module.exports= router;