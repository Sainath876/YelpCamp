const mongoose = require('mongoose');
const Campground = require('../models/campground');
const seeds = require('./seeds');
const {
    places,
    descriptors
} = require('./cities');

mongoose.connect('mongodb://localhost:27017/yelpcamp', {
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
    for (let i = 0; i < 50; i++) {
        let random1000 = Math.floor(Math.random() * 1000 + 1);
        let prices = Math.floor(Math.random() * 20 + 10)
        const camp = new Campground({
            location: `${seeds[random1000].city} ${seeds[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem odit magnam explicabo, molestiae obcaecati iure eius quo nostrum dolores omnis id, minima nemo alias voluptatem voluptate tenetur inventore qui illo.',
            price: prices,
            geometry: { type : "Point", coordinates : [ -112.0262, 41.1618 ] },
            uploader: '609ccfe3bc9aab2a60ae609d',
            images: [{
                url: 'https://res.cloudinary.com/yelpcamp-image/image/upload/v1621949969/YelpCamp/ztlzgayvnzp3ju2bxis9.png',
                filename: 'YelpCamp/ztlzgayvnzp3ju2bxis9'
            }]
        });
        await camp.save();
    }
}
seedDb().then(() => {
    mongoose.connection.close();
})
