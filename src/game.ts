// rules
// 1- every dead cell with exactly three alive neighbors will become alive
// 2- every living cell with less than two alive neighbors will die
// 3- every living cell with more than three alive neighbors will die
// 4- every living cell with two or three alive neighbors will keep alive

interface Coordinates {
    x: number;
    y: number;
}

export class Cell {
    state: number;
    neighbors: Cell[] = [];
    coordinates: Coordinates;

    constructor(state: number, coordinates: Coordinates) {
        this.state = state;
        this.coordinates = coordinates;
    }

    public addNeighbors(neighbors: Cell[]) {
        this.neighbors = neighbors;
    }

    public toggleState() {
        this.state = this.state === 1 ? 0 : 1;
    }

    public getNewState() {
        const aliveNeighbors = this.neighbors.filter(
            (neighborCell) => neighborCell.state === 1
        ).length;

        // 1st rule:
        if (this.state === 0) {
            if (aliveNeighbors === 3) {
                return 1;
            }

            return 0;
        }

        // 2nd rule:
        if (aliveNeighbors < 2) {
            return 0;
        }

        // 3rd rule:
        if (aliveNeighbors > 3) {
            return 0;
        }

        // 4th rule is automatically applied
        return 1;
    }
}

interface GameOptions {
    lines: number;
    columns: number;
    speed: number;
}

export class Game {
    grid: Cell[][];
    config: GameOptions;
    timeInterval = -1;

    constructor(config: GameOptions) {
        this.config = config;
        this.grid = this.createGrid();
    }

    private createGridWithoutNeighbors(): Cell[][] {
        const grid: Cell[][] = [];

        for (let x = 0; x < this.config.lines; x++) {
            grid.push([]);
            for (let y = 0; y < this.config.columns; y++) {
                grid.push([]);
                grid[x][y] = new Cell(0, { x, y });
            }
        }

        return grid;
    }

    private addCellNeighbors(grid: Cell[][]) {
        for (let x = 1; x < this.config.lines - 1; x++) {
            for (let y = 1; y < this.config.columns - 1; y++) {
                const currentCell = grid[x][y];
                const neighbors = [];

                neighbors.push(grid[x - 1][y - 1]);
                neighbors.push(grid[x][y - 1]);
                neighbors.push(grid[x + 1][y - 1]);

                neighbors.push(grid[x - 1][y]);
                neighbors.push(grid[x + 1][y]);

                neighbors.push(grid[x - 1][y + 1]);
                neighbors.push(grid[x][y + 1]);
                neighbors.push(grid[x + 1][y + 1]);

                currentCell.addNeighbors(neighbors);
            }
        }
    }

    public clear() {
        this.grid = this.createGrid();
    }

    public randomlyPopulateGrid() {
        for (let x = 1; x < this.config.lines - 1; x++) {
            for (let y = 1; y < this.config.columns - 1; y++) {
                const cell = this.grid[x][y];
                cell.state = Math.round(Math.random());
            }
        }
    }

    private createGrid(): Cell[][] {
        const grid = this.createGridWithoutNeighbors();
        this.addCellNeighbors(grid);
        return grid;
    }

    public computeNextGeneration(self: Game) {
        const newGrid = this.createGridWithoutNeighbors();

        for (let x = 1; x < self.config.lines - 1; x++) {
            for (let y = 1; y < self.config.columns - 1; y++) {
                const cell = self.grid[x][y];
                const newCell = newGrid[x][y];
                const state = cell.getNewState();
                newCell.state = state;
            }
        }

        this.addCellNeighbors(newGrid);
        this.grid = newGrid;
    }

    public stop() {
        if (this.timeInterval === -1) {
            return;
        }

        clearInterval(this.timeInterval);
        this.timeInterval = -1;
    }

    public start() {
        this.timeInterval = setInterval(
            () => this.computeNextGeneration(this),
            this.config.speed
        );
    }
}
