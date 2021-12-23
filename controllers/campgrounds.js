const Campground = require('../models/campgrounds')
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken =process.env.MAPBOX_TOKEN;
const geocoder =mbxGeocoding({accessToken:"pk.eyJ1IjoidmlzaGFsOTk5IiwiYSI6ImNrcmRpYXVzaDB2MXMzMHBlNThpcGtleHcifQ.zdVK_sivFU6wDvYy5tC5_A"});
const Joi = require('joi')
module.exports.index=async(req,res) =>{
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index.ejs',{campgrounds})
 
}

module.exports.createCamp =(req,res) =>{
    res.render('campgrounds/new.ejs')
    
}
module.exports.createCampPost =async(req,res,next) =>{
    const campgroundSchema = Joi.object({
        campground:Joi.object({
            title: Joi.string().required(),
            price:Joi.number().required().min(0),
            image:Joi.string().required(),
            location:Joi.string().required(),
            description:Joi.string().required(),
        }).required()
    })
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    const geoData = await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    const campground=new Campground(req.body.campground)
    campground.geometry =geoData.body.features[0].geometry
    campground.author = req.user._id; 
    await campground.save()
    console.log(campground)
    req.flash('success','Created new camp!')
    res.redirect(`campgrounds/${campground._id}`)
}

module.exports.show=async (req,res) =>{
    const {id} =req.params;
    const campground = await (await Campground.findById(id).populate({
        path:'review',
        populate:{
            path:'author'
        }
    }
        ).populate('author'))
    console.log(campground)
    if(!campground){
        req.flash('error','Cannot Find Campground!')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show',{
        campground
    })
}

module.exports.edit=async(req,res) =>{
    const campground= await Campground.findById(req.params.id)
    res.render('campgrounds/edit',{campground})
}

module.exports.editPost= async(req,res) =>{
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(campground.author.equals(req.user._id)){
        const camp = await Campground.findByIdAndUpdate(id,  {...req.body.campground})
        req.flash('success','Updated successful!')
        res.redirect(`/campgrounds/${camp._id}`)
    }else{
    req.flash('error','You dont have permission to Delete')
    return res.redirect(`/campgrounds/${id}`)
    }
}

module.exports.delete=async (req,res) =>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id)
    req.flash('success','Deleted success')
    res.redirect('/campgrounds')
}