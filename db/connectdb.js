const mongoose = require('mongoose')

const connectDB =(url)=>{
     mongoose.connect(url).then(()=>{console.log('connect to mongo DB')})
     .catch((err) => console.error('Failed to connect to MongoDB Atlas', err));
    
}
module.exports = connectDB