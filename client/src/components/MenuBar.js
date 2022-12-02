import { useContext } from "react";
import AuthContext from "../auth";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TextField from "@mui/material/TextField";

export default function MenuBar() {
  const { auth } = useContext(AuthContext);

  const handleHome = () => {
    auth.goHome();
  };
  const handleAllLists = () => {
    auth.goAllLists();
  };
  const handleUsers = () => {
    auth.goUsers();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <div>
          <HomeIcon onClick={handleHome} />
          <GroupsIcon onClick={handleAllLists} />
          <AccountCircleIcon onClick={handleUsers} />
          <TextField id="outlined-basic" variant="outlined" />
        </div>
      </AppBar>
    </Box>
  );
}
