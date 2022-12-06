import React, { useContext, useEffect, useState } from "react";
import { GlobalStoreContext } from "../store";
import AuthContext from "../auth";
import ListCard from "./ListCard.js";
import MUIDeleteModal from "./MUIDeleteModal";
import MenuBar from "./MenuBar";
import AllPlaylists from "./AllPlaylists";
import UserPlaylists from "./UserPlaylists";
import YouTubePlayer from "./YouTubePlayer";
import Comments from "./Comments";

import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import List from "@mui/material/List";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const [player, setPlayer] = useState(true);

  useEffect(async () => {
    await store.loadIdNamePairs();
    //console.log("this is actially changing");
  }, [auth]);

  function handlePlayerSet() {
    setPlayer(!player);
  }

  function handleCreateNewList() {
    store.createNewList();
  }
  let listCard = "";
  if (store) {
    listCard = (
      <List sx={{ width: "90%", left: "5%", bgcolor: "background.paper" }}>
        {store.idNamePairs.map((playlist) => (
          <ListCard key={playlist._id} playlist={playlist} selected={false} />
        ))}
      </List>
    );
  }
  console.log(auth);
  return (
    <div id="playlist-selector">
      <MenuBar />
      <div className="all">
        <div className="left">
          {auth.allLists && <AllPlaylists />}
          {auth.home && <UserPlaylists />}
        </div>
        {store.currentList && (
          <div className="right">
            <Grid container>
              {player && (
                <div>
                  <Button>Player</Button>
                  <Button variant="contained" onClick={handlePlayerSet}>
                    Comment
                  </Button>
                </div>
              )}
              {!player && (
                <div>
                  <Button variant="contained" onClick={handlePlayerSet}>
                    Player
                  </Button>
                  <Button>Comments</Button>
                </div>
              )}
            </Grid>
            {player && <YouTubePlayer />}
            {!player && <Comments />}
          </div>
        )}
      </div>

      {/*<div id="list-selector-heading">
        <Fab
          color="primary"
          aria-label="add"
          id="add-list-button"
          onClick={handleCreateNewList}
        >
          <AddIcon />
        </Fab>

        <Typography variant="h2">Your Lists</Typography>
      </div>
      <div id="list-selector-list">
        {listCard}
        <MUIDeleteModal />
  </div>*/}
    </div>
  );
};

export default HomeScreen;
