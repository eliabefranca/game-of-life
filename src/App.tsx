import { Game, Cell } from "./game";
import "./App.css";
import { CSSProperties, useEffect, useState } from "react";

// be careful with the options, it might freeze your chrome :P
const LINES = 100;
const COLUMNS = 100;
const CELL_SIZE = 3;
const DEBUG = false;
const TIME_BETWEEN_RENDERS = 1;

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
        </div>
    );
}

export default App;
