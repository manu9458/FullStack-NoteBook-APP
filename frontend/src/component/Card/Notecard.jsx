import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import PinIcon from "@mui/icons-material/PushPin";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { red, grey } from "@mui/material/colors";
import { Box } from "@mui/material";
import ShareIcon from '@mui/icons-material/Share';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
export default function Notecard({ title, content, date, onEdit, onDelete, onPin, isPinned }) {
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

  return (
    <Card sx={{ maxWidth: 345, "&:hover": { boxShadow: 6 } }}>
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography gutterBottom variant="h5" component="div">
            {title || "Untitled Note"}
          </Typography>
        </div>
        {/* Date Section */}
        <Box sx={{ display: "flex", justifyContent: "flex-start", marginTop: '-10px' }}>
          {date && (
            <Typography variant="caption" color="text.secondary" sx={{ color: 'red' }}>
              {new Date(date).toLocaleDateString()}{" "}
              {new Date(date).toLocaleTimeString()}
            </Typography>
          )}
        </Box>
        <Box sx={{ marginTop: "10px", display: 'flex', justifyContent: 'flex-start' }}>
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
        <div style={{display:'flex', gap:'7px'}}>
        <ShareIcon sx={{cursor:'pointer'}} onClick={handleShare}></ShareIcon>
        <WallpaperIcon sx={{cursor:'pointer'}}></WallpaperIcon>
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
