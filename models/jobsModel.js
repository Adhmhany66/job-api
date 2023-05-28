const mongoose = require('mongoose')

const jobsSchema = new mongoose.Schema({
    company:{
        type:String , 
        required:[true , 'Please Provide Company name'],
        maxlength:50
    },
    position:{
        type:String , 
        required:[true , 'Please Provide Position'],
        maxlength:100
    },
    status:{
        type:String , 
       enum:['interview', 'decliend', 'pending'],
        default:'pending'   
     },
     createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true , 'please provide user']
     }
},{timestamps:true})

module.exports = mongoose.model('Jobs',jobsSchema)