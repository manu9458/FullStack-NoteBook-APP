import Note from "../modals/note.model.js";

// Add Note
export const addnotes = async (req, res, next) => {
  const { title, content, isPined, background } = req.body;
  const { id } = req.user;

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: "Please provide title and content",
    });
  }

  try {
    const note = new Note({
      title,
      content,
      isPined: isPined || false,
      background: background || { type: "color", value: "#ffffff" }, // Default background
      user: id,
    });

    await note.save();

    res.status(201).json({
      success: true,
      message: "Note added successfully",
      note,
    });
  } catch (error) {
    next(error);
  }
};

// Edit Note
export const editnotes = async (req, res, next) => {
  const { noteid } = req.params;
  const { title, content, isPined, background } = req.body;
  const { id: userId } = req.user;

  if (!title && !content && isPined === undefined && !background) {
    return res.status(400).json({
      success: false,
      message: "Please provide at least one field to update",
    });
  }

  try {
    const note = await Note.findOne({ _id: noteid, user: userId });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found or you do not have permission to edit this note",
      });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (isPined !== undefined) note.isPined = isPined;
    if (background) note.background = background;

    const updatedNote = await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    next(error);
  }
};


export const getAllNotes = async (req, res, next) => {
  console.log("Authenticated User:", req.user); // Log the authenticated user

  const userId = req.user.id;  // Get user ID from middleware (after authentication)

  try {
    // Retrieve all notes that belong to the authenticated user, sorted by whether they are pinned
    const notes = await Note.find({ user: userId }).sort({ isPined: -1 });

    // Return the notes in the response
    res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      notes,
    });
  } catch (error) {
    next(error);  // Pass the error to the error handler
  }
};

// Search Notes by Title
export const searchNotesByTitle = async (req, res, next) => {
  const userId = req.user.id;
  const { title } = req.query;

  try {
    let searchQuery = { user: userId };

    if (title) {
      searchQuery.title = { $regex: title, $options: 'i' };
    }

    const notes = await Note.find(searchQuery).sort({ isPined: -1 });

    res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      notes,
    });
  } catch (error) {
    next(error);
  }
};

//delete note
export const deleteNote = async (req, res, next) => {
  const noteId = req.params.noteId; // Extract the noteId from params

  try {
    // Find the note by ID and ensure it belongs to the authenticated user
    const note = await Note.findOne({ _id: noteId, user: req.user.id });

    if (!note) {
      // If no note is found, return a 404 status with a message
      return res.status(404).json({
        success: false,
        message: "Note not found or you do not have permission to delete this note",
      });
    }

    // Proceed to delete the note
    await Note.deleteOne({ _id: noteId, user: req.user.id });

    // Return a success message
    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    // If there's any error during the process, pass it to the next error handler
    console.error(error); // Optional: log the error to the console for debugging
    res.status(500).json({
      success: false,
      message: "An error occurred while deleting the note",
    });
  }
};

// Example route for pinning/unpinning a note
 export const pinnedNote =async (req, res) => {
  const { id } = req.params;
  const { isPinned } = req.body;

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { isPinned },
      { new: true } // Return the updated document
    );
    if (!updatedNote) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }
    res.json({ success: true, message: "Pin status updated", note: updatedNote });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update pin status" });
  }
};


