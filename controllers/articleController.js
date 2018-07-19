const express = require('express');
const router = express.Router();
//Require the model
const Article = require('../models/article');
const Author = require('../models/author');



//============================
//    ARTICLE INDEX ROUTE
//============================
router.get('/', async (req, res, next) => {
  try{
    const foundArticle = await Article.find({});
    res.render('articles/index.ejs', {
      articles: foundArticle,
      username: req.session.username
    });
  }catch(err){
    console.log(err)
    res.send(err)
  }
});



//============================
//    NEW ARTICLE ROUTE
//============================
router.get('/new', async (req, res) => {
  try{
    const allAuthors = await Author.find();
    res.render('articles/new.ejs', {
      authors: allAuthors
    }); 
  }catch(err){
    res.send(err)
  }
});



//============================
//    AUTHOR ARTICLE ROUTE
//============================
// display the author with a link on the Article show page
router.get('/:id', async (req, res) => {
  try{
    const findArticle = await Article.findById(req.params.id)
    const findAuthor = await Author.findOne({"articles._id":req.params.id}) 
    const [foundArticle, foundAuthor] = await Promise.all([findArticle, findAuthor])
    res.render('articles/show.ejs', {
      article: foundArticle,
      author: foundAuthor
    });
  } catch (err){
    res.send(err)
  }
}); 



//============================
//    EDIT ROUTE
//============================
router.get('/:id/edit',async (req, res) => {
  try{
    const findArticle = await Article.findById(req.params.id)
    const findAllAuthors = await Author.find()
    const findArticleAuthor = await Author.findOne({"article._id":req.params.id}) 
    const [foundArticle, allAuthors, foundArticleAuthor] = await Promise.assl([findArticle, findAllAuthors, findArticleAuthor]);
      res.render('articles/edit.ejs', {
        article: foundArticle,
        author: allAuthors,
        articleAuthor: foundArticleAuthor
      });
  } catch (err){
    res.send(err)
  }
});



//============================
//    POST NEW ARTICLE ROUTE
//============================
router.post('/', async (req, res) => {
  try{
    console.log(req.body, '<------THIS IS REQ.BODY')
    const findAuthor = await Author.findById(req.body.authorId) 
    console.log(foundAuthor, '<------THIS IS FOUNDAUTHOR')
    const createArticle = await Article.create(req.body) 
    console.log(createdArticle, '<------THIS IS CREATEDARTICLE')
    foundAuthor.articles.push(createdArticle);
    await foundAuthor.save();
    res.redirect('/articles');
  } catch (err){
    res.send(err)
  }
});



//============================
//    DELETE ARTICLE ROUTE
//============================
router.delete('/:id', async (req, res) => {
  try{
    const deletedArticle = await Article.findByIdAndRemove(req.params.id)
    console.log(deletedArticle, '<----THIS IS DELETED ARTICLE')
    const findAuthor = await Author.findOne({"articles._id": req.params.id})
    console.log(deletedAuthor, '<---- THIS IS DELETED AUTHOR')
    const [deleteArticle, foundAuthor] = await Promise.all([deletedArticle, findAuthor]);
    console.log(foundAuthor, '<--- this is foundAuthor')
    foundAuthor.articles.id(req.params.id).remove();
    await foundAuthor.save()
    res.redirect('/articles') 
  } catch (err){
    res.send(err)
  }
});



//============================
//    UPDATE ARTICLE ROUTE
//============================
router.put('/:id', async (req, res) => {
  try{
    const findUpdatedArticle = Article.findByIdAndUpdate(req.params.id, req.body, {new:true});
    const findFoundAuthor = Author.findOne({"articles._id": req.params.id});
    const [updatedArticle, foundAuthor] = await Promise.all([findUpdatedArticle, findFoundAuthor]);
    if(foundAuthor._id.toString() !== req.body.authorId){
      foundAuthor.articles.id(req.params.id).remove();
      await foundAuthor.save();
      const newAuthor = await Author.findById(req.body.authorId) 
      newAuthor.articles.push(updatedArticle);
      const savedNewAuthor = await newAuthor.save();
      res.redirect('/articles');
    } else{
      foundAuthor.articles.id(req.params.id).remove();
      foundAuthor.articles.push(updatedArticle);
      await foundAuthor.save()
          res.redirect('/articles' + req.params.id)
    }    
  } catch (err){
    res.send(err);
  }
});


module.exports = router;