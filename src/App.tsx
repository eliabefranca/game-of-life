import { Game, Cell } from "./game";
import "./App.css";
import { CSSProperties, useEffect, useState } from "react";

// be careful with the options, it might freeze your chrome :P
const LINES = 100;
const COLUMNS = 100;
const CELL_SIZE = 3;
const DEBUG = false;
const TIME_BETWEEN_RENDERS = 100;

const game = new Game({
    lines: LINES,
    columns: COLUMNS,
    speed: TIME_BETWEEN_RENDERS,
});

game.randomlyPopulateGrid();

const styles: { [key: string]: CSSProperties } = {
    grid: {
        display: "flex",
        flexWrap: "wrap",
        width: `${LINES * CELL_SIZE}px`,
        border: "1px solid #000",
    },

    deadCell: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: DEBUG ? "1px solid #000" : "none",
        width: `${CELL_SIZE}px`,
        height: `${CELL_SIZE}px`,
        boxSizing: "border-box",
        fontSize: "8px",
        fontWeight: "bold",
    },

    livingCell: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "1px solid #000",
        width: `${CELL_SIZE}px`,
        height: `${CELL_SIZE}px`,
        boxSizing: "border-box",
        fontSize: `${CELL_SIZE / 3 - 2}px`,
        fontWeight: "bold",
        backgroundColor: "#000",
        color: "#fff",
    },
};

function App() {
    const [speed, setSpeed] = useState(TIME_BETWEEN_RENDERS);
    const [stopped, setStopped] = useState(true);
    const [renders, setRenders] = useState(1);

    const handleCellClick = (cell: Cell) => {
        if (!stopped) {
            return;
        }

        cell.toggleState();
        setRenders(renders + 1);
    };

    const handleStartClick = () => {
        if (stopped) {
            game.start();
        } else {
            game.stop();
        }

        setStopped(!stopped);
    };

    const reset = () => {
        game.clear();
        game.randomlyPopulateGrid();
        setRenders(renders + 1);
    };

    const clear = () => {
        game.clear();
        setRenders(renders + 1);
    };

    const changeSpeed = (newSpeed: number) => {
        if (newSpeed < 10) {
            newSpeed = 10;
        }
        setSpeed(newSpeed);
        game.config.speed = newSpeed;
    };

    useEffect(() => {
        if (stopped) {
            return;
        }

        const interval = setInterval(() => {
            setRenders(renders + 1);
        }, TIME_BETWEEN_RENDERS);

        return () => {
            clearInterval(interval);
        };
    }, [stopped, renders]);

    return (
        <div className="container">
            <div className="controls">
                <div className="title">
                    <h1>Game Of Life</h1>

                    {DEBUG && <> - renders: {renders}</>}
                </div>
                <button onClick={handleStartClick}>
                    {stopped ? "start" : "stop"}
                </button>
                {stopped && <button onClick={reset}>reset</button>}
                {stopped && <button onClick={clear}>clear</button>}
                {stopped && (
                    <div>
                        <button onClick={() => changeSpeed(speed - 10)}>
                            -
                        </button>{" "}
                        <span>delay between frames: {speed} </span>
                        <button onClick={() => changeSpeed(speed + 10)}>
                            +
                        </button>
                    </div>
                )}
            </div>
            <div style={styles.grid}>
                {game.grid.map((line) =>
                    line.map((cell) => (
                        <div
                            onClick={() => handleCellClick(cell)}
                            style={
                                cell.state ? styles.livingCell : styles.deadCell
                            }
                            key={`${cell.coordinates.x}-${cell.coordinates.y}`}
                        >
                            {DEBUG && (
                                <>
                                    {cell.coordinates.x}, {cell.coordinates.y}
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
            <p>
                The Game of Life is a cellular automation and zero-player game
                developed by British mathematician John Conway in 1970. It is
                played on an infinite two-dimensional grid of cells, which can
                be in one of two states: alive or dead. The rules of the Game of
                Life are very simple:
                <ul>
                    <li>
                        Any live cell with fewer than two live neighbours dies,
                        as if by underpopulation.
                    </li>
                    <li>
                        Any live cell with two or three live neighbours lives on
                        to the next generation.
                    </li>
                    <li>
                        Any live cell with more than three live neighbours dies,
                        as if by overpopulation.
                    </li>
                    <li>
                        Any dead cell with exactly three live neighbours becomes
                        a live cell, as if by reproduction.
                    </li>
                </ul>
                These rules determine whether a given cell on the grid will be
                alive or dead in the next generation. The initial pattern
                constitutes the seed of the system. The game is so named because
                the patterns that emerge on the grid over time can resemble the
                growth and death of living organisms. The Game of Life has been
                widely studied and has found applications in various fields such
                as computer science, physics, and biology. Its simplicity and
                richness make it a popular subject of study for exploring
                complex systems and emergent behavior.
            </p>
        </div>
    );
}

export default App;
