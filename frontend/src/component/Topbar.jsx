import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Avatar from '@mui/material/Avatar';
import SearchIcon from '@mui/icons-material/Search';
import { useState, useRef } from 'react';
import EventNoteIcon from '@mui/icons-material/EventNote';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // For the three vertical dots
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

// Styled component for the search container
const Search = styled('div', { shouldForwardProp: (prop) => prop !== 'active' })(
  ({ theme, active }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    width: active ? '300px' : '200px',
    transition: theme.transitions.create(['width', 'background-color'], {
      duration: theme.transitions.duration.shorter,
    }),
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: active ? '300px' : '200px',
    },
  })
);

// Styled component for the search icon wrapper
const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}));

// Styled component for the input base
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  paddingRight: '40px', // Space for the search icon
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 2),
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

function Topbar({ onSearchNote }) {
  const [searchActive, setSearchActive] = useState(false);
  const inputRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null); // State for managing the menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user_ = useSelector((state) => state.user.currentUser);
  const username = user_ ? user_?.split(' ')[0] : '';
  const firstLetter = username ? username?.charAt(0)?.toUpperCase() : ''; // Get the first letter and capitalize it

  const handleLogout = async () => {
    try {
      const response = await axios.post('https://keep-t7qy.onrender.com/api/auth/signout');
      
      if (response.status === 200) {
        // Successfully logged out
        toast.success('Logged out successfully!');
        navigate('/'); // Redirect to the signin page
      }
    } catch (error) {
      if (error.response) {
        toast.error('Logout failed: ' + (error.response.data.message || 'Unknown error'));
      } else if (error.request) {
        toast.error('Logout failed: No response from server');
      } else {
        toast.error('Logout failed: ' + error.message);
      }
    }
  };

  // Handle click on the search icon
  const handleSearchClick = () => {
    setSearchActive(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle blur event on the input
  const handleBlur = () => {
    setSearchActive(false);
  };

  // Menu open handler
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMenuOpen(true);
  };

  // Close the menu
  const handleCloseMenu = () => {
    setIsMenuOpen(false);
    setAnchorEl(null);
  };
 
  const [query, setQuery] = useState("");

  

  // Handle search input change
  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    onSearchNote(e.target.value); // Trigger search in Home
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#514d4d' }}>
        <Toolbar>
          {/* Left Section: Title */}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'block', sm: 'block' } }}>
              <EventNoteIcon sx={{ height: '44px', width: '32px', marginTop: '12px' }} />
            </Typography>
          </Box>

          {/* Center Section: Search */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Search active={searchActive}>
          <StyledInputBase
            placeholder="Search…"
            value={query}
            onChange={handleSearchChange}
            ref={inputRef}
            onBlur={handleBlur}
          />
          <SearchIconWrapper onClick={handleSearchClick}>
            <SearchIcon style={{marginTop:'-75px'}} />
          </SearchIconWrapper>
        </Search>
          </Box>

          {/* Right Section: Profile Icon with Name or More Menu */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {/* Show More Vert Icon for small screens */}
            <MoreVertIcon sx={{ display: { xs: 'block', sm: 'none' }, cursor: 'pointer' }} onClick={handleMenuClick} />
            
            {/* Show Profile Icon and Details for larger screens */}
            <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
              <Avatar alt="Profile Picture">{firstLetter}</Avatar>
              <Typography variant="body1" noWrap sx={{ ml: 1 }}>
                {username}
              </Typography>
              <Typography variant="body1" noWrap sx={{ ml: 1 }}>
                <LogoutIcon onClick={handleLogout} sx={{ marginTop: '8px', height: '44px', width: '29px' }} />
              </Typography>
            </Box>
          </Box>

          {/* Menu for profile options when the three dots are clicked */}
          <Menu
            anchorEl={anchorEl}
            open={isMenuOpen}
            onClose={handleCloseMenu}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleCloseMenu}>
              <Avatar alt="Profile Picture">{firstLetter}</Avatar>
              <Typography variant="body1" sx={{ ml: 1 }}>
                {username}
              </Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ marginRight: '8px' }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Topbar;
