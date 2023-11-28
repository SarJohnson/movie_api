const express = require('express'),
    bodyParser= require('body-parser'),
    uuid = require('uuid');

const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose');
const Models = require('./models.js');
const { check, validationResult } = require('express-validator');

const Movies = Models.Movie;
const Users = Models.User;

// Uncomment and update the connection URI if not using environment variable
/* mongoose.connect('mongodb://localhost:27017/cfDB', {
     useNewUrlParser: true, 
     useUnifiedTopology: true
}); */

// Use the connection URI from environment variable
mongoose.connect( process.env.CONNECTION_URI, {
     useNewUrlParser: true, 
     useUnifiedTopology: true
});

const cors = require('cors');
app.use(cors());

app.use(morgan('common'));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth.js')(app);

const passport = require('passport');
require('./passport.js');

//welcome message for the API
app.get('/', (req, res) => {
    res.send('Welcome to my movie app!');
});

//retrieve a list of all movies
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//retrieve a list of all users
app.get('/users', passport.authenticate('jwt', { session: false }), function (req, res) {
    Users.find()
     .then(function (users) {
        res.status(201).json(users);
     })
     .catch(function (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
     });
});

//retrieve information about a specific movie
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//retrieve the description of a movie subgenre
app.get('/movies/subgenre/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Subgenre.Name': req.params.Name })
        .then((movie) => {
            if (!movie) {
                return res.status(404).send('Error: ' + req.params.Name + ' was not found');
            } else {
                res.status(200).json(movie.Subgenre.Description);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//retrieve information about a movie director
app.get('movies/director/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
        .then((movie) => {
            if (!movie) {
                return res.status(404).send('Error: ' + req.params.Name + ' was not found');
            } else {
                res.status(200).json(movie.Director);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//retrieve information about a specific user
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        }).catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//register a new user
app.post('/users', 
[check('Username', 'Username is required').isLength({min: 5}),
check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
check('Password', 'Password is required').not().isEmpty(),
check('Email', 'Email does not appear to be valid').isEmail()], async (req, res) => {
    let errors = validationResult(req); 
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username})
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + 'already exists');
            } else {
                Users.create({
                    Username: req.body.Username,
                    Password: hashedPassword,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday,
                })
                .then ((user) => {
                    res.status(201).json(user)
                })
                .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
                });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});

//update user information
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate(
        { Username: req.params.Username }, 
        { 
            $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
        },
        },
  { new: true}
    )
    .then((updatedUser) => res.status(200).json(updatedUser))
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
  });
});

//add a movie to a user's list of favorite movies
app.post('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
    { new: true })
    .then((updatedUser) => {
        res.json(updatedUser);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//delete a user
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + ' was not found');
        } else {
            res.status(200).send(req.params.Username + ' was deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//remove a movie from a user's list of favorite movies
app.delete('/users/:Username/Movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate(
        { Username: req.params.Username },
        { $pull: { FavoriteMovies: req.params.MovieID} },
        { new: true }
    )
        .then((updatedUser) => res.status(200).json(updatedUser))
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
}); 

app.use(express.static('public')); 

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error');
});

//start the server
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Your app is listening on port ' + port);
});