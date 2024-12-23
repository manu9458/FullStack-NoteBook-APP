import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import PinIcon from "@mui/icons-material/PushPin";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ShareIcon from "@mui/icons-material/Share";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import CancelIcon from "@mui/icons-material/Cancel";
import { Box, Menu, MenuItem } from "@mui/material";

export default function Notecard({ title, content, date, onEdit, onDelete, onPin, isPinned }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [background, setBackground] = useState({ type: "color", value: "#ffffff" }); // Default background

  const handleWallpaperClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBackgroundSelect = (type, value) => {
    setBackground({ type, value });
    handleClose();
  };

  const handleRemoveBackground = () => {
    setBackground({ type: "color", value: "#ffffff" }); // Reset to default
    handleClose();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: title,
          text: content,
          url: window.location.href,
        })
        .then(() => {
          console.log("Shared successfully");
        })
        .catch((error) => {
          console.log("Error sharing: ", error);
        });
    } else {
      console.log("Web Share API not supported in this browser.");
    }
  };

  const colors = [
    "#FFEBEE", "#E3F2FD", "#E8F5E9", "#FFF3E0", "#F3E5F5", "#FFEB3B", "#81D4FA", "#A5D6A7",
    "#B39DDB", "#FFCDD2", "#D1C4E9", "#C5CAE9"
  ];
  const images = [
    "https://via.placeholder.com/150x100?text=Image+1",
    "https://via.placeholder.com/150x100?text=Image+2",
    "https://via.placeholder.com/150x100?text=Image+3",
    "https://via.placeholder.com/150x100?text=Image+4",
  ];

  return (
    <Card
      sx={{
        maxWidth: 345,
        backgroundColor: background.type === "color" ? background.value : "transparent",
        backgroundImage: background.type === "image" ? `url(${background.value})` : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        "&:hover": { boxShadow: 6 },
      }}
    >
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography gutterBottom variant="h5" component="div">
            {title || "Untitled Note"}
          </Typography>
        </div>
        {/* Date Section */}
        <Box sx={{ display: "flex", justifyContent: "flex-start", marginTop: "-10px" }}>
          {date && (
            <Typography variant="caption" color="text.secondary" sx={{ color: "red" }}>
              {new Date(date).toLocaleDateString()} {new Date(date).toLocaleTimeString()}
            </Typography>
          )}
        </Box>
        <Box sx={{ marginTop: "10px", display: "flex", justifyContent: "flex-start" }}>
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 1 }}>
            {content || "No content available"}
          </Typography>
        </Box>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "7px" }}>
          <ShareIcon sx={{ cursor: "pointer" }} onClick={handleShare}></ShareIcon>
          <WallpaperIcon sx={{ cursor: "pointer" }} onClick={handleWallpaperClick}></WallpaperIcon>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", padding: "10px" }}>
              {colors.map((color) => (
                <div
                  key={color}
                  onClick={() => handleBackgroundSelect("color", color)}
                  style={{
                    backgroundColor: color,
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                ></div>
              ))}
              <div
                onClick={handleRemoveBackground}
                style={{
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "50%",
                  backgroundColor: "#f5f5f5",
                  cursor: "pointer",
                }}
              >
                <CancelIcon />
              </div>
            </div>
          </Menu>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <IconButton size="small" onClick={onEdit}>
            <EditIcon />
          </IconButton>
          <IconButton size="small" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </div>
      </CardActions>
    </Card>
  );
}
