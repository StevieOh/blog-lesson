const express = require('express');
const router = express.Router();
const Article = require('../models/article');

router.get('/', (req, res) => {
 Article.find({}, (err, foundArticle) => {
   console.log(foundArticle, '<---- foundArticle');
   res.render('articles/index.ejs', {
    articles: foundArticle
   })
 });
});

router.get('/new', (req, res) => {
 res.render('articles/new.ejs') 
});

router.get('/:id', (req, res) => {
 Article.findById(req.params.id, (err, foundArticle) => {
   res.render('articles/show.ejs', {
    articles: foundArticle
   })
 }); 
});

router.get('/:id/edit', (req, res) => {
 Article.findById(req.params.id, (err, foundArticle) => {
   res.render('articles/edit.ejs', {
    article: foundArticle
   })
 }); 
});

router.put('/:id', (req, res) => {
 Article.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedArticle) => {
   console.log(updatedArticle, '<--- this is updatedArticle');
   res.redirect('/articles');
 });
});

router.post('/', (req, res) => {
 console.log(req.body)
 Article.create(req.body, (err, createdArticle) => {
   console.log(createdArticle, '<---this is createdArticle');
   res.redirect('/articles')
 }) 
})

router.delete('/:id', (req, res) => {
 Article.findByIdAndRemove(req.params.id, (err, deletedArticle) => {
   console.log(deletedArticle, '<----this is deletedArticle')
   res.redirect('/articles')
 }) 
});


module.exports = router;