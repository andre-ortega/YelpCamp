const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Mongo connected.")
    })
    .catch(err => {
        console.log("NO RESPONSE - MONGO");
        console.log(err)
    });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {

    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            // TIM
            author: '61e747b7398d9aa70db698bf',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorum ipsum dolor lorum ipsum dolor lorum ipsum dolor lorum ipsum dolor lorum ipsum dolor',
            price,

            geometry: {
                "type" : "Point",
                "coordinates" : [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },

            images: [
                {
				  url: 'https://res.cloudinary.com/draymonds/image/upload/v1644386685/YelpCamp/lpxg1fwc1zijvyib7wmt.png',
				  filename: 'YelpCamp/lpxg1fwc1zijvyib7wmt',
				},
				{
				  url: 'https://res.cloudinary.com/draymonds/image/upload/v1644386685/YelpCamp/n1lgp5hwneu9ar09zmb8.jpg',
				  filename: 'YelpCamp/n1lgp5hwneu9ar09zmb8',
				},
				{
				  url: 'https://res.cloudinary.com/draymonds/image/upload/v1644386685/YelpCamp/dp6pgvexhsszkit4ukjn.jpg',
				  filename: 'YelpCamp/dp6pgvexhsszkit4ukjn',
				}
            ]
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
