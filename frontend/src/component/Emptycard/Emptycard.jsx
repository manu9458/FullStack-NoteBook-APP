import React from "react";
import { Box, Typography } from "@mui/material";
import image from "../../assest/empty.jpg";

function EmptyCard() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "462px",
        border: "1px dashed gray",
        borderRadius: "8px",
        textAlign: "center",
        padding: "20px",
      }}
    >
      {/* Image Section */}
      <Box
        component="img"
        src={image} // Replace with your image path
        alt="No notes illustration"
        sx={{
          width: "100%", // Full width by default
          maxWidth: "400px", // Restrict maximum width
          height: "auto", // Maintain aspect ratio
          marginBottom: "16px",
          "@media (max-width: 600px)": {
            maxWidth: "300px", // Smaller width for mobile
          },
        }}
      />

      {/* Text Section */}
      <Typography variant="h6" color="textSecondary">
        No notes available
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Click the '+' button to add a new note.
      </Typography>
    </Box>
  );
}

export default EmptyCard;
