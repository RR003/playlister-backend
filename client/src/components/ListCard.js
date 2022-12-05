import { useContext, useState, useEffect } from "react";
import { GlobalStoreContext } from "../store";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SongCard from "./SongCard.js";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import AddSongButton from "./AddSongButton.js";
import MUIRemoveSongModal from "./MUIRemoveSongModal";
import MUIEditSongModal from "./MUIEditSongModal";
import MUIDeleteModal from "./MUIDeleteModal";

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard(props) {
  const { store } = useContext(GlobalStoreContext);
  const [editActive, setEditActive] = useState(false);
  const [text, setText] = useState("");
  const { playlist, selected } = props;
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(async () => {
    console.log("this is actially changing2");
  }, [store]);

  async function expand() {
    if (!isExpanded) {
      // if expanded
      if (store.currentList === null) {
        setIsExpanded(!isExpanded);
        await store.setCurrentList(playlist._id);
      }
    } else {
      setIsExpanded(!isExpanded);
      await store.closeCurrentList();
    }
  }

  function handleDoubleClick(event) {
    console.log(event.target);
    if (event.detail === 2) {
      console.log("double click");
      setEditActive(true);
      // store.showEditSongModal(index, song);
    }
  }

  function handleLoadList(event, id) {
    console.log("handleLoadList for " + id);
    if (!event.target.disabled) {
      let _id = event.target.id;
      if (_id.indexOf("list-card-text-") >= 0)
        _id = ("" + _id).substring("list-card-text-".length);

      console.log("load " + event.target.id);

      // CHANGE THE CURRENT LIST
      store.setCurrentList(id);
    }
  }

  function handleToggleEdit(event) {
    event.stopPropagation();
    toggleEdit();
  }

  function toggleEdit() {
    setEditActive(false);
  }

  function handleKeyPress(event) {
    if (event.code === "Enter") {
      let id = event.target.id.substring("list-".length);
      store.changeListName(id, text);
      toggleEdit();
    }
  }
  function handleUpdateText(event) {
    setText(event.target.value);
  }

  const handleKeyDown = async (event) => {
    console.log("key downnnnn");
    if (event.keyCode === 90 && event.ctrlKey) {
      let res = await store.canUndo();
      if (res) await store.undo();
    }

    if (event.keyCode === 89 && event.ctrlKey) {
      let res = await store.canRedo();
      if (res) await store.redo();
    }
  };

  let selectClass = "unselected-list-card";
  if (selected) {
    selectClass = "selected-list-card";
  }
  let cardStatus = false;
  if (store.isListNameEditActive) {
    cardStatus = true;
  }
  let modalJSX = "";
  if (store.isRemoveSongModalOpen()) {
    console.log(store.removeSong);
    modalJSX = <MUIRemoveSongModal />;
  } else if (store.isEditSongModalOpen()) {
    console.log("edit song modal is open");
    modalJSX = <MUIEditSongModal />;
  }

  function handleUndo() {
    store.undo();
  }

  function handleRedo() {
    store.redo();
  }

  async function handleDeleteList() {
    store.markListForDeletion(playlist._id);
  }

  async function handlePublish() {
    await store.publishPlaylist();
    expand();
  }

  async function handleDuplicate() {
    store.duplicateOwnList(playlist);
    expand();
  }

  let cardElement = (
    <ListItem
      id={playlist._id}
      key={playlist._id}
      sx={{ display: "flex", p: 1 }}
      style={{
        width: "100%",
        border: "1px solid",
        borderRadius: "5px",
        marginBottom: "20px",
      }}
      button
    >
      <Grid
        container
        onClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
        tabIndex="0"
      >
        <Grid item xs={6}>
          {!editActive && <h2>{playlist.name}</h2>}
          {editActive && (
            <TextField
              margin="normal"
              required
              fullWidth
              id={"list-" + playlist._id}
              label="Playlist Name"
              name="name"
              autoComplete="Playlist Name"
              className="list-card"
              onKeyPress={handleKeyPress}
              onChange={handleUpdateText}
              defaultValue={playlist.name}
              inputProps={{ style: { fontSize: 30 } }}
              InputLabelProps={{ style: { fontSize: 24 } }}
              autoFocus
            />
          )}
          <p>By {playlist.ownerName}</p>
        </Grid>
        <Grid item xs={6} />

        {isExpanded && (
          <Grid container onClick={handleDoubleClick}>
            <Grid item xs={12}>
              <Box tabIndex="0" sx={{ maxHeight: "300px", overflow: "scroll" }}>
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
              </Box>
            </Grid>
            <Grid item xs={12}>
              <AddSongButton />
            </Grid>
            <Grid item xs={2}>
              <Button onClick={handleUndo}>Undo</Button>
            </Grid>
            <Grid item xs={2}>
              <Button onClick={handleRedo}>Redo</Button>
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={2}>
              <Button onClick={handlePublish}>Publish</Button>
            </Grid>
            <Grid item xs={2}>
              <Button onClick={handleDeleteList}>Delete</Button>
            </Grid>
            <Grid item xs={2}>
              <Button onClick={handleDuplicate}>Duplicate</Button>
            </Grid>
          </Grid>
        )}
        <Grid item xs={9}></Grid>
        <Grid item xs={3}>
          {!isExpanded && <ExpandMoreIcon onClick={expand} />}
          {isExpanded && <ExpandLessIcon onClick={expand} />}
        </Grid>
      </Grid>
      {modalJSX}
      <MUIDeleteModal />
    </ListItem>
  );

  return cardElement;
}

export default ListCard;
