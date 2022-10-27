import { useContext, useEffect } from "react";
import AuthContext from "../auth";
import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Alert from "@mui/material/Alert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function MUIMessageError() {
  const { auth, error } = useContext(AuthContext);

  useEffect(() => {}, [auth, error]);

  const hideModal = () => {
    auth.hideErrorModal();
  };

  return (
    <Modal open={auth.e}>
      <Box sx={style}>
        <Alert open={auth.e} severity="warning">
          {auth.message}
        </Alert>
        <button
          id="dialog-yes-button"
          className="modal-button"
          onClick={hideModal}
        >
          Confirm
        </button>
      </Box>
    </Modal>
  );
}
