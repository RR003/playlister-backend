import React, { useContext, useEffect } from "react";
import { GlobalStoreContext } from "../store";
import ListCard from "./ListCard.js";
import ListCard3 from "./ListCard3.js";
import Grid from "@mui/material/Grid";

import List from "@mui/material/List";

const AllPlaylists = () => {
  const { store } = useContext(GlobalStoreContext);

  useEffect(async () => {
    await store.loadIdNamePairs();
  }, []);

  let listCard = "";
  let cardClass = "list-card unselected-list-card";

  async function handleNewPlaylist() {
    await store.createNewList();
  }

  if (store) {
    console.log(store.idNamePairs);
    listCard = (
      <List sx={{ width: "90%", left: "5%", bgcolor: "background.paper" }}>
        {store.idNamePairs.map(
          (playlist) =>
            (!playlist.published && (
              <ListCard
                key={playlist._id}
                playlist={playlist}
                selected={false}
              />
            )) ||
            (playlist.published && (
              <ListCard3
                key={playlist._id}
                playlist={playlist}
                selected={false}
              />
            ))
        )}
        <Grid item xs={12}>
          <div onClick={handleNewPlaylist} className={cardClass}>
            Create New Playlist
          </div>
        </Grid>
      </List>
    );
  }

  return (
    <div>
      <h1>Your Playlists</h1>
      <div id="list-selector-list">{listCard}</div>
    </div>
  );
};

export default AllPlaylists;
