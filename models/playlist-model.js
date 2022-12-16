const mongoose = require("mongoose");
const Schema = mongoose.Schema;
/*
    This is where we specify the format of the data we're going to put into
    the database.
    
    @author McKilla Gorilla
*/
const playlistSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    songs: {
      type: [
        {
          title: String,
          artist: String,
          youTubeId: String,
        },
      ],
      required: true,
    },
    ownerName: { type: String, required: true },
    published: { type: Boolean, required: true },
    publishedDate: { type: Date, required: false },
    likes: [{ type: String }],
    dislikes: [{ type: String }],
    likesCount: { type: Number },
    dislikesCount: { type: Number },
    listens: { type: Number },
    comments: {
      type: [
        {
          name: String,
          comment: String,
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Playlist", playlistSchema);
