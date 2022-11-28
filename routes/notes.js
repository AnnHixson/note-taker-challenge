const notes = require('express').Router();
const fs = require('fs');
const notesData = require('../db/db.json');
const { randomUUID } = require('crypto');

// GET route for retrieving all of the notes
notes.get('/', (req, res) => {
    console.info(`${req.method} request recieved to get notes`);
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if(err) {
            console.error(err);
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// POST route for adding a new note
notes.post('/', (req, res) => {
    console.info(`${req.method} request recieved to add a note`);
    console.log(req.body);

    const { title, text } = req.body;

    if (title && text) {
        const activeNote = {
            title,
            text,
            // Give each note a unique id when it's saved
            id: randomUUID(),
        };

        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
            } else {
                const parsedNotes = JSON.parse(data);

                parsedNotes.push(activeNote);

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
            body: activeNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in adding note');
    }
});

module.exports = notes;
