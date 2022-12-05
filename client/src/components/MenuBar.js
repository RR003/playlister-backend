import { useContext, useState } from "react";
import AuthContext from "../auth";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { GlobalStoreContext } from "../store";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import TextField from "@mui/material/TextField";
import SortIcon from "@mui/icons-material/Sort";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FormControl, InputLabel, Select, Grid } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

export default function MenuBar() {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  const [menu, setMenu] = useState(0);
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");

  const handleHome = () => {
    auth.goHome();
    setSort("");
    store.updateQueries(-1, "");
    setMenu(0);
    setSearch("");
  };
  const handleAllLists = () => {
    auth.goAllLists();
    setSort("");
    store.updateQueries(-1, "");
    setMenu(1);
    setSearch("");
  };
  const handleUsers = () => {
    auth.goAllLists();
    setSort("");
    store.updateQueries(-1, "");
    setMenu(2);
    setSearch("");
  };

  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      let arr = [
        "Name (A-Z)",
        "Publish Date (Newest)",
        "Listens (High - Low)",
        "Likes (High - Low)",
        "Dislikes (High - Low)",
      ];
      let index = arr.indexOf(sort);
      console.log(e.target.value);
      setSearch(e.target.value);
      store.updateQueries(index, e.target.value).then((event) => {
        // console.log(menu);
        store.loadIdNamePairs2(index, e.target.value);
      });
    }
  };

  const handleChange = async (event) => {
    setSort(event.target.value);
    let arr = [
      "Name (A-Z)",
      "Publish Date (Newest)",
      "Listens (High - Low)",
      "Likes (High - Low)",
      "Dislikes (High - Low)",
    ];
    let index = arr.indexOf(event.target.value);
    store.updateQueries(index, search).then((e) => {
      console.log(menu);
      store.loadIdNamePairs2(index, search);
    });

    //await store.loadIdNamePairs();
    //store.sortAllPlaylists(arr.indexOf(event.target.value));
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Grid container>
          <Grid xs={0.5}>
            <HomeIcon onClick={handleHome} />
          </Grid>
          <Grid xs={0.5}>
            <GroupsIcon onClick={handleAllLists} />
          </Grid>
          <Grid xs={2.5}>
            <AccountCircleIcon onClick={handleUsers} />
          </Grid>
          <Grid xs={6}>
            <TextField
              id="search-bar"
              className="text"
              label="Enter a city name"
              variant="outlined"
              placeholder="Search..."
              size="small"
              onKeyDown={handleSearch}
            />
            <IconButton type="submit" aria-label="search">
              <SearchIcon style={{ fill: "blue" }} />
            </IconButton>
          </Grid>
          <Grid>
            <FormControl>
              <InputLabel>Sort by</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Sort by"
                value={sort}
                onChange={handleChange}
              >
                <MenuItem value="Name (A-Z)" id={0}>
                  Name (A-Z)
                </MenuItem>
                <MenuItem value="Publish Date (Newest)" id={1}>
                  Publish Date (Newest)
                </MenuItem>
                <MenuItem value="Listens (High - Low)" id={2}>
                  Listens (High - Low)
                </MenuItem>
                <MenuItem value="Likes (High - Low)" id={3}>
                  Likes (High - Low)
                </MenuItem>
                <MenuItem value="Dislikes (High - Low)" id={4}>
                  Dislikes (High - Low)
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </AppBar>
    </Box>
  );
}
