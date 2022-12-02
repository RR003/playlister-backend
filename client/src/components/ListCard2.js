import { useContext, useState } from "react";
import { GlobalStoreContext } from "../store";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import TextField from "@mui/material/TextField";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbDownOffAltIcon from "@mui/icons-material/ThumbDownOffAlt";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SongCard2 from "./SongCard2.js";
import List from "@mui/material/List";

/*
    This is a card in our list of top 5 lists. It lets select
    a list for editing and it has controls for changing its 
    name or deleting it.
    
    @author McKilla Gorilla
*/
function ListCard2(props) {
  const { store } = useContext(GlobalStoreContext);
  const [editActive, setEditActive] = useState(false);
  const [text, setText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const { playlist, selected } = props;

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

  function expand() {
    if (!isExpanded) {
      console.log(playlist);
    } else {
      console.log("nothing");
    }
    setIsExpanded(!isExpanded);
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
          <ThumbUpOffAltIcon /> X
        </Grid>
        <Grid item xs={3}>
          <ThumbDownOffAltIcon /> Y
        </Grid>
        {isExpanded && (
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
        )}
        <Grid item xs={6}>
          <p>Published: XX/YY/ZZZZ</p>
        </Grid>
        <Grid item xs={3}>
          <p>Listens: 342</p>
        </Grid>
        <Grid item xs={3}>
          {!isExpanded && <ExpandMoreIcon onClick={expand} />}
          {isExpanded && <ExpandLessIcon onClick={expand} />}
        </Grid>
      </Grid>

      {/*<Box
        sx={{
          display: "grid",
          gridTemplateRows: "repeat(3, 1fr)",
          width: "50%",
        }}
      >
        <Box sx={{ flexGrow: 1, fontSize: "15pt" }}>{playlist.name}</Box>

        <Box sx={{ fontSize: "5pt" }}>By {playlist.ownerEmail}</Box>

        <Box sx={{ flexGrow: 1, fontSize: "5pt" }}>
          Insert Published Date right here
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateRows: "repeat(2, 1fr)",
          width: "40%",
        }}
      >
        <Box sx={{}}>
          X <ThumbUpOffAltIcon />
          Y <ThumbDownOffAltIcon />
        </Box>
        <Box>Listens:</Box>
      </Box>

      <Box>
        {!isExpanded && <ExpandMoreIcon onClick={expand} />}
        {isExpanded && <ExpandLessIcon onClick={expand} />}
    </Box>*/}

      {/*

      */}
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
