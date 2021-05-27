if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const mongoose = require('mongoose');
const Campground = require('../models/campground');
const seeds = require('./seeds');
const {
    places,
    descriptors
} = require('./cities');

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database Connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 100; i++) {
        let random1000 = Math.floor(Math.random() * 1000 + 1);
        let prices = Math.floor(Math.random() * 20 + 10);
        const camp = new Campground({
            location: `${seeds[random1000].city} ${seeds[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem odit magnam explicabo, molestiae obcaecati iure eius quo nostrum dolores omnis id, minima nemo alias voluptatem voluptate tenetur inventore qui illo.',
            price: prices,
            geometry: {
                type: "Point",
                coordinates: [seeds[random1000].longitude, seeds[random1000].latitude]
            },
            uploader: '60af646a8f30fb44f45f708b',
            images: [{
                url: 'https://res.cloudinary.com/yelpcamp-image/image/upload/v1621949969/YelpCamp/giyz5wtjbo5bqdwuec7x.png',
                filename: 'YelpCamp/ztlzgayvnzp3ju2bxis9'
            }]
        });
        await camp.save();
    }
}
seedDb().then(() => {
    mongoose.connection.close();
})
