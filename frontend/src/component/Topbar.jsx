import React, { useRef, useState } from "react";
import "../style/topbar.css";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import ViewStreamIcon from "@mui/icons-material/ViewStream";
import SettingsIcon from "@mui/icons-material/Settings";
import AppsIcon from "@mui/icons-material/Apps";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { Typography, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import NotesIcon from "@mui/icons-material/Note";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GroupIcon from "@mui/icons-material/Group";
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import logo from "../assest/keep.png";
const Topbar = ({ onSearchNote }) => {
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const user_ = useSelector((state) => state.user.currentUser);
  const username = user_ ? user_?.split(" ")[0] : "";
  const firstLetter = username ? username?.charAt(0)?.toUpperCase() : ""; // Get the first letter and capitalize it

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:3000/api/auth/signout");

      if (response.status === 200) {
        // Successfully logged out
        toast.success("Logged out successfully!");
        navigate("/"); // Redirect to the signin page
      }
    } catch (error) {
      if (error.response) {
        toast.error("Logout failed: " + (error.response.data.message || "Unknown error"));
      } else if (error.request) {
        toast.error("Logout failed: No response from server");
      } else {
        toast.error("Logout failed: " + error.message);
      }
    }
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    onSearchNote(e.target.value); // Trigger search in Home
  };

  const toggleDrawer = (open) => {
    setDrawerOpen(open);
  };

  const [isFocused, setIsFocused] = useState(false); // State to track focus

  // Handle input change
 
  // Handle focus event
  const handleFocus = () => {
    setIsFocused(true);
  };

  // Handle blur event (when the input loses focus)
  const handleBlur = () => {
    setIsFocused(false);
  };

  const [isGridView, setIsGridView] = useState(true); // Default to ViewStreamIcon

  // Handle click on the icon to toggle the view
  const toggleView = () => {
    setIsGridView(!isGridView); // Toggle the state
  };

  

  return (
    <div className="topbar">
      {/* Left Section */}
      <div className="topbar-left">
        <MenuIcon className="icon" />
        <img src={logo} alt="logo"></img>
        <span className="title">Keep</span>
      </div>

      {/* Center Section: Search Bar */}
      <div className="topbar-center">
      <div
        className={`search-container ${isFocused ? "focused" : ""}`} // Add class based on focus state
      >
        <SearchIcon className="search-icon" />
        <input
          value={query}
          onChange={handleSearchChange}
          onFocus={handleFocus} // Set focus when clicked
          onBlur={handleBlur}   // Reset focus when blurred
          type="text"
          placeholder="Search"
          className="search-input"
        />
      </div>
    </div>

      {/* Right Section */}
      <div className="topbar-right">
        {/* <RefreshIcon className="icon" /> */}
        <span className="icon" onClick={toggleView}>
          {isGridView ? <ViewStreamIcon className="icon" /> : <ViewColumnIcon className="icon" />}
        </span>
        <SettingsIcon className="icon" />
        <AppsIcon className="icon" />
        <Avatar alt="Profile Picture"
         id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick} 
        >{firstLetter}</Avatar>
        <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
        {/* <Typography variant="body1" noWrap sx={{ ml: 1 }}>
          {username}
        </Typography> */}
        {/* <Typography variant="body1" noWrap sx={{ ml: 1 }}> */}
          {/* {/* <LogoutIcon
            onClick={handleLogout}
            sx={{ marginTop: "8px", height: "44px", width: "29px" }}
          /> */}
            
        {/* </Typography>  */}
      </div>

      </div>
  );
};

export default Topbar;
