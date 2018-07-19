const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Article = require('../models/article')


//==============================
//    AUTHOR INDEX ROUTE
//==============================
router.get('/', async (req, res) => {
  try{
    const foundAuthor = await Author.find() 
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
router.get('/:id/edit', async (req, res) => {
  try{
    const foundAuthor = await Author.findById(req.params.id)
    res.render('authors/edit.ejs', {
      author: foundAuthor
    });
  } catch(err){
    res.send(err);
  }
});



//==============================
//    UPDATE AUTHOR ROUTE
//==============================
router.put('/:id', async (req, res) => {
  try{
    const updatedAuthors = await Author.findByIdAndUpdate(req.params.id, req.body, {new:true})
      res.redirect('/authors') 
  }catch (err){
    res.send(err)
  }
});



//==============================
//    POST UPDATED AUTHOR
//==============================
router.post('/', async (req, res) => {
  try{
    console.log(req.body, '<------this is req.body')
    const createdAuthor = await Author.create(req.body)
    console.log(createdAuthor, '<------this is the createdAuthor');
    res.redirect('/authors');
  } catch (err){
    res.send(err)
  }
});



//==============================
//    DELETE ROUTE
//==============================
router.delete('/:id', async (req, res) => {
  try{
    const deletedAuthor = Author.findByIdAndRemove(req.params.id) 
    console.log(deletedAuthor, '<------ this is deletedAuthor');
    res.redirect('/authors')
  } catch (err){
    res.send(err);
  }
}) 




module.exports = router;