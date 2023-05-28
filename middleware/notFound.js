const notFound = (req,res)=>{
   res.status(500).send({message:'Router does not exist'})
}
module.exports= notFound