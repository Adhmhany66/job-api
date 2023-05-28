const express = require('express')
const router = express.Router()

const { 
getAllJobs,
getOneJob,
createJobs,
updateJobs,
deleteJobs} = require('../controllers/jobsCon')

router.route('/').get(getAllJobs).post(createJobs)

router.route('/:id').get(getOneJob).patch(updateJobs).delete(deleteJobs)


module.exports = router