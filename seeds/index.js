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
            image: 'https://source.unsplash.com/collection/483251/1600x900',
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem odit magnam explicabo, molestiae obcaecati iure eius quo nostrum dolores omnis id, minima nemo alias voluptatem voluptate tenetur inventore qui illo.',
            price: `$ ${prices}`
        });
        await camp.save();
    }
}
seedDb().then(() => {
    mongoose.connection.close();
})