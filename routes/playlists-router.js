/*
    This is where we'll route all of the received http requests
    into controller response functions.
    
    @author McKilla Gorilla
*/
const express = require("express");
const PlaylistController = require("../controllers/playlist-controller");
const router = express.Router();
const auth = require("../auth");

router.post("/playlist", PlaylistController.createPlaylist);
router.delete("/playlist/:id", PlaylistController.deletePlaylist);
router.get("/playlist/:id", PlaylistController.getPlaylistById);
router.get(
  "/playlistpairs/:q",

  PlaylistController.getPlaylistPairs
);
router.get("/playlists/:q", PlaylistController.getPlaylists);
router.put("/playlist/:id", PlaylistController.updatePlaylist);

module.exports = router;
