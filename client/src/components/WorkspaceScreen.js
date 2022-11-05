import { useContext } from "react";
import { useHistory } from "react-router-dom";
import SongCard from "./SongCard.js";
import MUIEditSongModal from "./MUIEditSongModal";
import MUIRemoveSongModal from "./MUIRemoveSongModal";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import { GlobalStoreContext } from "../store/index.js";
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
  const { store } = useContext(GlobalStoreContext);
  store.history = useHistory();

  const handleKeyDown = async (event) => {
    if (event.keyCode === 90 && event.ctrlKey) {
      let res = await store.canUndo();
      if (res) await store.undo();
    }

    if (event.keyCode === 89 && event.ctrlKey) {
      let res = await store.canRedo();
      if (res) await store.redo();
    }
  };

  let modalJSX = "";
  if (store.isEditSongModalOpen()) {
    modalJSX = <MUIEditSongModal />;
  } else if (store.isRemoveSongModalOpen()) {
    modalJSX = <MUIRemoveSongModal />;
  }
  console.log(store);
  return (
    <Box onKeyDown={handleKeyDown} tabIndex="0">
      <List
        id="playlist-cards"
        sx={{ width: "100%", bgcolor: "background.paper" }}
      >
        {store.currentList &&
          store.currentList.songs.map((song, index) => (
            <SongCard
              id={"playlist-song-" + index}
              key={"playlist-song-" + index}
              index={index}
              song={song}
            />
          ))}
      </List>
      {modalJSX}
    </Box>
  );
}

export default WorkspaceScreen;
