const {Router} = require('express');
const router = Router()

//get all users
router.get('/', (req, res)=>{
  res.status(200).json('Hello World')
})

module.exports =router;