const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Article = require('../models/article')

router.get('/', (req, res) => {
  Author.find({}, (err, foundAuthors) => {
    res.render('authors/index.ejs', {
      authors: foundAuthors
    });
  }); 
});

//=======================
// NEW ROUTE
//=======================

router.get('/new', (req, res) => {
 res.render('authors/new.ejs') 
});
//=======================
//  AUTHOR SHOW PAGE
//=======================
router.get('/:id', (req, res) => {
 Author.findById(req.params.id, (err, foundAuthor) => {
   res.render('authors/show.ejs',{
    author: foundAuthor
   });
 });
});


//========================
//  EDIT ROUTE
//========================
router.get('/:id/edit', (req, res) => {

  Author.findById(req.params.id, (err, foundAuthor) => {
    res.render('authors/edit.ejs', {
      author: foundAuthor
    });
  });
});

router.put('/:id', (req, res) => {
  Author.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedAuthors) => {
      res.redirect('/authors')
  }); 
});


router.post('/', (req, res) => {
  console.log(req.body)
  Author.create(req.body, (err, createdAuthor) => {
    console.log(createdAuthor, ' this is the createdAuthor');
    res.redirect('/authors');
  });
});

//=====================
//  DELETE ROUTE
//=====================
router.delete('/:id', (req, res) => {
  Author.findByIdAndRemove(req.params.id, (err, deletedAuthor) => {
    console.log(deletedAuthor, ' this is deletedAuthor');
   // we are collecting all of the Article Ids fri the 
   //deletedAuthors article property
    const articleIds = [];
    for(let i = 0; i < deletedAuthor.articles.length; i++){
      articleIds.push(deletedAuthor.articles[i].id)
    }
    Article.remove(
      {_id:{ $in: articleIds}}, (err, data) => {
      res.redirect('/authors')
    })
    })
  }) 




module.exports = router;