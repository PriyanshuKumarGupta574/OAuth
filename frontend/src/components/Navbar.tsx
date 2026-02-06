import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Tooltip,
  InputBase,
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "25ch",
    },
  },
}));

export default function Navbar() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notiAnchorEl, setNotiAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const isMenuOpen = Boolean(anchorEl);
  const isNotiOpen = Boolean(notiAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotiOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotiAnchorEl(event.currentTarget);
  };

  const handleNotiClose = () => {
    setNotiAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    handleMenuClose();
  };

  const triggerSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/dashboard/snippets?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      triggerSearch();
    }
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: "primary.main" }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            display: { xs: "none", sm: "block" },
            fontWeight: 800,
            cursor: "pointer",
            color: "#ffffff",
            letterSpacing: "-0.5px",
            fontSize: "1.4rem",
            mr: 4
          }}
          onClick={() => navigate("/dashboard")}
        >
          SnippetManager
        </Typography>

        <Search sx={{ display: 'flex', alignItems: 'center' }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search snippets..."
            inputProps={{ "aria-label": "search" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
          />
          <IconButton
            size="small"
            sx={{ color: 'white', mr: 0.5, opacity: searchQuery ? 1 : 0.5 }}
            onClick={triggerSearch}
            disabled={!searchQuery}
          >
            <SearchIcon fontSize="small" />
          </IconButton>
        </Search>

        <Box sx={{ flexGrow: 1 }} />

        {token ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton size="large" color="inherit" onClick={handleNotiOpen}>
                <Badge badgeContent={4} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Account settings">
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}>
                  <AccountCircle />
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <Button color="inherit" onClick={() => navigate("/")}>Login</Button>
        )}

        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          id="primary-search-account-menu"
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { handleMenuClose(); navigate("/dashboard/profile"); }}>
            <AccountCircle sx={{ mr: 2 }} /> Profile
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); navigate("/dashboard/settings"); }}>
            <SettingsIcon sx={{ mr: 2 }} /> Settings
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <LogoutIcon sx={{ mr: 2 }} /> Logout
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notiAnchorEl}
          open={isNotiOpen}
          onClose={handleNotiClose}
          PaperProps={{
            sx: { width: 320, maxHeight: 400, mt: 1.5, borderRadius: 3 }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight={700}>Notifications</Typography>
            <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }}>Mark all as read</Typography>
          </Box>
          <Divider />
          <List sx={{ p: 0 }}>
            {[
              { id: 1, text: "New comment on 'Authentication flow'", time: "2m ago" },
              { id: 2, text: "Team 'Frontend' invited you", time: "1h ago" },
              { id: 3, text: "Your snippet 'Passport Config' was forked", time: "3h ago" },
              { id: 4, text: "Welcome to SnippetManager!", time: "1d ago" },
            ].map((noti) => (
              <MenuItem key={noti.id} onClick={handleNotiClose} sx={{ py: 1.5, borderBottom: '1px solid #f1f5f9' }}>
                <ListItemText
                  primary={noti.text}
                  secondary={noti.time}
                  primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </MenuItem>
            ))}
          </List>
          <Box sx={{ p: 1, textAlign: 'center' }}>
            <Button size="small" fullWidth>View all notifications</Button>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
