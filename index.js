const express = require('express'),
    morgan = require('morgan'),
    bodyParser= require('body-parser'),
    uuid = require('uuid');
const app = express();

let users= [];

let movies= [
    {
        "Title":"The Exorcist",
        "Description":"When young Regan starts acting odd -- levitating, speaking in tongues -- her worried mother seeks medical help, only to hit a dead end. A local priest, however, thinks the girl may be seized by the devil. The priest makes a request to perform an exorcism, and the church sends in an expert to help with the difficult job.",
        "Subgenre": {
            "Name":"Demonic Possession",
            "Description":"Demonic possession horror films feature humans inhabited by demons or other malevolent entities."
        },
        "Director": {
            "Name":"William Friedkin",
            "Birth":"1935"
        }
    },
    {
        "Title":"Krampus",
        "Description":"While the holiday season represents the most magical time of year, ancient European folklore warns of Krampus, a horned beast who punishes naughty children at Christmastime. When dysfunctional family squabbling causes young Max to lose his festive spirit, it unleashes the wrath of the fearsome creature. As Krampus lays siege to the Engel home, mom, pop, sister, and brother must band together to save one another from a monstrous fate.",
        "Subgenre": {
            "Name":"Monster",
            "Description":"Monster horror films feature vampires, zombies, werewolves, or other types of monsters usually rooted in legend."
        },
        "Director": {
            "Name":"Michael Dougherty",
            "Birth":"1974"
        }
    },
    {
        "Title":"The Conjuring",
        "Description":"In 1970, paranormal investigators Lorraine and Ed Warren are summoned to the home of Carolyn and Roger Perron. The Perrons and their five daughters have recently moved into a secluded farmhouse, where a supernatural presence has made itself known. Though the manifestations are relatively benign at first, events soon escalate in horrifying fashion, especially after the Warrens discover the house's macabre history.",
        "Subgenre": {
            "Name":"Paranormal",
            "Description":"Paranormal horror films feature ghosts and spirits of dead people with unfinished business."
        },
        "Director": {
            "Name":"James Wan",
            "Birth":"1977"
        }
    },
    {
        "Title":"The Shining",
        "Description":"Jack Torrance becomes winter caretaker at the isolated Overlook Hotel in Colorado, hoping to cure his writer's block. He settles in along with his wife, Wendy, and his son, Danny, who is plagued by psychic premonitions. As Jack's writing goes nowhere and Danny's visions become more disturbing, Jack discovers the hotel's dark secrets and begins to unravel into a homicidal maniac hell-bent on terrorizing his family.",
        "Subgenre": {
            "Name": "Psychological",
            "Description":"Psychological horror films play on human emotional states to distub viewers, usually featuring mental illness, survivalism, or common phobias."
        },
        "Director": {
            "Name":"Stanley Kubrick",
            "Birth":"1928"
        }
    },
    {
        "Title":"Halloween",
        "Description":"On a cold Halloween night in 1963, six year old Michael Myers brutally murdered his 17-year-old sister, Judith. He was sentenced and locked away for 15 years. But on October 30, 1978, while being transferred for a court date, a 21-year-old Michael Myers steals a car and escapes Smith's Grove. He returns to his quiet hometown of Haddonfield, Illinois, where he looks for his next victims.",
        "Subgenre": {
            "Name":"Slasher",
            "Description":"Slasher horror films feature a human-like killer (sometimes with superhuman powers) that hunts down a group of people."
        },
        "Director": {
            "Name":"John Carpenter",
            "Birth":"1948"
        }
    },
    {
        "Title":"Saw",
        "Description":"Photographer Adam Stanheight and oncologist Lawrence Gordon regain consciousness while chained to pipes at either end of a filthy bathroom. As the two men realize they've been trapped by a sadistic serial killer nicknamed Jigsaw and must complete his perverse puzzle to live, flashbacks relate the fates of his previous victims. Meanwhile, Dr. Gordon's wife and young daughter are forced to watch his torture via closed-circuit video.",
        "Subgenre": {
            "Name":"Gore",
            "Description":"Gore horror films feature bouts of extreme violence and explicit scenes of torture and mutilation."
        },
        "Director": {
            "Name":"James Wan",
            "Birth":"1977"
        }
    },
    {
        "Title":"The Cabin in the Woods",
        "Description":"When five college friends arrive at a remote forest cabin for a little vacation, little do they expect the horrors that await them. One by one, the youths fall victim to backwoods zombies, but there is another factor at play. Two scientists are manipulating the ghoulish goings-on, but even as the body count rises, there is yet more at work than meets the eye.",
        "Subgenre": {
            "Name":"Comedic",
            "Description":"Comedic horror films parody classic horror tropes and are designed to be more playful than frightening."
        },
        "Director": {
            "Name":"Drew Goddard",
            "Birth":"1975"
        }
    },
    {
        "Title":"The Witch",
        "Description":"In 1630 New England, panic and despair envelops a farmer, his wife and their children when youngest son Samuel suddenly vanishes. The family blames Thomasin, the oldest daughter who was watching the boy at the time of his disappearance. With suspicion and paranoia mounting, twin siblings Mercy and Jonas suspect Thomasin of witchcraft, testing the clan's faith, loyalty and love to one another.",
        "Subgenre": {
            "Name":"Witchcraft",
            "Description":"Witchcraft horror films feature cults or the occult and focus on magical terror."
        },
        "Director": {
            "Name":"Robert Eggers",
            "Birth":"1983"
        }
    },
    {
        "Title":"Aliens",
        "Description":"After floating in space for 57 years, Lt. Ripley's shuttle is found by a deep space salvage team. Upon arriving at LV-426, the marines find only one survivor, a nine year old girl named Newt. But even these battle-hardened marines with all the latest weaponry are no match for the hundreds of aliens that have invaded the colony.",
        "Subgenre": {
            "Name":"Science Fiction",
            "Description":"Sci-fi horror films combine terror with science, usually deaturing futuristic threats or alien species."
        },
        "Director": {
            "Name":"James Cameron",
            "Birth":"1954"
        }
    },
    {
        "Title":"The Blair Witch Project",
        "Description":"Found video footage tells the tale of three film students who've traveled to a small town to collect documentary footage about the Blair Witch, a legendary local murderer. Over the course of several days, the students interview townspeople and gather clues to support the tale's veracity. But the project takes a frightening turn when the students lose their way in the woods and begin hearing horrific noises.",
        "Subgenre": {
            "Name":"Found Footage",
            "Description":"Found footage horror films are a type of film style typically with one character filming, these films tend to have grainy images and shaky cameras."
        },
        "Director": {
            "Name":"Eduardo Sanchez and Daniel Myrick",
            "Birth":"1968/1963"
        }
    },
];

app.use(express.static('public'));

app.use(morgan('common'));

app.use(bodyParser.json());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.post('/users', (req, res) => {
    const newUser = req.body;
    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('users need names')
    }
});

app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
    let user = users.find( user => user.id == id );
    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user')
    }
});

app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    let user = users.find( user => user.id == id );
    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).json(`$(movieName) has been added to user $(id)'s array`);
    } else {
        res.status(400).send('no such user')
    }
});

app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    let user = users.find( user => user.id == id );
    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).json(`$(movieName) has been removed from user $(id)'s array`);
    } else {
        res.status(400).send('no such user')
    }
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    let user = users.find( user => user.id == id );
    if (user) {
        users = user.filter( user => user.id != id);
        res.status(200).send(`user $(id) has been deleted`);
    } else {
        res.status(400).send('no such user')
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to my movie app!');
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname});
});

app.get('/movies', (req, res) => {
    res.status(200).json(movies);
});

app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find( movie => movie.Title === title );
    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('no such movie')
    }
});

app.get('/movies/subgenre/:subgenreName', (req, res) => {
    const { subgenreName } = req.params;
    const subgenre = movies.find( movie => movie.Subgenre.Name === subgenreName ).Subgenre;
    if (subgenre) {
        res.status(200).json(subgenre);
    } else {
        res.status(400).send('no such subgenre')
    }
});

app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.Director.Name === directorName ).Director;
    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('no such director')
    }
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});