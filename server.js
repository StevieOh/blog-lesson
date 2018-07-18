const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const methodOverride = require('method-override');
const session = require('express-session')

require('./db/db')

app.use(session({
  secret: 'this is a random secret string that you make up',
  resave: false,///only save when the session object has been modified
  saveUnititialized: false //useful for login sessions, we only want to save when we modift the session
}));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({extended: false}));


const authorController = require('./controllers/authorController')
const articleController = require('./controllers/articleController')
const userController = require('./controllers/auth')

app.use('/authors', authorController);
app.use('/articles', articleController);
app.use('/auth', userController)

app.get('/', (req,res) => {
  res.render('index.ejs');
});

app.listen(3000, () => {
  console.log('listening on port 3000')
})