import { useEffect, useRef, useState } from "react";
import "./App.css";

type Player = {
  position: {
    x: number;
    y: number;
  };
  health: number;
};

type Movement = {
  //// track the keys pressed
};

const MOVEMENT_DELAY = 10; // milliseconds

function Player() {
  const [player, setPlayer] = useState<Player>({
    position: {
      x: 0,
      y: 0,
    },
    health: 100,
  });

  const [keysPressed, setKeysPressed] = useState<string[]>([]);

  const playerMovementInterval = useRef<number>(0);

  // DONE: 1. Capture the users onKeyDown event for a key press & then keep triggering the key until we get an onKeyUp event
  // this is to simulate multiple key presses as we can't handle multiple out of the box

  // TODO: 2. Build a shooting function on press of the space key (along with a projectile)
  // the projectile will head on the direction of the mouse (if possible)

  // structure
  // x, y
  //

  // Where do we put a loop/tick engine? We want to trigger the key every 100 milliseconds

  useEffect(() => {
    window.addEventListener("keydown", handleAddKey);
    window.addEventListener("keyup", handleRemoveKey);

    playerMovementInterval.current = setInterval(
      handlePlayerMovement,
      MOVEMENT_DELAY,
    );

    return () => {
      window.removeEventListener("keydown", handleAddKey);
      window.removeEventListener("keyup", handleRemoveKey);

      if (playerMovementInterval.current)
        clearInterval(playerMovementInterval.current);
    };
  });

  // TODO: Limit the players x & y to some max values E.g. 0,0 & 1000,1000
  // NOTE: The max limit will be relative to the window size
  function handlePlayerMovement() {
    keysPressed.forEach((currentKey) => {
      if (currentKey === "w") {
        // up
        console.log("up");

        setPlayer((currentPlayer) => ({
          ...currentPlayer,
          position: {
            ...currentPlayer.position,
            y: currentPlayer.position.y - 5,
          },
        }));
      }

      if (currentKey === "r") {
        // down
        console.log("down");
        setPlayer((currentPlayer) => ({
          ...currentPlayer,
          position: {
            ...currentPlayer.position,
            y: currentPlayer.position.y + 5,
          },
        }));
      }

      if (currentKey === "a") {
        // left
        console.log("left");

        setPlayer((currentPlayer) => ({
          ...currentPlayer,
          position: {
            ...currentPlayer.position,
            x: currentPlayer.position.x - 5,
          },
        }));
      }

      if (currentKey === "s") {
        // right
        console.log("right");

        setPlayer((currentPlayer) => ({
          ...currentPlayer,
          position: {
            ...currentPlayer.position,
            x: currentPlayer.position.x + 5,
          },
        }));
      }
    });
  }

  function handleAddKey(event: KeyboardEvent) {
    if (keysPressed.includes(event.key)) return;
    setKeysPressed((currentKeys) => [...currentKeys, event.key]);
  }

  function handleRemoveKey(event: KeyboardEvent) {
    if (!keysPressed.includes(event.key)) return;
    setKeysPressed((currentKeys) =>
      currentKeys.filter((key) => key !== event.key),
    );
  }

  console.log({ keysPressed });

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: player.position.y,
          left: player.position.x,
        }}
      >
        Player
      </div>
    </>
  );
}

// TODO: Build a player that we can control with WARS
function App() {
  return (
    <>
      <Player />
    </>
  );
}

export default App;
