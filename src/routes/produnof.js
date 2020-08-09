const express = require('express');
const router = express.Router();
const mercadopago = require("mercadopago");


// Models
const Produnof = require('../models/produnof');
const Cart = require('../models/cart');
const Order = require('../models/order');

// Helpers
const { isAuthenticated } = require('../helpers/auth');



///////////////////////////////////////////////////////////////////////7

router.post('/produnof/new-produno',  async (req, res) => {
  const { name, title, image, imagedos, imagetres, description, oldprice, price, filtroprice, filtrobrand, color, colorstock, talle, tallestock } = req.body;
  const errors = [];
  if (!image) {
    errors.push({text: 'Please Write a Title.'});
  }
  if (!title) {
    errors.push({text: 'Please Write a Description'});
  }
  if (!price) {
    errors.push({text: 'Please Write a Description'});
  }
  if (errors.length > 0) {
    res.render('notes/new-note', {
      errors,
      image,
      title,
      price
    });
  } else {
    const newNote = new Produnof({ name, title, image, imagedos, imagetres, description, oldprice, price, filtroprice, filtrobrand, color, colorstock, talle, tallestock });
    //newNote.user = req.user.id;
    await newNote.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('/produnofback/1');
  }
});



router.get('/produnofredirect/:id', async (req, res) => {
  const { id } = req.params;
  const produnof = await Produnof.findById(id);
  res.render('produno/produnof/produnoredirect', {produnof});
});



////////////////////////////////////////////////////////////////7


router.get('/produnofindex/:page', async (req, res) => {


  let perPage = 8;
  let page = req.params.page || 1;

  Produnof 
  .find({}) // finding all documents
  .sort({ _id: -1 })
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, produnof) => {
    Produnof.countDocuments((err, count) => { // count to calculate the number of pages
      if (err) return next(err);
      res.render('produno/produnof/produno', {
        produnof,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    });
  });
});





router.get("/search", function(req, res){
  let perPage = 8;
  let page = req.params.page || 1;

  var noMatch = null;
  if(req.query.search) {
      const regex = new RegExp(escape(req.query.search), 'gi');
      // Get all campgrounds from DB
      console.log(req.query.search)
      Produno
      // finding all documents
      .find({title: regex}) 
      .sort({ _id: -1 })
      .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
      .limit(perPage) // output just 9 items
      .exec((err, produnof) => {
       Produnof.countDocuments((err, count) => {
        if (err) return next(err);
            res.render("produno/produnof/produno",{
              produnof, 
              current: page,
              pages: Math.ceil(count / perPage)
            });
          });
        });
  } else {
      // Get all campgrounds from DB
      Produnof.find({}, function(err, produnof){
         if(err){
             console.log(err);
         } else {
            res.render("produno/produnof/produno",{
                produnof,
              current: page,
              pages: Math.ceil(count / perPage)
              });
         }
      });
  }
});















///////////////////////////////////////////////////////////
router.get('/produnofback/:page', async (req, res) => {


  let perPage = 8;
  let page = req.params.page || 1;

  Produnof 
  .find({}) // finding all documents
  .sort({ _id: -1 })
  .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
  .limit(perPage) // output just 9 items
  .exec((err, produnof) => {
    Produnof.countDocuments((err, count) => { // count to calculate the number of pages
      if (err) return next(err);
      res.render('produno/produnof/new-produno', {
        produnof,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    });
  });
});


router.get("/searchback", function(req, res){
  let perPage = 8;
  let page = req.params.page || 1;

  var noMatch = null;
  if(req.query.search) {
      const regex = new RegExp(escape(req.query.search), 'gi');
      // Get all campgrounds from DB
      console.log(req.query.search)
      Produnof
      // finding all documents
      .find({title: regex}) 
      .sort({ _id: -1 })
      .skip((perPage * page) - perPage) // in the first page the value of the skip is 0
      .limit(perPage) // output just 9 items
      .exec((err, produnof) => {
        Produnof.countDocuments((err, count) => {
        if (err) return next(err);
            res.render("produno/produnof/new-produno",{
              produnof, 
              current: page,
              pages: Math.ceil(count / perPage)
            });
          });
        });
  } else {
      // Get all campgrounds from DB
      Produnof.find({}, function(err, produnof){
         if(err){
             console.log(err);
         } else {
            res.render("produno/produnof/new-produno",{
              produnof,
              current: page,
              pages: Math.ceil(count / perPage)
              });
         }
      });
  }
});


router.get('/produnobackend/:id', async (req, res) => {
  const { id } = req.params;
  const produnof = await Produnof.findById(id);
   res.render('produno/produnobackend', {produnof});
});


///////////////////////////////////////////////////////////////////////////7



// talle y color
router.get('/produnof/tallecolor/:id',  async (req, res) => {
  const produnof = await Produnof.findById(req.params.id);
  res.render('produno/produnof/tallecolor-produno', { produnof });
});

router.post('/produnof/tallecolor/:id',  async (req, res) => {
  const { id } = req.params;
  await Produnof.updateOne({_id: id}, req.body);

  res.redirect('/produnoredirect/' + id);
});




//editar


router.get('/produnof/edit/:id',  async (req, res) => {
  const produnof = await Produnof.findById(req.params.id);
  res.render('produno/produnof/edit-produno', { produnof });
});

router.post('/produnof/edit/:id',  async (req, res) => {
  const { id } = req.params;
  await Produnof.updateOne({_id: id}, req.body);
  res.redirect('/produnoback/1');
});




// Delete 
router.get('/produnof/delete/:id', async (req, res) => {
  const { id } = req.params;
    await Produnof.deleteOne({_id: id});
  res.redirect('/produnoback/1');
});







router.get('/addtocardprodunof/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Produnof.findById(productId, function(err, product){
    if(err){
      return res-redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/shopcart');

  });
});