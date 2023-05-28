const Job = require('../models/jobsModel')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError ,NotFoundError}=require('../errors')

const getAllJobs= async(req,res)=>{
    const jobs = await Job.find({createdBy :req.user.userId}).sort('createAt')
    res.status(StatusCodes.OK).json({jobs , count:jobs.length} )
}

const getOneJob= async(req,res)=>{
    const {user:{userId}, params:{id:jobId}}= req
    console.log('start')
    

    const job= await Job.findOne({
        _id:jobId 
        , createdBy:userId
        })
    console.log('middle')


    if(!job){
        return new NotFoundError(`no job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}

const createJobs= async (req,res)=>{
    req.body.createdBy = req.user.userId
    const job = await Job.create(req.body)
    
    res.status(StatusCodes.CREATED).json({job})
}
const updateJobs=async(req,res)=>{
    const {
        user:{userId},
        body:{company , position}
        ,params:{id:jobId}
    }=req
    if(company ==='' || position === ''){
        return new BadRequestError ('Company Or Position fields cannot be empty')
    }
    const job = await Job.findByIdAndUpdate(
        {_id:jobId ,createdBy:userId },
    req.body ,
    {new:true , runValidators:true}
    )
    if(!job){
        return new NotFoundError(`no job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({job})
}
const deleteJobs=async(req,res)=>{
    const {user:{userId}, params:{id:jobId}}= req
    const job = await Job.findByIdAndRemove({_id:jobId , createdBy:userId})
    if(!job){
        return new NotFoundError(`no job with id ${jobId}`)
    }


    res.status(StatusCodes.OK).json('Job is deleted')
}

module.exports={
    getAllJobs,
    getOneJob,
    createJobs,
    updateJobs,
    deleteJobs,
}