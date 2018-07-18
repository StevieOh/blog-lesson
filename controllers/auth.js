const express = require('express');;;
const router = express.Router();
const User = require('../models/user')



//==============================
//    AUTHORIZATION ROUTE
//==============================
router.get('/', (req, res) => {
  res.render('auth/login.ejs', {
    message: req.session.message
  }); 
})



//==============================
//    LOG IN
//==============================
router.post('/login', (req, res) => {
  //req.session is available on EVERY SINGLE REQUEST from the client
  console.log(req.session, '<----this is req.session') 
  //you can add any property you want to the session
  //and as soon as you do that, it's saved to the store
  req.session.loggedIn = true;
  req.session.username = req.body.username;
  res.redirect('/articles');
})



//==============================
//    LOG OUT
//==============================
router.get('/logout', (req, res) => {
 req.session.destroy((err) => {
   if(err){
    res.send('err destroying session')
   }else{
    res.redirect('/auth')
   }
 }) 
})



module.exports = router;