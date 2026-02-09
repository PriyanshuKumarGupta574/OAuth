import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Tooltip,
  InputBase,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import Divider from "@mui/material/Divider";


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
    <AppBar position="sticky" elevation={0} className="bg-[#1a73e8]">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="open drawer"
          className="mr-4 md:hidden"
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          className="hidden sm:block font-extrabold cursor-pointer text-white tracking-tight text-xl mr-8"
          onClick={() => navigate("/dashboard")}
        >
          SnippetManager
        </Typography>

        {token && (
          <div className="relative rounded bg-white/15 hover:bg-white/25 mr-4 ml-0 w-full sm:ml-6 sm:w-auto flex items-center">
            <div className="px-4 h-full absolute pointer-events-none flex items-center justify-center">
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search snippets..."
              inputProps={{ "aria-label": "search" }}
              className="text-inherit w-full [&_.MuiInputBase-input]:py-2 [&_.MuiInputBase-input]:pr-2 [&_.MuiInputBase-input]:pl-12 [&_.MuiInputBase-input]:transition-all [&_.MuiInputBase-input]:w-full md:[&_.MuiInputBase-input]:w-[25ch]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <IconButton
              size="small"
              className={`text-white mr-1 ${searchQuery ? 'opacity-100' : 'opacity-50'}`}
              onClick={triggerSearch}
              disabled={!searchQuery}
            >
              <SearchIcon fontSize="small" />
            </IconButton>
          </div>
        )}

        <div className="flex-grow" />

        {token ? (
          <div className="flex items-center gap-2">
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
                <Avatar className="w-8 h-8 bg-secondary">
                  <AccountCircle />
                </Avatar>
              </IconButton>
            </Tooltip>
          </div>
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
            <AccountCircle className="mr-4" /> Profile
          </MenuItem>
          <MenuItem onClick={() => { handleMenuClose(); navigate("/dashboard/settings"); }}>
            <SettingsIcon className="mr-4" /> Settings
          </MenuItem>
          <MenuItem onClick={handleLogout} className="text-red-500">
            <LogoutIcon className="mr-4" /> Logout
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notiAnchorEl}
          open={isNotiOpen}
          onClose={handleNotiClose}
          slotProps={{
            paper: {
              className: "w-[320px] max-h-[400px] mt-4 rounded-xl shadow-lg"
            }
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <div className="p-4 flex justify-between items-center">
            <Typography variant="subtitle1" className="font-bold">Notifications</Typography>
            <Typography variant="caption" color="primary" className="cursor-pointer">Mark all as read</Typography>
          </div>
          <Divider />
          <div className="p-0">
            {[
              { id: 1, text: "New comment on 'Authentication flow'", time: "2m ago" },
              { id: 2, text: "Team 'Frontend' invited you", time: "1h ago" },
              { id: 3, text: "Your snippet 'Passport Config' was forked", time: "3h ago" },
              { id: 4, text: "Welcome to SnippetManager!", time: "1d ago" },
            ].map((noti) => (
              <MenuItem key={noti.id} onClick={handleNotiClose} className="py-4 border-b border-slate-100">
                <div className="flex flex-col">
                  <Typography variant="body2" className="font-medium">{noti.text}</Typography>
                  <Typography variant="caption" color="text.secondary">{noti.time}</Typography>
                </div>
              </MenuItem>
            ))}
          </div>
          <div className="p-2 text-center">
            <Button size="small" fullWidth>View all notifications</Button>
          </div>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
