const router = require('express').Router();
const passport = require('passport');

// Models
const User = require('../models/User');
const Order = require('../models/order');
const Cart = require('../models/cart');


router.get('/pedidos/:page', async (req, res) => {

  let perPage = 8;
  let page = req.params.page || 1;

  Order 
  .find({}) // finding all documents
  .sort({ _id: -1 })
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, orders) => {
    var user;
    var cart;
    orders
    .forEach(function(order){
      cart=new Cart(order.cart);
      user=new User(order.user);
      order.items = cart.generateArray();  
    });
    Order.countDocuments((err, count) => { // count to calculate the number of pages
      if (err) return next(err);
      res.render('cart/pedidos', {
        orders,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    });
  });
});





router.get('/perfil/:page', async (req, res) => {

  let perPage = 8;
  let page = req.params.page || 1;

  Order 
  .find({}) // finding all documents
  .sort({ _id: -1 })
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, orders) => {
    var cart;
    orders
    .forEach(function(order){
      cart=new Cart(order.cart);
      order.items = cart.generateArray();  
    });
    Order.countDocuments((err, count) => { // count to calculate the number of pages
      if (err) return next(err);
      res.render('users/profile', {
        orders,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    });
  });
});






//router.get('/pedidos', async (req, res) => {
  //const orders = await Order
    //.find()
    //.sort({ _id: -1 });
      // var user;
       //var cart;
       //orders
       //.forEach(function(order){
         //cart=new Cart(order.cart);
        // user=new User(order.user);
       //  order.items = cart.generateArray();  
      // });
    //res.render('cart/pedidos', {orders});
  //});
  


router.get('/users/profile', async(req, res) => {
  const orders = await Order
  .find({user: req.user})
  .sort({ _id: -1 });

    var cart;
    orders.forEach(function(order){
      cart=new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('users/profile', {orders});
});



router.get('/users/personalinfo', async(req, res) => {
  const users = await User.find({user: req.user});

   res.render('users/personalinfo', {users});
});
  
  


router.get('/users/signup', (req, res) => {
  res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
  let errors = [];
  const { name, email, password, confirm_password, number, fecha, address, localidad, piso} = req.body;
  if(password != confirm_password) {
    errors.push({text: 'Passwords do not match.'});
  }
  if(password.length < 4) {
    errors.push({text: 'Passwords must be at least 4 characters.'})
  }
  if(errors.length > 0){
    res.render('users/signup', {name, email, password, confirm_password, number, fecha, address, localidad, piso });
  } else {
    // Look for email coincidence
    const emailUser = await User.findOne({email: email});
    if(emailUser) {
      req.flash('error_msg', 'The Email is already in use.');
      res.redirect('/users/signup');
    } else {
      // Saving a New User
      const newUser = new User({name, email, password, confirm_password, number, fecha, address, localidad, piso});
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash('success_msg', 'You are registered.');
      res.redirect('/users/signin');
    }
  }
});

router.post('/users/signup', passport.authenticate('local', {
  //successRedirect: '/notes',
  failureRedirect: '/users/signup',
  failureFlash: true
}), function (req, res, next){
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  }else{
    res.redirect('/users/profile');
  }
}
);


router.get('/users/signin', (req, res) => {
  res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
  //successRedirect: '/notes',
  failureRedirect: '/users/signin',
  failureFlash: true
}), function (req, res, next){
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
  }else{
    req.flash('success_msg', 'Loggeado exitosamente');
    res.redirect('/users/profile');
  }
});


router.get('/users/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out now.');
  res.redirect('/users/signin');
});




router.get('/users/backend', async (req, res) => {
  const users = await User.find();
  res.render('users/usersback', { users});
  
});

module.exports = router;