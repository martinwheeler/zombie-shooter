import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
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

type BulletPosition = {
  x: number;
  y: number;
};

type Bullet = {
  spawn: BulletPosition;
  mouseHeading: BulletPosition;
  id: string;
};

const INTERVAL_DELAY = 50; // milliseconds

function Player({
  setBullets,
}: {
  setBullets: Dispatch<SetStateAction<Bullet[]>>;
}) {
  const [player, setPlayer] = useState<Player>({
    position: {
      x: 0,
      y: 0,
    },
    health: 100,
    // TODO: Buffs
    // TODO: Ammo (bullets, grenades)
    // TODO:
  });

  const [keysPressed, setKeysPressed] = useState<string[]>([]);

  const playerMovementInterval = useRef<number>(0);
  const shootingInterval = useRef<number>(0);

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
      INTERVAL_DELAY
    );
    shootingInterval.current = setInterval(handleShooting, INTERVAL_DELAY);

    return () => {
      window.removeEventListener("keydown", handleAddKey);
      window.removeEventListener("keyup", handleRemoveKey);

      if (playerMovementInterval.current)
        clearInterval(playerMovementInterval.current);

      if (shootingInterval.current) clearInterval(shootingInterval.current);
    };
  });

  // TODO: Limit the players x & y to some max values E.g. 0,0 & 1000,1000
  // NOTE: The max limit will be relative to the window size
  function handlePlayerMovement() {
    keysPressed.forEach((currentKey) => {
      // up
      if (currentKey === "KeyW") {
        console.log("up");

        setPlayer((currentPlayer) => ({
          ...currentPlayer,
          position: {
            ...currentPlayer.position,
            y: currentPlayer.position.y - 5,
          },
        }));
      }

      // down
      if (currentKey === "KeyS") {
        console.log("down");
        setPlayer((currentPlayer) => ({
          ...currentPlayer,
          position: {
            ...currentPlayer.position,
            y: currentPlayer.position.y + 5,
          },
        }));
      }

      // left
      if (currentKey === "KeyA") {
        console.log("left");

        setPlayer((currentPlayer) => ({
          ...currentPlayer,
          position: {
            ...currentPlayer.position,
            x: currentPlayer.position.x - 5,
          },
        }));
      }

      // right
      if (currentKey === "KeyD") {
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

  function handleShooting() {
    const newBulletId = new Date().getTime();

    if (keysPressed.includes("Space")) {
      setBullets((currentBullets) => {
        console.log({ newBulletId });
        return [
          ...currentBullets,
          {
            id: newBulletId,
            spawn: {
              x: player.position.x,
              y: player.position.y,
            },
            // mouseHeading: {
            //   x: Mouse
            // }
          } as unknown as Bullet,
        ];
      });
    }
  }

  function handleAddKey(event: KeyboardEvent) {
    if (keysPressed.includes(event.code)) return;
    setKeysPressed((currentKeys) => [...currentKeys, event.code]);
  }

  function handleRemoveKey(event: KeyboardEvent) {
    if (!keysPressed.includes(event.code)) return;
    setKeysPressed((currentKeys) =>
      currentKeys.filter((code) => code !== event.code)
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

// NOTE: Bug with bullet deletion (deletes more bullets than desired)
// I think it's due to the ID assignment, they must all get the same ID
function Bullet({
  targetRef,
  data,
  setBullets,
}: {
  targetRef: MutableRefObject<HTMLDivElement>;
  data: Bullet;
  setBullets: Dispatch<SetStateAction<Bullet[]>>;
}) {
  const [bulletPosition, setBulletPosition] = useState<BulletPosition>({
    x: data.spawn.x,
    y: data.spawn.y,
  });

  const bulletMovementInterval = useRef<number>(0);

  function handleBulletMovement() {
    setBulletPosition((currentBulletPosition) => {
      let newX = currentBulletPosition.x;
      let newY = currentBulletPosition.y;

      // TODO:
      // Measure the distance from the bullet to the target
      // targetRef.current.getBoundingClientRect() -> x, y
      const { x: targetX, y: targetY } =
        targetRef.current.getBoundingClientRect();
      // Pixels / Time = Pixels per update
      // TargetX - BulletX = xRemaining
      // xRemaining / 10 = newXIncrement

      const currentTargetX = Math.ceil(targetX);
      const currentTargetY = Math.ceil(targetY);

      // Return the new position closer to the target
      if (currentTargetX > currentBulletPosition.x) {
        const remainingPixels = currentTargetX - currentBulletPosition.x;
        const pixelsToChange = Math.ceil(remainingPixels / INTERVAL_DELAY);
        newX += pixelsToChange;
      }

      if (currentTargetY > currentBulletPosition.y) {
        const remainingPixels = currentTargetY - currentBulletPosition.y;
        const pixelsToChange = Math.ceil(remainingPixels / INTERVAL_DELAY);
        newY += pixelsToChange;
      }

      if (currentTargetX < currentBulletPosition.x) {
        const remainingPixels = currentBulletPosition.x - currentTargetX;
        const pixelsToChange = Math.ceil(remainingPixels / INTERVAL_DELAY);
        newX -= pixelsToChange;
      }

      if (currentTargetY < currentBulletPosition.y) {
        const remainingPixels = currentBulletPosition.y - currentTargetY;
        const pixelsToChange = Math.ceil(remainingPixels / INTERVAL_DELAY);
        newY -= pixelsToChange;
      }

      if (
        currentTargetX === currentBulletPosition.x &&
        currentTargetY === currentBulletPosition.y
      ) {
        setBullets((currentBullets) => [
          ...currentBullets.filter((bullet) => bullet.id !== data.id),
        ]);
      }

      return { x: newX, y: newY };
    });
  }

  useEffect(() => {
    bulletMovementInterval.current = setInterval(
      handleBulletMovement,
      INTERVAL_DELAY
    );

    return () => {
      if (bulletMovementInterval.current)
        clearInterval(bulletMovementInterval.current);
    };
  });

  return (
    <div
      style={{
        position: "absolute",
        top: bulletPosition.y,
        left: bulletPosition.x,
      }}
    >
      👆
    </div>
  );
}

const TARGET = {
  y: 750,
  x: 900,
};

// TODO: Build a player that we can control with WARS
function App() {
  const [bullets, setBullets] = useState<Bullet[]>([]);
  const targetRef = useRef<HTMLDivElement>(null);

  console.log("TOTAL BULLETS: ", bullets.length);

  return (
    <>
      <Player setBullets={setBullets} />

      {bullets.map((bullet) => {
        if (!targetRef.current) return null;

        return (
          <Bullet
            setBullets={setBullets}
            targetRef={targetRef as unknown as MutableRefObject<HTMLDivElement>}
            data={bullet}
          />
        );
      })}

      <div
        ref={targetRef}
        style={{ position: "absolute", left: TARGET.x, top: TARGET.y }}
      >
        🎯
      </div>
    </>
  );
}

export default App;
