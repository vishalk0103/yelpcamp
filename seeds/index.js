const path = require("path");
const mongoose = require("mongoose");
const Campground = require("../models/campgrounds");

mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const campDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 20; i++) {
    const c = new Campground({
      author:'60f567ff9f4ec50ef427c42a',
      title: "new camp",
      description: "nice camp",
      image:
        "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80",
      price: "33",
      location: "surat",
    });
    await c.save();
  }
};
campDb();
