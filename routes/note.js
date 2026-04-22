const express = require('express');
const router = express.Router();
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");

// get all the notes using : GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({user: req.user.id});
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

// Add a new note using : POST "/api/notes/addnote". Login required
router.post('/addnote', fetchuser,[
    body("title", "Title should be atleast 3 letters").isLength({ min: 3 }),
    body("description", "Description should be atleast 5 letters").isLength({min : 5})
  ], async (req, res) => {
    try {
        // If there are any errors, return Bad request and the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const {title, description, tag} = req.body;
        const note = new Note({
          user : req.user.id, title, description, tag
        });
        const savedNode = await note.save();
        res.json(savedNode);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

// Update an existing note of mine using : PUT "/api/notes/updatenote/". Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    // create a newNote object
    const newNote = {};
    // Check whether if there is any note or not
    const {title, description, tag} = req.body;
    if (title)  {newNote.title = title;}
    if (description)    {newNote.description = description;}
    if (tag)    {newNote.tag = tag;}
    try {
        // Find the note to be updaed
        let note = await Note.findById(req.params.id);
        if (!note)  return res.status(404).send("Not Found");
        // Allow updation only if user owns this note
        if (note.user.toString() !== req.user.id)    return res.status(401).send("Not Allowed");
        // Update the note
        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {returnDocument: 'after'});
        return res.json({note});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
    
})

// Delete an existing note of mine using : DELETE "/api/notes/deletenote/". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be deleted
        let note = await Note.findById(req.params.id);
        if (!note)  return res.status(404).send("Not Found");
        // Allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id)    return res.status(401).send("Not Allowed");
        // Delete the note
        note = await Note.findByIdAndDelete(req.params.id);
        return res.json({"Success": "Note has been deleted succesfully", note: note});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

module.exports = router;