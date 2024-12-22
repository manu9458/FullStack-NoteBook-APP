import Note from "../modals/note.model.js";

// Add Note
export const addnotes = async (req, res, next) => {
  const { title, content, isPined } = req.body;
  const { id } = req.user; // Ensure `req.user` is set by middleware

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
  const { noteid } = req.params; // Get `noteid` from route parameter
  const { title, content, isPined } = req.body; // Get fields to be updated from request body
  const { id: userId } = req.user; // Get user ID from middleware

  // Ensure at least one field is provided for updating
  if (!title && !content && isPined === undefined) {
    return res.status(400).json({
      success: false,
      message: "Please provide at least one field to update",
    });
  }

  try {
    // Find the note by `noteid` and ensure it belongs to the current user
    const note = await Note.findOne({ _id: noteid, user: userId });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found or you do not have permission to edit this note",
      });
    }

    // Update fields if provided in the request body
    if (title) note.title = title;
    if (content) note.content = content;
    if (isPined !== undefined) note.isPined = isPined;

    // Save the updated note to the database
    const updatedNote = await note.save();

    // Respond with the updated note
    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (error) {
    next(error); // Pass any error to the error handler
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

