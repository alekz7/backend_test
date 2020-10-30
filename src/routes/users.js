const {Router} = require('express');
const router = Router()
const db = require('../database/database');

let cuantos = 0;
function iterateFunc(doc) {
  console.log(JSON.stringify(doc, null, 2));
  cuantos += 1;
}

function errorFunc(error) {
  console.log(error);
}

// finding a user
router.get('/:username',(req,res)=>{    
  const username = req.params.username;
  if(!username) {    
    return res.status(404).json('user not found');
  }  
  db.get().db("test").collection('users').findOne({ username })
    .then(result=>{
      if(result == null) return res.status(404).json('user not found');
      else return res.status(201).json('user found');
    })
    .catch(err=>{
      return res.status(404).json('user not found');
    })          
})

// adding a user
router.post('/',(req,res)=>{
  const { username, password} = req.body;
  if(!username || !password ) {    
    return res.status(400).json('usuario no creado');
  }  
  db.get().db("test").collection('users').insertOne({ username, password })
    .then(function(result) {      
      return res.status(201).json('usuario creado');
    })
    .catch(err=> {      
      res.status(400).json('usuario no creado')
    })          
})
module.exports =router;