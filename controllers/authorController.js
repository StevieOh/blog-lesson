const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
 res.render('authors/index.ejs') 
});


router.get('/new', (req, res) => {
 res.render('authors/new.ejs') 
});

router.post('/', (req, res) => {
 console.log(req.body)
 res.send('server received request') 
});


module.exports = router;