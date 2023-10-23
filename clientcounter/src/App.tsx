import React, { useState, useEffect } from "react";
import { Button, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

const CenterBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
});

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("counter", (counter) => {
      setCount(counter);
    });

    return () => {
      socket.off("counter");
    };
  }, []);

  const increment = () => {
    socket.emit("increment");
  };

  const decrement = () => {
    socket.emit("decrement");
  };

  return (
    <CenterBox>
      <Typography variant="h2">{count || 0}</Typography>
      <Button variant="contained" color="primary" onClick={increment}>
        Increment
      </Button>
      <Button variant="contained" color="secondary" onClick={decrement}>
        Decrement
      </Button>
    </CenterBox>
  );
}

export default Counter;
