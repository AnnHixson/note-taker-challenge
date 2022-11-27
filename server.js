const express = require('express');
const path = require('path');
const fs = require('fs');
const notesData = require('./db/db.json');
const { randomUUID } = require('crypto');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Either this...
// app.get('*', (req, res) => 
//     res.sendFile(path.join(__dirname, '/public/index.html'))
// );
// ...or this
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) => 
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// GET request for notes
app.get('/api/notes', (req, res) => {
    // Log our GET request to the terminal
    console.info(`${req.method} request received to get notes`);
    // read db.json file
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if(err) {
            console.error(err);
        } else {
            // return all saved notes in db.json file
            res.json(JSON.parse(data));
        }
    })
});
  
// POST request to add a note
app.post('/api/notes', (req, res) => {
    // Log our POST request to the terminal
    console.info(`${req.method} request received to add a note`);

    // Destructuring assignment for the items in req.body
    const { noteTitle, noteText } = req.body;

    // recieve a new note to save on the request body
    // if (noteTitle && noteText) {
        const newNote = {
            noteTitle,
            noteText,
            // give each note a unique id when it's saved
            noteId: randomUUID(),
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if(err) {
                console.error(err);
            } else {
                const parsedNotes = JSON.parse(data);

                // add new note to db.json file
                parsedNotes.push(newNote);

                // return new note to client
                fs.writeFile(
                    './db/db.json',
                    JSON.stringify(parsedNotes, null, 3),
                    (writeErr) =>
                        writeErr
                            ? console.error(writeErr)
                            : console.info('Successfully added note!')
                );
            }
        });

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    // } else {
    //     res.status(500).json('Error in adding note');
    // }
});

app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);