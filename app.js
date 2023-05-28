require('dotenv').config()
require('express-handler-errors')
const express = require('express')
const app = express()

const connectDB = require('./db/connectdb')
const authentication = require('./middleware/authentication')

const userRouter = require('./routers/userRou')
const jobRouter = require('./routers/jobsRou')
const notFoundMiddleware = require('./middleware/notFound')
const errorHandlerMiddleware = require('./middleware/errorHandler')


app.use(express.json())

app.use('/api/v1/users',userRouter)
app.use('/api/v1/jobs',authentication ,jobRouter)


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT | 3000

const start = async ()=>{
    try{

     await connectDB(process.env.MONGO_URI)
    app.listen(port,()=>{
        console.log(`Server is running in port ${port}`)
    
    })
}catch(err){
    console.log(err)
}}
start()