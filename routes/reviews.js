const express = require('express')
const Campground= require('../models/campgrounds')
const catchAsync = require('../utils/catchAsync')
const Review = require('../models/reviews')
const router= express.Router({mergeParams:true})
const isLoggedIn = require('../middleware')
const review= require('../controllers/reviews')


router.post('/reviews',isLoggedIn,catchAsync(review.review))
router.delete('/reviews/:reviewId', catchAsync(review.deleteReview))

module.exports= router;