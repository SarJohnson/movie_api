const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//defines the structure for storing movie information in the MongoDB database
let movieSchema = mongoose.Schema({
    Title: {type: String, required: true}, //title of movie
    Description: {type: String, required: true}, //description of movie
    Subgenre: {
        Name: String, //name of subgenre
        Description: String //description of subgenre
    }, 
    Director: {
        Name: String, //name of director
        Birth: String //birthdate of director
    },
    Watch: {type: String, required: true}, //watch link
    Price: {type: String, required: true}, //price of movie
});

//defines the structure for storing user information in the MongoDB database
let userSchema = mongoose.Schema({
    Username: {type: String, required: true}, //user's username
    Password: {type: String, required: true}, //user's password
    Email: {type: String, required: true}, //user's email address
    Birthday: Date, //user's date of birth
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }] //array of movie IDs referencing the Movie model
});

//static method to hash the user's password using bcrypt
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

//instance method to validate a provided password against the stored hashed password
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;