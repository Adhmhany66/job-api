const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true , 'please provide your name'],
        minlength: 5
     },
     email:{
        type: String,
        required:[true, 'please provide your email'],
        minlength: 5,
        unique: true
     },
     password:{
        type: String,
        required: [true, 'please provide your password'],
        minlength: 6
     },
     passwordConfirm:{
      type:String,
      required:[true,'Please write a valid password'],
      validate:{
         validator: function(el){
            return el === this.password
         },
         message: 'Passwords are not the same',
      }
     },
     passwordChangedAt: Date,
     passwordResetToken: String,
     passwordResetExpires: Date,
})

userSchema.pre('save', async function(){
   const salt = await bcrypt.genSalt(10)
   this.password = await bcrypt.hash(this.password , salt )
   this.passwordConfirm = undefined

})
userSchema.pre('save',function(next){
   if(!this.isModified('password')|| this.isNew)return next()
   this.passwordChangedAt = Date.now() - 1000
   next()
})

userSchema.methods.createJWT =function(){
  return jwt.sign({
      userId :this._id},process.env.JWT_SECRET , {expiresIn:process.env.JWT_LIFETIME})
      
}

userSchema.methods.comparePassword = async function(canditatePassword){

   const isMatch = await bcrypt.compare(canditatePassword , this.password) 
   return isMatch
}
userSchema.methods.correctPassword = async function (
   candidatePassword,
   userPassword
 ) {
   console.log(candidatePassword,userPassword)
   return await bcrypt.compare(candidatePassword, userPassword);
 };
 
userSchema.methods.createPasswordRestToken = function(){
   const restToken = crypto.randomBytes(32).toString('hex')
   this.passwordResetToken = crypto
   .createHash('sha256')
   .update(restToken)
   .digest('hex')

   this.passwordResetExpires = Date.now() + 10*60*1000

   return restToken
}


module.exports = mongoose.model('User',userSchema)