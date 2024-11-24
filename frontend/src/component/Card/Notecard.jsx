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

export default function Notecard({ title, content, date, onEdit, onDelete }) {
  const [isPinned, setIsPinned] = React.useState(false);

  const handlePinClick = () => {
    setIsPinned((prev) => !prev);
  };

  return (
    <Card sx={{ maxWidth: 345, "&:hover": { boxShadow: 6 } }}>
      <CardContent>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography gutterBottom variant="h5" component="div">
            {title || "Untitled Note"}
          </Typography>
          <IconButton
            size="small"
            onClick={handlePinClick}
            sx={{ color: isPinned ? red[500] : grey[500] }}
          >
            <PinIcon />
          </IconButton>
        </div>
          {/* Date Section */}
         <Box sx={{ display: "flex", justifyContent: "flex-start",marginTop:'-10px' }}>
         {date && (
          <Typography variant="caption" color="text.secondary" sx={{color:'red'}}>
            {new Date(date).toLocaleDateString()}{" "}
            {new Date(date).toLocaleTimeString()}
          </Typography>
        )}
         </Box>
        <Box sx={{marginTop:"10px", display:'flex', justifyContent:'flex-start'}}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ marginBottom: 1 }}
        >
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
        <Button size="small">Share</Button>
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
