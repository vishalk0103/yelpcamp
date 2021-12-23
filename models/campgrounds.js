const mongoose = require('mongoose')

const opts= {toJSON :{virtuals:true}}
const campgroundSchema = new mongoose.Schema({
    title:String,
    image:String,
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true

        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    price:Number,
    description:String,
    location:String,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    review:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Review'
    }]
},opts)

campgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href='/campgrounds/${this._id}'>${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`
})

const Campground = mongoose.model('Campground',campgroundSchema)

module.exports = Campground;

