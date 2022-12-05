import { useContext, useState, useEffect } from "react";
import { GlobalStoreContext } from "../store";
import AuthContext from "../auth";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SongCard2 from "./SongCard2.js";
import List from "@mui/material/List";
import Button from "@mui/material/Button";

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard2(props) {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const [editActive, setEditActive] = useState(false);
  const [text, setText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const { playlist, selected } = props;
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  useEffect(() => {
    console.log(auth);
    console.log(store);
    if (auth.user !== null) {
      let index = playlist.likes.indexOf(auth.user.email);
      if (index > -1) {
        setLiked(true);
      }

      index = playlist.dislikes.indexOf(auth.user.email);
      if (index > -1) {
        setDisliked(true);
      }
    }
  });

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
    let newActive = !editActive;
    if (newActive) {
      store.setIsListNameEditActive();
    }
    setEditActive(newActive);
  }

  async function handleDeleteList(event, id) {
    event.stopPropagation();
    let _id = event.target.id;
    _id = ("" + _id).substring("delete-list-".length);
    store.markListForDeletion(id);
  }

  async function handleLike() {
    if (auth.user === null) return;
    if (!disliked) {
      await store.likePlaylist(playlist._id, 1);
      setLiked(true);
    }
  }

  async function handleUnLike() {
    if (auth.user === null) return;
    await store.dislikePlaylist(playlist._id, 1);
    setLiked(false);
  }

  async function handleDislike() {
    if (auth.user === null) return;
    if (!liked) {
      await store.likePlaylist(playlist._id, 2);
      setDisliked(true);
    }
  }

  async function handleUnDislike() {
    if (auth.user === null) return;
    await store.dislikePlaylist(playlist._id, 2);
    setDisliked(false);
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

  async function expand() {
    if (!isExpanded) {
      if (store.currentList === null) {
        setIsExpanded(!isExpanded);
        await store.setCurrentList(playlist._id);
      }
    } else {
      setIsExpanded(!isExpanded);
      await store.closeCurrentList();
    }
  }

  async function handleDuplicate() {
    store.duplicateOwnList(playlist);
    expand();
  }

  let selectClass = "unselected-list-card";
  if (selected) {
    selectClass = "selected-list-card";
  }
  let cardStatus = false;
  if (store.isListNameEditActive) {
    cardStatus = true;
  }
  let cardElement = (
    <ListItem
      id={playlist._id}
      key={playlist._id}
      sx={{ display: "flex", p: 1 }}
      style={{
        width: "100%",
        fontSize: "25xpt",
        border: "1px solid",
        borderRadius: "5px",
        marginBottom: "20px",
      }}
      button
      /*onClick={(event) => {
        handleLoadList(event, playlist._id);
      }}*/
    >
      <Grid container>
        <Grid item xs={6}>
          <h2>{playlist.name}</h2>
          <p>By {playlist.ownerName}</p>
        </Grid>
        <Grid item xs={3}>
          {!liked && <ThumbUpOffAltIcon onClick={handleLike} />}
          {liked && <ThumbUpIcon onClick={handleUnLike} />}
          {playlist.likes.length}
        </Grid>
        <Grid item xs={3}>
          {!disliked && <ThumbDownOffAltIcon onClick={handleDislike} />}
          {disliked && <ThumbDownIcon onClick={handleUnDislike} />}
          {playlist.dislikes.length}
        </Grid>
        {isExpanded && (
          <Grid container>
            <Grid item xs={12}>
              <Box tabIndex="0" sx={{ maxHeight: "300px", overflow: "scroll" }}>
                <List
                  id="playlist-cards"
                  sx={{ width: "100%", bgcolor: "background.paper" }}
                >
                  {playlist &&
                    playlist.songs.map((song, index) => (
                      <SongCard2
                        id={"playlist-song-" + index}
                        key={"playlist-song-" + index}
                        index={index}
                        song={song}
                      />
                    ))}
                </List>
              </Box>
            </Grid>
            {auth.user !== null && (
              <Button onClick={handleDuplicate}>Duplicate</Button>
            )}
          </Grid>
        )}
        <Grid item xs={6}>
          <p>Published: {playlist.publishedDate.substring(0, 10)}</p>
        </Grid>
        <Grid item xs={3}>
          <p>Listens: 342</p>
        </Grid>
        <Grid item xs={3}>
          {!isExpanded && <ExpandMoreIcon onClick={expand} />}
          {isExpanded && <ExpandLessIcon onClick={expand} />}
        </Grid>
      </Grid>
    </ListItem>
  );

  if (editActive) {
    cardElement = (
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
        inputProps={{ style: { fontSize: 48 } }}
        InputLabelProps={{ style: { fontSize: 24 } }}
        autoFocus
      />
    );
  }
  return cardElement;
}

export default ListCard2;
