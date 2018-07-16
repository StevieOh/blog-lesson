const express = require('express');
const app = express();

require('./db/db')

const authorController = require('./controllers/authorController')
app.use('/authors', authorController);

app.get('/', (req,res) => {
  res.render('index.ejs');
});

app.listen(3000, () => {
  console.log('listening on port 3000')
})