const express = require('express')
const app = express()
const consign = require('consign')
const bodyParser = require('body-parser')
const session = require('express-session')

const Article = require('./articles/ArticleModel')
const Category = require('./categories/CategoryModel')
const User = require('./users/UserModel')


const connection = require("./database/database");

const ArticlesController = require('./articles/Articles')
const CategoriesController = require('./categories/Categories')
const UsersController = require('./users/Users')

const port = 8080
app.set('view engine', 'ejs')



//sessions
app.use(session({
    secret: "SHAAHSHASHASHSA", cookie: { maxAge: 30000 }
}))

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())


connection
    .authenticate()
    .then(() => {
        console.log("Connection with database... Successfull");
    }).catch((error) => {
        console.log("Connection with database... Error")
    })


app.use("/", CategoriesController);
app.use("/", ArticlesController);
app.use('/', UsersController)



app.get("/", (req, res) => {
    Article.findAll({
        order: [
            [
                'id', 'DESC'
            ]
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render("index", { articles: articles, categories: categories });
        })
    })

})

app.get('/:slug', (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article => {
        if (article != undefined) {
            Category.findAll().then(categories => {
                res.render("article", { article: article, categories: categories });
            })
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})
app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{ model: Article }]
    }).then(category => {
        if (category != undefined) {
            Category.findAll().then(categories => {
                res.render('index', { articles: category.articles, categories: categories })
            })
        } else {
            res.redirect('/')
        }
    }).catch(err => {
        res.redirect('/')
    })
})


app.listen(port || 3000, () => {
    console.log('Server is Running... in ' + 'localhost:' + port)
})