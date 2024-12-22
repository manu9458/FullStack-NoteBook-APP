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
  Box,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import Topbar from "../component/Topbar";
import { toast } from "react-toastify";
import axios from "axios";
import EmptyCard from "../component/Emptycard/Emptycard";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function Home() {
  const [open, setOpen] = useState(false); // Modal for adding a new note
  const [editOpen, setEditOpen] = useState(false); // Modal for editing a note
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState(null); // Currently selected note for editing
  const [allNotes, setAllNotes] = useState([]); // All notes (both pinned and unpinned)
  const [isSearch, setIsSearch] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditOpen = (note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setSelectedNote(null);
    setTitle("");
    setContent("");
  };

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
      getAllNotes();
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const getAllNotes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/note/all", {
        withCredentials: true,
      });
      if (!res.data.success) {
        console.log(res.data.message);
        return;
      }
      setAllNotes(res.data.notes);
    } catch (error) {
      console.log(error);
    }
  };

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
      setAllNotes(allNotes.filter((note) => note._id !== noteId));
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete the note");
    }
  };

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
      getAllNotes();
    } catch (error) {
      console.log(error);
      toast.error("Failed to edit the note");
    }
  };

  const onSearchNote = async (query) => {
    try {
      const res = await axios.get("http://localhost:3000/api/note/search", {
        params: { title: query },
        withCredentials: true,
      });
      if (res.data.success === false) {
        console.log(res.data.message);
        toast.error(res.data.message);
        return;
      }
      setIsSearch(true);
      setAllNotes(res.data.notes);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const togglePin = async (noteId, isPinned) => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/note/pin/${noteId}`,
        { isPinned: !isPinned }, // Toggle the pin state
        { withCredentials: true }
      );
      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }
      toast.success(res.data.message);

      // Update the note's pin status in the state
      setAllNotes(
        allNotes.map((note) =>
          note._id === noteId ? { ...note, isPinned: !isPinned } : note
        )
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to update pin status");
    }
  };

  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    if (destination.index === source.index) return;

    const reorderedNotes = Array.from(allNotes);
    const [removed] = reorderedNotes.splice(source.index, 1);
    reorderedNotes.splice(destination.index, 0, removed);
    setAllNotes(reorderedNotes);
  };

  useEffect(() => {
    getAllNotes();
  }, []);

  const pinnedNotes = allNotes.filter((note) => note.isPinned);
  const unpinnedNotes = allNotes.filter((note) => !note.isPinned);

  return (
    <div>
      <Topbar onSearchNote={onSearchNote} />
      <div style={{ padding: "20px", position: "relative" }}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Grid container spacing={2}>
            <Droppable droppableId="pinnedNotes">
              {(provided) => (
                <Grid
                  container
                  spacing={2}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {pinnedNotes.map((note, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={note._id}>
                      <Draggable draggableId={note._id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Notecard
                              title={note.title}
                              content={note.content}
                              date={note.date}
                              onDelete={() => deleteNote(note._id)}
                              onEdit={() => handleEditOpen(note)}
                              onPin={() => togglePin(note._id, note.isPinned)} // Use togglePin here
                              isPinned={note.isPinned}
                            />
                          </div>
                        )}
                      </Draggable>
                    </Grid>
                  ))}
                  {provided.placeholder}
                </Grid>
              )}
            </Droppable>

            <Droppable droppableId="unpinnedNotes">
              {(provided) => (
                <Grid
                  container
                  spacing={2}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {unpinnedNotes.map((note, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={note._id}>
                      <Draggable draggableId={note._id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Notecard
                              title={note.title}
                              content={note.content}
                              date={note.date}
                              onDelete={() => deleteNote(note._id)}
                              onEdit={() => handleEditOpen(note)}
                              onPin={() => {}}
                              isPinned={false}
                            />
                          </div>
                        )}
                      </Draggable>
                    </Grid>
                  ))}
                  {provided.placeholder}
                </Grid>
              )}
            </Droppable>
          </Grid>
        </DragDropContext>

        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
          }}
          onClick={handleClickOpen}
        >
          <AddIcon />
        </Fab>

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
          <DialogContent sx={{ overflow: "hidden" }}>
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
