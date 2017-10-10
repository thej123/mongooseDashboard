var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, './static')));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/quottingdojo');
var PlatypusSchema = new mongoose.Schema({
    name: {type: String, required: true},
    age: {type: Number, required: true},
    height: {type: Number},
}, {timestamps: true});

mongoose.model('Platypus', PlatypusSchema);
var Platypus = mongoose.model('Platypus');

app.get('/', function(req, res) {
    Platypus.find({}, function(err, Platypuses) {
        if (err) {
            console.log("could not retrieve data");
            console.log(err);
            var error = err;
            res.render('index', {errors: err.error});            
        } else {
            console.log(Platypuses)
            var platypuses = Platypuses;
            res.render('index', {Platypuses: Platypuses});            
        }
    })  
})

app.get('/platypus', function(req, res) {
    res.render('new')
})

app.post('/platypus/new', function(req,res) {
    var platypus = new Platypus(req.body);
    platypus.save(function(err) {
        if (err) {
            console.log("error when submitting")
            var message = '';
            if (typeof(err.errors.name) != 'undefined') {
                message += err.errors.name.message;
            } 
            if (typeof(err.errors.age) != 'undefined'){
                message +=  " " + err.errors.age.message;
            }
            console.log(message)
            res.render('new', {errors: message})
        } else {
            console.log("item saved")
            res.redirect("/");
        }
    })
})

app.get('/edit/:id', function(req,res) {
    console.log("got id: ", req.params.id);
    Platypus.find({_id:req.params.id}, function(err, platypus) {
        if(err) {
            var errors = err;
            console.log("could not find the platypus")
            res.render('index', {errors: errors})
        } else {
            console.log(platypus)
            var platypus = platypus;
            res.render('new', {platypus: platypus})
        }
    })        
})

app.post('/platypus/update/:id', function(req,res) {
    console.log("imin")
    console.log(req)
    Platypus.update({_id:req.params.id}, {name: req.body.name, age: req.body.age, height: req.body.height}, function(err) {        
        if (err) {
            console.log("error when updating")
            var message = '';
            if (typeof(err.errors.name) != 'undefined') {
                message += err.errors.name.message;
            } 
            if (typeof(err.errors.age) != 'undefined'){
                message +=  " " + err.errors.age.message;
            }
            console.log(message)
            res.render('new', {errors: message})
        } else {
            console.log("item updated")
            res.redirect("/");
        }
    })
})

app.get('/destroy/:id', function(req, res) {
    Platypus.remove({_id: req.params.id}, function(err){ 
        if (err) {
            console.log("could not destroy")
        } else {
            console.log("it was destroyed")
        }
    res.redirect('/')
    })
})

app.listen(8000, function() {
    console.log("listening on port 8000");
})