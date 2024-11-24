import React, { useState, useEffect } from "react";
import Notecard from "../component/Card/Notecard";
import {
  Grid,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import Topbar from "../component/Topbar";
import { toast } from "react-toastify";
import axios from "axios";
import EmptyCard from "../component/Emptycard/Emptycard";

function Home() {
  const [open, setOpen] = useState(false); // Modal for adding a new note
  const [editOpen, setEditOpen] = useState(false); // Modal for editing a note
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState(null); // Currently selected note for editing
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  // Open the add note modal
  const handleClickOpen = () => {
    setOpen(true);
  };

  // Close the add note modal
  const handleClose = () => {
    setOpen(false);
  };

  // Open the edit modal
  const handleEditOpen = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setEditOpen(true);
  };

  // Close the edit modal
  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedNote(null);
    setTitle("");
    setContent("");
  };

  // Add a new note
  const addNewNote = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/note/add",
        { title, content },
        { withCredentials: true }
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      setTitle("");
      setContent("");
      handleClose();
      getAllNotes(); // Refresh notes after adding
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  // Fetch all notes
  const getAllNotes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/note/all", {
        withCredentials: true,
      });

      if (!res.data.success) {
        console.log(res.data.message);
        return;
      }

      setAllNotes(res.data.notes); // Assuming the API response contains `notes`
    } catch (error) {
      console.log(error);
    }
  };

  console.log("allNotes", allNotes);

  // Delete a note by ID
  const deleteNote = async (noteId) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/note/delete/${noteId}`,
        {
          withCredentials: true,
        }
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      setAllNotes(allNotes.filter((note) => note._id !== noteId)); // Remove the deleted note from the list
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete the note");
    }
  };

  // Edit a note
  const editNote = async () => {
    if (!selectedNote) return;

    try {
      const res = await axios.put(
        `http://localhost:3000/api/note/edit/${selectedNote._id}`,
        { title, content },
        { withCredentials: true }
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      handleEditClose();
      getAllNotes(); // Refresh notes after editing
    } catch (error) {
      console.log(error);
      toast.error("Failed to edit the note");
    }
  };

  const onSearchNote = async (query) => {
    try {
      const res = await axios.get("http://localhost:3000/api/note/search", {
        params: { title: query }, // Use title as the query parameter key
        withCredentials: true,
      });

      if (res.data.success === false) {
        console.log(res.data.message);
        toast.error(res.data.message);
        return;
      }

      setIsSearch(true);
      setAllNotes(res.data.notes); // Assuming API returns a list of notes
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Load notes when the component mounts
  useEffect(() => {
    getAllNotes();
  }, []);

  return (
    <div>
      <Topbar onSearchNote={onSearchNote} />
      <div style={{ padding: "20px", position: "relative" }}>
        {Array.isArray(allNotes) && allNotes.length > 0 ? (
          allNotes.map((note) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={note._id}>
              <Notecard
                title={note.title}
                content={note.content}
                date={note.date} // Pass the date field here
                onDelete={() => deleteNote(note._id)}
                onEdit={() => handleEditOpen(note)}
              />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <EmptyCard />
          </Grid>
        )}

        {/* Floating Action Button (FAB) for adding a note */}
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed", // Fix position to the bottom right
            bottom: "20px", // Adjust the distance from the bottom
            right: "20px", // Adjust the distance from the right
            zIndex: 1000, // Ensure it's above other content
          }}
          onClick={handleClickOpen}
        >
          <AddIcon />
        </Fab>

        {/* Add Note Modal */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            Add Note
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              sx={{
                position: "absolute",
                top: 10,
                right: 23,
              }}
            >
              <CancelIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent style={{ overflow: "hidden" }}>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Content"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={addNewNote} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Note Modal */}
        <Dialog open={editOpen} onClose={handleEditClose}>
          <DialogTitle>
            Edit Note
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleEditClose}
              sx={{
                position: "absolute",
                top: 10,
                right: 23,
              }}
            >
              <CancelIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{overflow:'hidden'}}>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              fullWidth
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Content"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={editNote} color="primary">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Home;
