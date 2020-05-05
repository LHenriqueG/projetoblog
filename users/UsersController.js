const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

//Routes
//Read
router.get("/admin/users", (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/index', {users: users});
    });
});

//Create
router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create");
});

//Create
router.post("/users/create", (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  User.findOne({
    where: {
      email: email,
    },
  }).then((user) => {
    if (user == undefined) {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);

      User.create({
        email: email,
        password: hash,
      })
        .then(() => {
          res.redirect("/");
        })
        .catch((error) => {
          res.redirect("/");
        });
    } else {
      res.redirect("/admin/users/create");
    }
  });
});

//Login Redirect
router.get('/login', (req, res) => {
    res.render('admin/users/login');
})

//Login Create
router.post('/authenticate', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({
        where: {
            email: email
        }
    }).then(user => {
        if(user != undefined) { //Se existe usuario com esse email
            //validar a senha
            var correct = bcrypt.compareSync(password, user.password);
            
            if(correct) { //logado com sucesso
                req.session.user = {
                    id: user.id,
                    email: user.email
                }
                res.redirect('/admin/articles');
            }else{
                res.redirect('/login');
            }
        }else {
            res.redirect('/login');
        }
    })
});

//Logout
router.get('/logout', (req, res) => {
  req.session.user = undefined;
  res.redirect('/');
})

module.exports = router;
