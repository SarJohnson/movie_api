const passport = require('passport'), // Authentication middleware for Node.js
    LocalStrategy = require('passport-local').Strategy, //Passport strategy for authenticating with a username and password
    Models = require('./models.js'),
    passportJWT = require('passport-jwt'); //Passport strategy for authenticating with a JSON Web Token

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(
    new LocalStrategy(
        {
            usernameField: 'Username', //The field name for the username in the request 
            passwordField: 'Password', //The field name for the password in the request
        },
        async (username, password, callback) => {
            console.log(`${username} ${password}`);
            await Users.findOne({ Username: username })
            .then((user) => {
                if (!user) {
                    console.log('incorrect username');
                    return callback(null, false, {
                        message: 'Incorrect username or password.'
                    });
                }
                if (!user.validatePassword(password)) {
                    console.log('incorrect password');
                    return callback(null, false, { message: 'Incorrect password.' });
                }
                console.log('finished');
                return callback(null, user);
            })
            .catch((error) => {
            if (error) {
                console.log(error);
                return callback(error);
            }
        });
        }
    )
);

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), //Function to extract the JWT from the request
        secretOrKey: 'your_jwt_secret' //The secret key used to verify the JWT signature
}, async (jwtPayload, callback) => {
    return await Users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback(error)
        });
}));