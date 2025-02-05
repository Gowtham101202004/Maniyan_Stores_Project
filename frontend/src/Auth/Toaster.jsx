import { Alert, IconButton, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from "react";
import './Toaster.css';

export default function Toaster({ message, severity = "success", onClose }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
  }, [message]);

  function handleClose(event, reason) {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    if (onClose) {
      onClose();
    }
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "right"
      }}
      open={open}
      autoHideDuration={1500}
      onClose={handleClose}
      className="toaster"
      action={
        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    >
      <Alert 
        onClose={handleClose} 
        severity={severity}  
        className="alert"
        // sx={{ width: '30vw', borderRadius: '10px' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
