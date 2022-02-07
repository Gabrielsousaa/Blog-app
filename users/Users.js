const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

const User = require('./UserModel')

//FIND
router.get('/admin/users', (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/index', { users: users })
    })
})
//rota de criação
router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create');
})


//LOGIN
router.get('/login', (req, res) => {
    res.render("admin/users/login")
})

router.post('/authenticate', (req, res) => {
    var email = req.body.email
    var password = req.body.password

    User.findOne({where:{email:email}}).then(user =>{
        if (user != undefined) {
            var valida = bcrypt.compareSync(password, user.password)
            if (valida) {
                req.session.user = {
                    id:user,
                    email: user.email
                }
                res.redirect('/admin/articles')
            } else {
                res.redirect('/login')
            }
        }else{
            res.redirect('/login')
        }
    })
})


//CREATE USER
router.post('/users/create', (req, res) => {
    var email = req.body.email
    var password = req.body.password

    User.findOne({ where: { email: email } }).then(user => {
        if (user == undefined) {
            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(password, salt)

            User.create({
                email: email,
                password: hash
            }).then(() => {
                res.redirect('/')
            }).catch((err) => {
                res.redirect('/')
            })
        } else {
            res.redirect("/admin/users/create")
        }
    })




})

router.get('/logout', (req,res) =>{
    req.session.user = undefined;
    res.redirect('/');
})

module.exports = router