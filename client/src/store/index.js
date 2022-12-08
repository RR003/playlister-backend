import { createContext, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import jsTPS from "../common/jsTPS";
import api from "./store-request-api";
import CreateSong_Transaction from "../transactions/CreateSong_Transaction";
import MoveSong_Transaction from "../transactions/MoveSong_Transaction";
import RemoveSong_Transaction from "../transactions/RemoveSong_Transaction";
import UpdateSong_Transaction from "../transactions/UpdateSong_Transaction";
import AuthContext from "../auth";
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THIS IS THE CONTEXT WE'LL USE TO SHARE OUR STORE
export const GlobalStoreContext = createContext({});
console.log("create GlobalStoreContext");

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
  CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
  CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
  CREATE_NEW_LIST: "CREATE_NEW_LIST",
  LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
  LOAD_ID_NAME_PAIRS2: "LOAD_ID_NAME_PAIRS2",
  MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
  UNMARK_LIST_FOR_DELETION: "UNMARK_LIST_FOR_DELETEION",
  SET_CURRENT_LIST: "SET_CURRENT_LIST",
  SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
  EDIT_SONG: "EDIT_SONG",
  REMOVE_SONG: "REMOVE_SONG",
  HIDE_MODALS: "HIDE_MODALS",
  LOAD_ALL_PLAYLISTS: "LOAD_ALL_PLAYLISTS",
  PUBLISH_LIST: "PUBLISH_LIST",
  LIKE: "LIKE",
  UPDATE_QUERIES: "UPDATE_QUERIES",
  UPDATE_PLAY_SONG: "UPDATE_PLAY_SONG",
};

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

const CurrentModal = {
  NONE: "NONE",
  DELETE_LIST: "DELETE_LIST",
  EDIT_SONG: "EDIT_SONG",
  REMOVE_SONG: "REMOVE_SONG",
  PLAYLIST_EXISTS: "PLAYLIST_EXISTS",
};

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
function GlobalStoreContextProvider(props) {
  // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
  const [store, setStore] = useState({
    currentModal: CurrentModal.NONE,
    idNamePairs: [],
    allPlaylists: [],
    currentList: null,
    currentSongIndex: -1,
    currentSong: null,
    newListCounter: 0,
    listNameActive: false,
    listIdMarkedForDeletion: null,
    listMarkedForDeletion: null,
    deleteSong: null,
    deleteSongIndex: -1,
    sortQuery: -1,
    searchQuery: "",
    currentPlayIndex: null,
  });
  const history = useHistory();

  console.log("inside useGlobalStore");

  // SINCE WE'VE WRAPPED THE STORE IN THE AUTH CONTEXT WE CAN ACCESS THE USER HERE
  const { auth } = useContext(AuthContext);
  console.log("auth: " + auth);

  // HERE'S THE DATA STORE'S REDUCER, IT MUST
  // HANDLE EVERY TYPE OF STATE CHANGE
  const storeReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      // LIST UPDATE OF ITS NAME
      case GlobalStoreActionType.CHANGE_LIST_NAME: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: payload.idNamePairs,
          allPlaylists: store.allPlaylists,
          currentList: store.currentList,
          currentSongIndex: -1,
          currentSong: null,
          deleteSongIndex: -1,
          deleteSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          sortQuery: store.sortQuery,
          searchQuery: store.searchQuery,
          currentPlayIndex: store.currentPlayIndex,
        });
      }
      // STOP EDITING THE CURRENT LIST
      case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          allPlaylists: store.allPlaylists,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          deleteSongIndex: -1,
          deleteSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          sortQuery: store.sortQuery,
          searchQuery: store.searchQuery,
          currentPlayIndex: -1,
        });
      }
      // CREATE A NEW LIST
      case GlobalStoreActionType.CREATE_NEW_LIST: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          allPlaylists: store.allPlaylists,
          currentList: store.currentList,
          currentSongIndex: -1,
          currentSong: null,
          deleteSongIndex: -1,
          deleteSong: null,
          newListCounter: store.newListCounter + 1,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          sortQuery: store.sortQuery,
          searchQuery: store.searchQuery,
          currentPlayIndex: store.currentPlayIndex,
        });
      }
      case GlobalStoreActionType.PUBLISH_LIST: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: payload.idNamePairs,
          allPlaylists: store.allPlaylists,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          deleteSongIndex: -1,
          deleteSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          sortQuery: store.sortQuery,
          searchQuery: store.searchQuery,
          currentPlayIndex: store.currentPlayIndex,
        });
      }
      // GET ALL THE LISTS SO WE CAN PRESENT THEM
      case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: payload.idNamePairs,
          allPlaylists: payload.allPlaylists,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          deleteSongIndex: -1,
          deleteSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          sortQuery: payload.sortQuery,
          searchQuery: store.searchQuery,
          currentPlayIndex: store.currentPlayIndex,
        });
      }

      case GlobalStoreActionType.LOAD_ID_NAME_PAIRS2: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: payload.idNamePairs,
          allPlaylists: payload.allPlaylists,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          deleteSongIndex: -1,
          deleteSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          sortQuery: payload.sortQuery,
          searchQuery: payload.searchQuery,
          currentPlayIndex: store.currentPlayIndex,
        });
      }

      case GlobalStoreActionType.LOAD_ALL_PLAYLISTS: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          allPlaylists: payload,
          currentList: null,
          currentSongIndex: -1,
          currentSong: null,
          deleteSongIndex: -1,
          deleteSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          sortQuery: store.sortQuery,
          searchQuery: store.searchQuery,
          currentPlayIndex: store.currentPlayIndex,
        });
      }
      // PREPARE TO DELETE A LIST
      case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
        return setStore({
          currentModal: CurrentModal.DELETE_LIST,
          idNamePairs: store.idNamePairs,
          allPlaylists: store.allPlaylists,
          currentList: store.currentList,
          currentSongIndex: -1,
          currentSong: null,
          deleteSongIndex: -1,
          deleteSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: payload.id,
          listMarkedForDeletion: payload.playlist,
          sortQuery: store.sortQuery,
          searchQuery: store.searchQuery,
          currentPlayIndex: store.currentPlayIndex,
        });
      }
      case GlobalStoreActionType.UNMARK_LIST_FOR_DELETION: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          allPlaylists: store.allPlaylists,
          currentList: store.currentList,
          currentSongIndex: -1,
          currentSong: null,
          deleteSongIndex: -1,
          deleteSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          sortQuery: store.sortQuery,
          searchQuery: store.searchQuery,
          currentPlayIndex: store.currentPlayIndex,
        });
      }
      // UPDATE A LIST
      case GlobalStoreActionType.SET_CURRENT_LIST: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          allPlaylists: store.allPlaylists,
          currentList: payload,
          currentSongIndex: -1,
          currentSong: null,
          deleteSongIndex: -1,
          deleteSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          sortQuery: store.sortQuery,
          searchQuery: store.searchQuery,
          currentPlayIndex: 0,
        });
      }
      // START EDITING A LIST NAME
      case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          allPlaylists: store.allPlaylists,
          currentList: payload,
          currentSongIndex: -1,
          currentSong: null,
          deleteSongIndex: -1,
          deleteSong: null,
          newListCounter: store.newListCounter,
          listNameActive: true,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          sortQuery: store.sortQuery,
          searchQuery: store.searchQuery,
          currentPlayIndex: store.currentPlayIndex,
        });
      }
      //
      case GlobalStoreActionType.EDIT_SONG: {
        return setStore({
          currentModal: CurrentModal.EDIT_SONG,
          idNamePairs: store.idNamePairs,
          allPlaylists: store.allPlaylists,
          currentList: store.currentList,
          currentSongIndex: payload.currentSongIndex,
          currentSong: payload.currentSong,
          deleteSongIndex: -1,
          deleteSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          sortQuery: store.sortQuery,
          searchQuery: store.searchQuery,
          currentPlayIndex: store.currentPlayIndex,
        });
      }

      case GlobalStoreActionType.SHOW_NAME_EXISTS: {
        return setStore({
          currentModal: CurrentModal.PLAYLIST_EXISTS,
          idNamePairs: store.idNamePairs,
          allPlaylists: store.allPlaylists,
          currentList: store.currentList,
          currentSongIndex: store.currentSongIndex,
          currentSong: store.currentSong,
          deleteSongIndex: -1,
          deleteSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          sortQuery: store.sortQuery,
          searchQuery: store.searchQuery,
          currentPlayIndex: store.currentPlayIndex,
        });
      }
      case GlobalStoreActionType.LIKE: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          allPlaylists: store.allPlaylists,
          currentList: store.currentList,
          currentSongIndex: store.currentSongIndex,
          currentSong: store.currentSong,
          deleteSongIndex: -1,
          deleteSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          sortQuery: store.sortQuery,
          searchQuery: store.searchQuery,
          currentPlayIndex: store.currentPlayIndex,
        });
      }
      case GlobalStoreActionType.REMOVE_SONG: {
        return setStore({
          currentModal: CurrentModal.REMOVE_SONG,
          idNamePairs: store.idNamePairs,
          allPlaylists: payload,
          currentList: store.currentList,
          currentSongIndex: -1,
          currentSong: null,
          deleteSongIndex: payload.deleteSongIndex,
          deleteSong: payload.deleteSong,
          newListCounter: null,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          sortQuery: store.sortQuery,
          searchQuery: store.searchQuery,
          currentPlayIndex: store.currentPlayIndex,
        });
      }
      case GlobalStoreActionType.HIDE_MODALS: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          allPlaylists: store.allPlaylists,
          currentList: store.currentList,
          currentSongIndex: -1,
          currentSong: null,
          deleteSongIndex: -1,
          deleteSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          sortQuery: store.sortQuery,
          searchQuery: store.searchQuery,
          currentPlayIndex: store.currentPlayIndex,
        });
      }
      case GlobalStoreActionType.UPDATE_QUERIES: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          allPlaylists: store.allPlaylists,
          currentList: store.currentList,
          currentSongIndex: -1,
          currentSong: null,
          deleteSongIndex: -1,
          deleteSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          sortQuery: payload.sort,
          searchQuery: payload.search,
          currentPlayIndex: store.currentPlayIndex,
        });
      }
      case GlobalStoreActionType.UPDATE_PLAY_SONG: {
        return setStore({
          currentModal: CurrentModal.NONE,
          idNamePairs: store.idNamePairs,
          allPlaylists: store.allPlaylists,
          currentList: store.currentList,
          currentSongIndex: -1,
          currentSong: null,
          deleteSongIndex: -1,
          deleteSong: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
          listIdMarkedForDeletion: null,
          listMarkedForDeletion: null,
          sortQuery: store.sort,
          searchQuery: store.search,
          currentPlayIndex: payload,
        });
      }
      default:
        return store;
    }
  };

  store.updatePlaySong = async function (index) {
    storeReducer({
      type: GlobalStoreActionType.UPDATE_PLAY_SONG,
      payload: index,
    });
  };

  store.updateQueries = async function (query1, query2) {
    storeReducer({
      type: GlobalStoreActionType.UPDATE_QUERIES,
      payload: {
        sort: query1,
        search: query2,
      },
    });
  };

  // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
  // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN
  // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

  // THIS FUNCTION PROCESSES CHANGING A LIST NAME
  store.changeListName = function (id, newName) {
    for (let i = 0; i < store.idNamePairs.length; i++) {
      let string = store.idNamePairs[i].name; // untitled
      if (string === newName) {
        storeReducer({
          type: GlobalStoreActionType.SHOW_NAME_EXISTS,
        });
        return false;
      }
    }
    async function asyncChangeListName(id) {
      let response = await api.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;
        playlist.name = newName;
        async function updateList(playlist) {
          response = await api.updatePlaylistById(playlist._id, playlist);
          if (response.data.success) {
            async function getListPairs(playlist) {
              response = await api.getPlaylistPairs();
              if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                  type: GlobalStoreActionType.CHANGE_LIST_NAME,
                  payload: {
                    idNamePairs: pairsArray,
                    playlist: playlist,
                  },
                });
              }
            }
            getListPairs(playlist);
          }
        }
        updateList(playlist);
      }
    }
    asyncChangeListName(id);
  };

  store.publishPlaylist = function () {
    async function publishPlaylist2() {
      store.currentList.published = true;
      store.currentList.publishedDate = new Date();
      store.currentList.likes = [];
      store.currentList.dislikes = [];

      async function updateList() {
        let response = await api.updatePlaylistById(
          store.currentList._id,
          store.currentList
        );
        if (response.data.success) {
          async function getListPairs() {
            response = await api.getPlaylistPairs();
            if (response.data.success) {
              let pairsArray = response.data.idNamePairs;
              storeReducer({
                type: GlobalStoreActionType.PUBLISH_LIST,
                payload: {
                  idNamePairs: pairsArray,
                  playlist: store.currentList,
                },
              });
            }
          }
          getListPairs();
        }
      }
      updateList();
    }
    publishPlaylist2();
  };

  // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
  store.closeCurrentList = async function () {
    storeReducer({
      type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
      payload: {},
    });
    tps.clearAllTransactions();
  };

  // THIS FUNCTION CREATES A NEW LIST
  store.createNewList = async function () {
    let counter = 0;
    for (let i = 0; i < store.idNamePairs.length; i++) {
      let string = store.idNamePairs[i].name; // untitled
      if (string.substring(0, 8) === "Untitled") {
        let a = parseInt(string.substring(9));
        counter = Math.max(counter, a + 1);
      }
    }

    let newListName = "Untitled " + counter;
    const response = await api.createPlaylist(
      newListName,
      [],
      auth.user.email,
      auth.user.username
    );
    if (response.status === 201) {
      tps.clearAllTransactions();
      let newList = response.data.playlist;
      storeReducer({
        type: GlobalStoreActionType.CREATE_NEW_LIST,
        payload: newList,
      });
      await store.loadIdNamePairs();
      // IF IT'S A VALID LIST THEN LET'S START EDITING IT
      // history.push("/playlist/" + newList._id);
    } else {
      console.log("API FAILED TO CREATE A NEW LIST");
    }
  };

  store.duplicateOwnList = async function (playlist) {
    let counter = 2;
    let isInOrigList = false;
    for (let i = 0; i < store.idNamePairs.length; i++) {
      let string = store.idNamePairs[i].name;
      if (string === playlist.name) {
        isInOrigList = true;
        break;
      }
    }
    if (isInOrigList) {
      while (true) {
        let temp = playlist.name + " " + counter;
        let found = false;
        for (let i = 0; i < store.idNamePairs.length; i++) {
          let string = store.idNamePairs[i].name;
          if (string === temp) {
            found = true;
            break;
          }
        }
        if (!found) break;
        counter += 1;
      }
    }

    let newListName = playlist.name + " " + counter;
    if (!isInOrigList) newListName = playlist.name;
    const response = await api.createPlaylist(
      newListName,
      playlist.songs,
      auth.user.email,
      auth.user.username
    );
    if (response.status === 201) {
      tps.clearAllTransactions();
      let newList = response.data.playlist;
      storeReducer({
        type: GlobalStoreActionType.CREATE_NEW_LIST,
        payload: newList,
      });
      await store.loadIdNamePairs();
      // IF IT'S A VALID LIST THEN LET'S START EDITING IT
      // history.push("/playlist/" + newList._id);
    } else {
      console.log("API FAILED TO CREATE A NEW LIST");
    }
  };

  store.likePlaylist = async function (id, type) {
    if (auth.user === null) return;
    async function getListToDelete(id) {
      let response = await api.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;
        if (type === 1) {
          playlist.likes.push(auth.user.email);
          // playlist.listens += 1;
        } else if (type === 2) {
          playlist.dislikes.push(auth.user.email);
        }

        response = await api.updatePlaylistById(playlist._id, playlist);
        if (response.data.success) {
          async function getListPairs() {
            response = await api.getAllPlaylists();
            if (response.data.success) {
              let pairsArray = response.data.data;
              console.log("pairsArray", pairsArray);
              storeReducer({
                type: GlobalStoreActionType.LIKE,
                payload: pairsArray,
              });
            }
          }
          await getListPairs();
        }
      }
    }
    await getListToDelete(id);
    await store.loadIdNamePairs();
  };

  store.dislikePlaylist = async function (id, type) {
    if (auth.user === null) return;
    async function getListToDelete(id) {
      let response = await api.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;
        if (type === 1) {
          let index = playlist.likes.indexOf(auth.user.email);
          if (index > -1) {
            playlist.likes.splice(index, 1); // 2nd parameter means remove one item only
          }
        } else if (type === 2) {
          let index = playlist.dislikes.indexOf(auth.user.email);
          if (index > -1) {
            playlist.dislikes.splice(index, 1); // 2nd parameter means remove one item only
          }
        }

        response = await api.updatePlaylistById(playlist._id, playlist);
        if (response.data.success) {
          async function getListPairs() {
            response = await api.getAllPlaylists();
            if (response.data.success) {
              let pairsArray = response.data.data;
              console.log("pairsArray", pairsArray);
              storeReducer({
                type: GlobalStoreActionType.LIKE,
                payload: pairsArray,
              });
            }
          }
          await getListPairs();
        }
      }
    }
    await getListToDelete(id);
    await store.loadIdNamePairs();
  };

  store.addComment = async function (comment) {
    async function update() {
      let object = {
        name: auth.user.username,
        comment: comment,
      };
      store.currentList.comments.push(object);
      await store.updateCurrentList();
    }

    update();
  };

  store.addListen = async function () {
    async function update() {
      store.currentList.listens = store.currentList.listens + 1;

      await store.updateCurrentList();
    }
    await update();
  };

  // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
  store.loadIdNamePairs = async function () {
    let response = [];
    if (auth.user !== null) {
      response = await api.getPlaylistPairs(store.sortQuery, store.searchQuery);
    }

    const response2 = await api.getAllPlaylists(
      store.sortQuery,
      store.searchQuery,
      false
    );
    if (response2.data.success) {
      let pairsArray = [];
      if (auth.user !== null) pairsArray = response.data.idNamePairs;

      // console.log(pairsArray);
      let pairsArray2 = response2.data.data;
      //console.log(pairsArray2);
      await storeReducer({
        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
        payload: {
          idNamePairs: pairsArray,
          allPlaylists: pairsArray2,
          sortQuery: store.sortQuery,
          searchQuery: store.searchQuery,
        },
      });
    } else {
      console.log("API FAILED TO GET THE LIST PAIRS");
    }
  };

  store.loadIdNamePairs2 = async function (query, query2, query3) {
    let response = [];
    if (auth.user !== null) {
      response = await api.getPlaylistPairs(query, query2);
    }

    const response2 = await api.getAllPlaylists(query, query2, query3);
    if (response2.data.success) {
      let pairsArray = [];
      if (auth.user !== null) pairsArray = response.data.idNamePairs;

      let pairsArray2 = response2.data.data;
      await storeReducer({
        type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS2,
        payload: {
          idNamePairs: pairsArray,
          allPlaylists: pairsArray2,
          sortQuery: query,
          searchQuery: query2,
        },
      });
    } else {
      console.log("API FAILED TO GET THE LIST PAIRS");
    }
  };

  /*store.sortAllPlaylists = async function (q) {
    const response = await api.getAllPlaylistsSort(q);
    if (response.data.success) {
      let pairsArray = response.data.data;
      console.log("sorted Array", pairsArray);
      await storeReducer({
        type: GlobalStoreActionType.LOAD_ALL_PLAYLISTS,
        payload: pairsArray,
      });
    }
  };*/

  /*store.loadAllPlaylists = async function () {
    console.log(response);
    if (response.data.success) {
      
      await storeReducer({
        type: GlobalStoreActionType.LOAD_ALL_PLAYLISTS,
        payload: pairsArray,
      });
    } else {
      console.log("API FAILED TO GET THE LIST PAIRS");
    }
  };*/

  // THE FOLLOWING 5 FUNCTIONS ARE FOR COORDINATING THE DELETION
  // OF A LIST, WHICH INCLUDES USING A VERIFICATION MODAL. THE
  // FUNCTIONS ARE markListForDeletion, deleteList, deleteMarkedList,
  // showDeleteListModal, and hideDeleteListModal

  store.unmarkListForDeletion = async function () {
    storeReducer({
      type: GlobalStoreActionType.UNMARK_LIST_FOR_DELETION,
      payload: {},
    });
  };
  store.markListForDeletion = function (id) {
    async function getListToDelete(id) {
      let response = await api.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;
        storeReducer({
          type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
          payload: { id: id, playlist: playlist },
        });
      }
    }
    getListToDelete(id);
  };

  store.showEditSongModal = (songIndex, songToEdit) => {
    storeReducer({
      type: GlobalStoreActionType.EDIT_SONG,
      payload: { currentSongIndex: songIndex, currentSong: songToEdit },
    });
  };
  store.showRemoveSongModal = (songIndex, songToRemove) => {
    storeReducer({
      type: GlobalStoreActionType.REMOVE_SONG,
      payload: { deleteSongIndex: songIndex, deleteSong: songToRemove },
    });
  };
  store.deleteList = async function (id) {
    let response = await api.deletePlaylistById(id);
    if (response.status === 200) {
      await store.loadIdNamePairs();
    }
  };
  store.deleteMarkedList = async function () {
    // await store.deleteList(store.listIdMarkedForDeletion);
    console.log("1");
    let response = await api.deletePlaylistById(store.listIdMarkedForDeletion);
    console.log(response);
    if (response.status === 200) {
      // await store.loadIdNamePairs();
      console.log("3");
    }
    console.log("4");
    console.log(store.idNamePairs);
    await store.hideModals();
  };
  // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
  // TO SEE IF THEY REALLY WANT TO DELETE THE LIST

  store.hideModals = () => {
    storeReducer({
      type: GlobalStoreActionType.HIDE_MODALS,
      payload: {},
    });
  };
  store.isDeleteListModalOpen = () => {
    return store.currentModal === CurrentModal.DELETE_LIST;
  };
  store.isEditSongModalOpen = () => {
    return store.currentModal === CurrentModal.EDIT_SONG;
  };
  store.isPlaylistExistsModalOpen = () => {
    return store.currentModal === CurrentModal.PLAYLIST_EXISTS;
  };

  store.isRemoveSongModalOpen = () => {
    return store.currentModal === CurrentModal.REMOVE_SONG;
  };

  // THE FOLLOWING 8 FUNCTIONS ARE FOR COORDINATING THE UPDATING
  // OF A LIST, WHICH INCLUDES DEALING WITH THE TRANSACTION STACK. THE
  // FUNCTIONS ARE setCurrentList, addMoveItemTransaction, addUpdateItemTransaction,
  // moveItem, updateItem, updateCurrentList, undo, and redo
  store.setCurrentList = function (id) {
    async function asyncSetCurrentList(id) {
      let response = await api.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;

        response = await api.updatePlaylistById(playlist._id, playlist);
        if (response.data.success) {
          storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: playlist,
          });
          // history.push("/playlist/" + playlist._id);
        }
      }
    }
    asyncSetCurrentList(id);
  };

  store.getPlaylistSize = function () {
    return store.currentList.songs.length;
  };
  store.addNewSong = function () {
    let index = this.getPlaylistSize();
    this.addCreateSongTransaction(index, "Untitled", "?", "dQw4w9WgXcQ");
  };
  // THIS FUNCTION CREATES A NEW SONG IN THE CURRENT LIST
  // USING THE PROVIDED DATA AND PUTS THIS SONG AT INDEX
  store.createSong = async function (index, song) {
    let list = store.currentList;
    list.songs.splice(index, 0, song);
    // NOW MAKE IT OFFICIAL
    await store.updateCurrentList();
  };

  // THIS FUNCTION MOVES A SONG IN THE CURRENT LIST FROM
  // start TO end AND ADJUSTS ALL OTHER ITEMS ACCORDINGLY
  store.moveSong = async function (start, end) {
    console.log("MOVING SONG");
    let list = store.currentList;

    // WE NEED TO UPDATE THE STATE FOR THE APP
    if (start < end) {
      let temp = list.songs[start];
      for (let i = start; i < end; i++) {
        list.songs[i] = list.songs[i + 1];
      }
      list.songs[end] = temp;
    } else if (start > end) {
      let temp = list.songs[start];
      for (let i = start; i > end; i--) {
        list.songs[i] = list.songs[i - 1];
      }
      list.songs[end] = temp;
    }
    // NOW MAKE IT OFFICIAL
    await store.updateCurrentList();
  };
  // THIS FUNCTION REMOVES THE SONG AT THE index LOCATION
  // FROM THE CURRENT LIST
  store.removeSong = async function (index) {
    let list = store.currentList;
    list.songs.splice(index, 1);

    // NOW MAKE IT OFFICIAL
    await store.updateCurrentList();
  };

  // THIS FUNCTION UPDATES THE TEXT IN THE ITEM AT index TO text
  store.updateSong = async function (index, songData) {
    let list = store.currentList;
    let song = list.songs[index];
    song.title = songData.title;
    song.artist = songData.artist;
    song.youTubeId = songData.youTubeId;

    // NOW MAKE IT OFFICIAL
    await store.updateCurrentList();
  };
  store.addNewSong = () => {
    let playlistSize = store.getPlaylistSize();
    store.addCreateSongTransaction(
      playlistSize,
      "Untitled",
      "?",
      "dQw4w9WgXcQ"
    );
  };
  // THIS FUNCDTION ADDS A CreateSong_Transaction TO THE TRANSACTION STACK
  store.addCreateSongTransaction = (index, title, artist, youTubeId) => {
    // ADD A SONG ITEM AND ITS NUMBER
    let song = {
      title: title,
      artist: artist,
      youTubeId: youTubeId,
    };
    let transaction = new CreateSong_Transaction(store, index, song);
    tps.addTransaction(transaction);
  };
  store.addMoveSongTransaction = function (start, end) {
    let transaction = new MoveSong_Transaction(store, start, end);
    tps.addTransaction(transaction);
  };
  // THIS FUNCTION ADDS A RemoveSong_Transaction TO THE TRANSACTION STACK
  store.addRemoveSongTransaction = () => {
    let index = store.deleteSongIndex;
    let song = store.currentList.songs[index];
    let transaction = new RemoveSong_Transaction(store, index, song);
    tps.addTransaction(transaction);
  };
  store.addUpdateSongTransaction = function (index, newSongData) {
    let song = store.currentList.songs[index];
    let oldSongData = {
      title: song.title,
      artist: song.artist,
      youTubeId: song.youTubeId,
    };
    let transaction = new UpdateSong_Transaction(
      this,
      index,
      oldSongData,
      newSongData
    );
    tps.addTransaction(transaction);
  };
  store.updateCurrentList = async function () {
    const response = await api.updatePlaylistById(
      store.currentList._id,
      store.currentList
    );
    if (response.data.success) {
      storeReducer({
        type: GlobalStoreActionType.SET_CURRENT_LIST,
        payload: store.currentList,
      });
    }
  };
  store.undo = function () {
    tps.undoTransaction();
  };
  store.redo = function () {
    tps.doTransaction();
  };
  store.canAddNewSong = function () {
    return store.currentList !== null;
  };
  store.canUndo = function () {
    return store.currentList !== null && tps.hasTransactionToUndo();
  };
  store.canRedo = function () {
    return store.currentList !== null && tps.hasTransactionToRedo();
  };
  store.canClose = function () {
    return store.currentList !== null;
  };

  // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
  store.setIsListNameEditActive = function () {
    storeReducer({
      type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
      payload: null,
    });
  };

  return (
    <GlobalStoreContext.Provider
      value={{
        store,
      }}
    >
      {props.children}
    </GlobalStoreContext.Provider>
  );
}

export default GlobalStoreContext;
export { GlobalStoreContextProvider };
