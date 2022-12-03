import React, { useContext, useEffect } from "react";
import { GlobalStoreContext } from "../store";
import ListCard2 from "./ListCard2.js";

import List from "@mui/material/List";

const AllPlaylists = () => {
  useEffect(async () => {
    await store.loadIdNamePairs();
  }, []);
  const { store } = useContext(GlobalStoreContext);

  let listCard = "";

  if (store) {
    listCard = (
      <List sx={{ width: "90%", left: "5%", bgcolor: "background.paper" }}>
        {store.allPlaylists.map((playlist) => (
          <ListCard2 key={playlist._id} playlist={playlist} selected={false} />
        ))}
      </List>
    );
  }

  return (
    <div>
      <h1>All Of the Playlists</h1>
      <div id="list-selector-list">{listCard}</div>
    </div>
  );
};

export default AllPlaylists;
