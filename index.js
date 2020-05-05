const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require('express-session');
const connection = require("./database/database");

//Loading Controllers
const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const usersController = require('./users/UsersController');

//Models
const Article = require("./articles/Article");
const Category = require("./categories/Category");
const User = require('./users/User');

//View Engine
app.set("view engine", "ejs");

//Sessions
app.use(session({
  secret: 'hashiba',
  cookie: {
    maxAge: 600000 //MILISSEGUNDOS
  }
}))

//Static Files
app.use(express.static("public"));

//Body-Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Database
connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com sucesso!");
  })
  .catch((error) => {
    console.log(error);
  });

//Using Controllers
app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

//Routes
app.get("/", (req, res) => {
  Article.findAll({
    order: [
      ['id', "DESC"]
    ],
    limit: 4
  }).then(articles => {
    Category.findAll().then(categories => {
      res.render('index', {articles: articles, categories: categories});
    });
  });
});

app.get('/:slug', (req, res) => {
  var slug = req.params.slug;

  Article.findOne({
    where: {
      slug: slug
    }
  }).then(article => {
    if(article != undefined) {
      Category.findAll().then(categories => {
        res.render('article', {article: article, categories: categories});
      });
    }else{
      res.redirect('/');
    }
  }).catch(error => {
    res.redirect('/');
  })
})

app.get('/category/:slug', (req, res) => {
  var slug = req.params.slug;
  Category.findOne({
    where: {
      slug: slug
    },
    include: [{model: Article}]
  }).then(category => {
    if(category != undefined) {
      Category.findAll().then(categories => {
        res.render('index', {articles: category.articles, categories: categories});
      });
    }else{
      res.redirect('/');
    }
  }).catch(error => {
    res.redirect('/');
  });
});

//Servidor
app.listen(3000, () => {
  console.log("Servidor ON!");
});
