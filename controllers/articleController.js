const express = require('express');
const router = express.Router();
//Require the model
const Article = require('../models/article');
const Author = require('../models/author');

router.get('/', (req, res) => {
  console.log(req.session, '<----this is req.session in articleController')
  if(req.session.loggedIn ===true){
    Article.find({}, (err, foundArticle) => {
      res.render('articles/index.ejs', {
        articles: foundArticle,
        username: req.session.username
      });
    })
  }else{
    req.session.message = "you have to be logged in"
    res.redirect('/auth');
  }
});

router.get('/new', (req, res) => {
  Author.find({}, (err, allAuthors) => {
    res.render('articles/new.ejs', {
      authors: allAuthors
    }); 
  });
});

// display the author with a link on the Article show page
router.get('/:id', (req, res) => {
  Article.findById(req.params.id, (err, foundArticle) => {
    //find the author of the article
    Author.findOne({"articles._id":req.params.id}, (err, foundAuthor) => {
      res.render('articles/show.ejs', {
        article: foundArticle,
        author: foundAuthor
      });
    });  
  });
}); 


// edit
router.get('/:id/edit', (req, res) => {
  Article.findById(req.params.id, (err, foundArticle) => {
    //Find all the authors, so we can select them in the drop
    //down menu when we are editing
    Author.find({}, (err, allAuthors) => {
      //then we need to find the author the article is by
      Author.findOne({"article._id":req.params.id}, (err, foundArticleAuthor) => {
        res.render('articles/edit.ejs', {
          article: foundArticle,
          author: allAuthors,
          articleAuthor: foundArticleAuthor
      
        });
      });
    });
  }); 
});


router.post('/', (req, res) => {
  //create a new Article, Push a copy to the Authors
  //article array
  console.log("-------------------req.body-------------------");   
  console.log(req.body)
  Author.findById(req.body.authorId, (err, foundAuthor) => {
    console.log("-------------------foundAuthor-------------------");   
    console.log(foundAuthor)
    //found author is the document, eith authors articles array
    Article.create(req.body, (err, createdArticle) => {
      console.log("-------------------createdArticle-------------------")      
      console.log(createdArticle)
      console.log("")
      foundAuthor.articles.push(createdArticle);
      foundAuthor.save((err, data) => {
        res.redirect('/articles');
      });
    });
  }); 
});

router.delete('/:id', (req, res) => {
  Article.findByIdAndRemove(req.params.id, (err, foundArticle) => {
  //find the author with this article
    Author.findOne({"articles._id": req.params.id}, (err, foundAuthor) => {
    //finding the article in the authors array and removing it
      foundAuthor.articles.id(req.params.id).remove();
      foundAuthor.save((err, data) => {
        res.redirect('/articles')
      });
    });
  }); 
});

//update and article we want to the authors articles list
router.put('/:id', (req, res) => {
  Article.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedArticle) => {
    //find the author with that article
    Author.findOne({"articles._id": req.params.id}, (err, foundAuthor) => {
      //saying there is a new author
      if(foundAuthor._id.toString() !== req.body.authorId){
        foundAuthor.articles.id(req.params.id).remove();
        foundAuthor.save((err, data) => {
        //find the new author and the article in their array
          Author.findById(req.body.authorId, (err, newAuthor) => {
            newAuthor.articles.push(updatedArticle);
            newAuthor.save((err, savedFoundAuthor) => {
              res.redirect('/articles');
            })
          })
        }); 
      } else{
        //if the author is the same as it was before
        //first find the article and removing, 
        //req.params.id = articles is
        foundAuthor.articles.id(req.params.id).remove();
        foundAuthor.articles.push(updatedArticle);
        foundAuthor.save((err, data) => {
          res.redirect('/articles')
        });
      }
    });
  });
});


module.exports = router;