import express from "express";
import { addnotes, editnotes, getAllNotes, searchNotesByTitle, deleteNote } from "../controller/note.controller.js";
import { verifyToken } from "../utills/varifyUser.js";

const router = express.Router();

// Add Note
router.post("/add", verifyToken, addnotes);

// Edit Note (Use PUT for updates)
router.put("/edit/:noteid", verifyToken, editnotes);

// Get All Notes
router.get("/all", verifyToken, getAllNotes);

// Search Notes by Title
router.get("/search", verifyToken, searchNotesByTitle);

// //delete notes
router.delete("/delete/:noteId", verifyToken, deleteNote)

export default router;
