const Playlist = require("../models/playlist-model");
const User = require("../models/user-model");
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/

createPlaylist = (req, res) => {
  const body = req.body;
  console.log("createPlaylist body: " + JSON.stringify(body));

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a Playlist",
    });
  }

  const playlist = new Playlist(body);
  console.log("playlist: " + playlist.toString());
  if (!playlist) {
    return res.status(400).json({ success: false, error: err });
  }

  User.findOne({ _id: req.userId }, (err, user) => {
    // console.log("user found: " + JSON.stringify(user));
    user.playlists.push(playlist._id);
    user.save().then(() => {
      playlist
        .save()
        .then(() => {
          return res.status(201).json({
            playlist: playlist,
          });
        })
        .catch((error) => {
          console.log(error);
          return res.status(400).json({
            errorMessage: "Playlist Not Created!",
          });
        });
    });
  });
};
deletePlaylist = async (req, res) => {
  console.log("delete Playlist with id: " + JSON.stringify(req.params.id));
  console.log("delete " + req.params.id);
  Playlist.findById({ _id: req.params.id }, (err, playlist) => {
    console.log("playlist found: " + JSON.stringify(playlist));
    if (err) {
      return res.status(404).json({
        errorMessage: "Playlist not found!",
      });
    }

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(list) {
      User.findOne({ email: list.ownerEmail }, (err, user) => {
        console.log("user._id: " + user._id);
        console.log("req.userId: " + req.userId);
        if (user._id == req.userId) {
          console.log("correct user!");
          Playlist.findOneAndDelete({ _id: req.params.id }, () => {
            return res.status(200).json({});
          }).catch((err) => console.log(err));
        } else {
          console.log("incorrect user!");
          return res.status(400).json({
            errorMessage: "authentication error",
          });
        }
      });
    }
    asyncFindUser(playlist);
  });
};
getPlaylistById = async (req, res) => {
  console.log("Find Playlist with id: " + JSON.stringify(req.params.id));

  await Playlist.findById({ _id: req.params.id }, (err, list) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    console.log("Found list: " + JSON.stringify(list));

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(list) {
      await User.findOne({ email: list.ownerEmail }, (err, user) => {
        console.log("user._id: " + user._id);
        console.log("req.userId: " + req.userId);
        if (user._id !== 3) {
          console.log("correct user!");
          return res.status(200).json({ success: true, playlist: list });
        } else {
          console.log("incorrect user!");
          return res
            .status(400)
            .json({ success: false, description: "authentication error" });
        }
      });
    }
    asyncFindUser(list);
  }).catch((err) => console.log(err));
};

getPlaylistPairs = async (req, res) => {
  await User.findOne({ _id: req.userId }, (err, user) => {
    // console.log("find user with id " + req.userId);
    async function asyncFindList(email) {
      // console.log("find all Playlists owned by " + email);
      let sortParam = [
        { name: 1 },
        { publishedDate: -1 },
        { listens: -1 },
        { likesCount: -1 },
        { dislikesCount: -1 },
      ];
      let q = req.params.q;
      let searchParam = req.query.search;
      console.log("getting user playlists");
      console.log(searchParam, q);
      if (searchParam === undefined) {
        searchParam = "";
      }
      let regexp = new RegExp(searchParam);
      if (q === -1) {
        await Playlist.find(
          { ownerEmail: email, name: regexp },
          (err, playlists) => {
            if (err) {
              return res.status(400).json({ success: false, error: err });
            }
            if (!playlists) {
              console.log("!playlists.length");
              return res
                .status(404)
                .json({ success: false, error: "Playlists not found" });
            } else {
              console.log("Send the Playlist pairs");
              // PUT ALL THE LISTS INTO ID, NAME PAIRS
              return res
                .status(200)
                .json({ success: true, idNamePairs: playlists });
            }
          }
        ).catch((err) => console.log(err));
      } else {
        let playlists = await Playlist.find({
          ownerEmail: email,
          name: regexp,
        }).sort(sortParam[q]);
        if (!playlists) {
          console.log("!playlists.length");
          return res
            .status(404)
            .json({ success: false, error: "Playlists not found" });
        } else {
          console.log("Send the Playlist pairs");
          // PUT ALL THE LISTS INTO ID, NAME PAIRS
          return res
            .status(200)
            .json({ success: true, idNamePairs: playlists });
        }
      }
    }
    asyncFindList(user.email);
  }).catch((err) => console.log(err));
};

getPlaylists = async (req, res) => {
  let sortParam = [
    { name: 1 },
    { publishedDate: -1 },
    { listens: -1 },
    { likesCount: -1 },
    { dislikesCount: -1 },
  ];
  let q = req.params.q;
  // let type = req.query.type;
  let searchParam = req.query.search;
  let typeParam = req.query.type;

  if (searchParam === undefined) {
    searchParam = "";
  }

  if (typeParam === "false") {
    let regexp = new RegExp(searchParam);
    if (q == -1) {
      await Playlist.find(
        { published: true, name: regexp },
        (err, playlists) => {
          console.log("PLAYLISTS = ", playlists);
          if (err) {
            return res.status(400).json({ success: false, error: err });
          }

          return res.status(200).json({ success: true, data: playlists });
        }
      ).catch((err) => {
        console.log(err);
      });
    } else {
      let playlists = await Playlist.find({
        published: true,
        name: regexp,
      }).sort(sortParam[q]);
      console.log("PLAYLISTS = ", playlists);
      return res.status(200).json({ success: true, data: playlists });
    }
  } else {
    let regexp = new RegExp(searchParam);
    if (q == -1) {
      await Playlist.find(
        { published: true, ownerName: regexp },
        (err, playlists) => {
          console.log("PLAYLISTS = ", playlists);
          if (err) {
            return res.status(400).json({ success: false, error: err });
          }

          return res.status(200).json({ success: true, data: playlists });
        }
      ).catch((err) => {
        console.log(err);
      });
    } else {
      let playlists = await Playlist.find({
        published: true,
        ownerName: regexp,
      }).sort(sortParam[q]);
      console.log("PLAYLISTS = ", playlists);
      return res.status(200).json({ success: true, data: playlists });
    }
  }
};

updatePlaylist = async (req, res) => {
  const body = req.body;
  // console.log("updatePlaylist: " + JSON.stringify(body));
  // console.log("req.body.name: " + req.body.name);

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a body to update",
    });
  }

  Playlist.findOne({ _id: req.params.id }, (err, playlist) => {
    console.log("playlist found: " + JSON.stringify(playlist));
    if (err) {
      return res.status(404).json({
        err,
        message: "Playlist not found!",
      });
    }

    // DOES THIS LIST BELONG TO THIS USER?
    async function asyncFindUser(list) {
      await User.findOne({ email: list.ownerEmail }, (err, user) => {
        console.log("user._id: " + user._id);
        console.log("req.userId: " + req.userId);
        if (user._id !== 0) {
          console.log("correct user!");
          console.log("req.body.name: ", req.body);

          list.name = body.playlist.name;
          list.songs = body.playlist.songs;
          list.published = body.playlist.published;
          list.publishedDate = body.playlist.publishedDate;
          list.likes = body.playlist.likes;
          list.dislikes = body.playlist.dislikes;
          list.likesCount = body.playlist.likes.length;
          list.dislikesCount = body.playlist.dislikes.length;
          list.listens = body.playlist.listens;
          list.comments = body.playlist.comments;

          list
            .save()
            .then(() => {
              console.log("SUCCESS!!!");
              return res.status(200).json({
                success: true,
                id: list._id,
                message: "Playlist updated!",
              });
            })
            .catch((error) => {
              console.log("FAILURE: " + JSON.stringify(error));
              return res.status(404).json({
                error,
                message: "Playlist not updated!",
              });
            });
        } else {
          console.log("incorrect user!");
          return res
            .status(400)
            .json({ success: false, description: "authentication error" });
        }
      });
    }
    asyncFindUser(playlist);
  });
};

module.exports = {
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getPlaylistPairs,
  getPlaylists,
  updatePlaylist,
};
