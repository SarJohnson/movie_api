const express = require('express'),
    morgan = require('morgan');
const app = express();

let topMovies= [
    {
        title: 'The Exorcist',
        subgenre: 'Supernatural'
    },
    {
        title: 'Hereditary',
        subgenre: 'Supernatural/Psychological'
    },
    {
        title: 'The Conjuring',
        subgenre: 'Supernatural'
    },
    {
        title: 'The Shining',
        subgenre: 'Psychological',
    },
    {
        title: 'The Texas Chainsaw Massacre',
        subgenre: 'Slasher',
    },
    {
        title: 'The Ring',
        subgenre: 'Supernatural/Psychological',
    },
    {
        title: 'Halloween',
        subgenre: 'Slasher',
    },
    {
        title: 'Sinister',
        subgenre: 'Supernatural',
    },
    {
        title: 'Insidious',
        director: 'Supernatural/Psychological',
    },
    {
        title: 'IT',
        director: 'Supernatural',
    }
];

app.use(express.static('public'));

app.use(morgan('common'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.get('/', (req, res) => {
    res.send('Welcome to my movie app!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname});
});

app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});