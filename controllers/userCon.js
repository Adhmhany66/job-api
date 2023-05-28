const User = require('../models/userModel')
const {StatusCodes}=require('http-status-codes')
const {BadRequestError , UnauthenticatedError,NotFoundError}=require('../errors')
const sendMail =require('../sendEmail/email')
const crypto = require('crypto')
const cookie = require('cookie')
// createSendToken = (user,statuscode,res)=>{
//     const token = createJWT()
//     const cookiesOption ={
//         expires:new Date(Date.now + process.env.JWT_COOKIE_EXPIRES_IN *24*60*60*1000),
//         httpOnly:true,
//     }
//     if(process.env.NODE_ENV === 'production')cookiesOption.secure=true
//     res.cookie('jwt',token,cookiesOption)
//     res.status(statuscode).json({status:'success', token,user:{user} })
   
// }

const register = async(req,res)=>{

    const user = await User.create({...req.body})
    const token = user.createJWT()

    res.cookie('jwt', token, {
        httpOnly: true,
        expires: new Date(Date.now()+ process.env.JWT_COOKIE_EXPIRES_IN *24*60*60*1000),
       
      })
      if(process.env.NODE_ENV === 'production')cookiesOption.secure=true    

 
    res.status(StatusCodes.CREATED).json({ user:{name:user.name} , token})
    // createSendToken(user,StatusCodes.CREATED,res)
  }
const login = async (req,res)=>{
    const {email , password} = req.body

    if(!email || !password){
        return new BadRequestError('please Provide email and password')
    }

    const user = await User.findOne({email})

    if(!user){
      return new UnauthenticatedError("invalid Credentials")
    }
    const passwordIsCorrect = await user.comparePassword(password ,user.password)

    if(passwordIsCorrect){
        return new UnauthenticatedError("invalid Credentials")
    }
    // createSendToken(user,StatusCodes.OK,res)

    const token = await user.createJWT()

    res.status(StatusCodes.OK).json({user:{id:user.id ,name:user.name}, token})
}

const forgetPassword = async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return next (new NotFoundError('there no user with Email Address'))
    }

    const restToken = user.createPasswordRestToken()
    await user.save({validateBeforeSave:false})

    const restURL = `${req.protocol}://${req.get('host')}api/v1/user/resetpassword/${restToken}`
    const message = `Forget your password? submit a patch request with your new password and password confirm to : ${restURL}. \n
    If you didn't forget you password , please ignore this Email `


    try{
        await sendMail({
            email : user.email ,
            subject : 'your password reset token (valid for 10 min)',
            message 
        })
        res.status(StatusCodes.OK).json({
            success:'success',
            message:'Token Send to Email'
        })

    }catch(error){
        passwordResetToken =undefined ,
        passwordResetExpires = undefined,
        await user.save({validateBeforeSave:false})

        return next (new BadRequestError('there was an error sending the email . try again later'))

    }

   
}
const resetPassword = async(req,res,next)=>{
    const hashToken = crypto
    .createHash('sha256').
    update(req.params.token).
    digest('hex')

    const user= await User.findOne({
        passwordResetToken:hashToken ,
        passwordResetExpires:{$gt:Date.now()}
    })
    if(!user){
        return next(new NotFoundError('Token is invalid orhas expired'))
    }
    user.password = req.body.password
    user.passwordConfirm = req.body.password
    passwordResetToken = undefined
    passwordResetExpires=undefined
     await user.save()

     const token = user.createJWT()
     res.status(StatusCodes.OK).json({
        status:'success',
        token
     })




}
const updatePassword = async (req,res,next)=>{
   

    const user = await User.findById(req.user.userId).select('+password')
    console.log(user)
    if(!user ){
        return next (new BadRequestError('not found'))
    }

    if(!(await user.correctPassword(req.body.passwordCurrent , user.password ))){
        console.log(req.body.passwordCurrent , user.password)
        return next(new NotFoundError('your current password is wrong '))
    }

    req.user.password = req.body.password
    req.user.passwordConfirm = req.body.passwordConfirm
    user.save()
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({
       status:'your password is update',
       token
    })


}

module.exports = {register,login,forgetPassword , resetPassword ,updatePassword}


