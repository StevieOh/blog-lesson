const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Article = require('../models/article')


//==============================
//    AUTHOR INDEX ROUTE
//==============================
router.get('/', async (req, res) => {
  try{
    const foundAuthor = await Author.find({}) 
      res.render('authors/index.ejs', {
        authors: foundAuthors
    });
  } catch (err){
    res.send(err);
  }
});



//==============================
//    NEW ROUTE
//==============================
router.get('/new', async (req, res) => {
  try{
    res.render('authors/new.ejs')
  } catch (err){
    res.send(err)
  }
});



//==============================
//    AUTHOR SHOW PAGE
//==============================
router.get('/:id', async (req, res) => {
  try{
    const foundAuthor = Author.findById(req.params.id)
    res.render('authors/show.ejs',{
      author: foundAuthor
    });
  } catch(err){
    res.send(err)
  }
});



//==============================
//    EDIT ROUTE
//==============================
router.get('/:id/edit', (req, res) => {
  Author.findById(req.params.id, (err, foundAuthor) => {
    res.render('authors/edit.ejs', {
      author: foundAuthor
    });
  });
});



//==============================
//    UPDATE AUTHOR ROUTE
//==============================
router.put('/:id', (req, res) => {
  Author.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedAuthors) => {
      res.redirect('/authors')
  }); 
});



//==============================
//    POST UPDATED AUTHOR
//==============================
router.post('/', (req, res) => {
  console.log(req.body)
  Author.create(req.body, (err, createdAuthor) => {
    console.log(createdAuthor, ' this is the createdAuthor');
    res.redirect('/authors');
  });
});



//==============================
//    DELETE ROUTE
//==============================
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