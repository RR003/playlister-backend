import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../auth";
import { GlobalStoreContext } from "../store";
import logo from "../Playlister.png";

import EditToolbar from "./EditToolbar";

import AccountCircle from "@mui/icons-material/AccountCircle";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export default function AppBanner() {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    console.log(event.currentTarget);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    auth.logoutUser();
    handleMenuClose();
  };

  const menuId = "primary-search-account-menu";
  const loggedOutMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    ></Menu>
  );
  const loggedInMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  let editToolbar = "";
  let menu = loggedOutMenu;
  if (auth.loggedIn) {
    menu = loggedInMenu;
    /*if (store.currentList) {
      editToolbar = <EditToolbar />;
    }*/
  }

  function getAccountMenu(loggedIn) {
    let userInitials = auth.getUserInitials();
    if (loggedIn) return userInitials;
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" style={{ background: "#2E3B55" }}>
        <Toolbar>
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <Link style={{ textDecoration: "none", color: "white" }} to="/">
              <img src={logo} style={{ height: "12%", width: "12%" }}></img>
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 1 }}>{editToolbar}</Box>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {getAccountMenu(auth.loggedIn)}
            </IconButton>
          </Box>
          {/*auth.loggedIn && <MenuItem onClick={handleLogout}>Logout</MenuItem>*/}
        </Toolbar>
      </AppBar>
      {menu}
    </Box>
  );
}
