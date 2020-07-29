import React, {Component} from 'react';

import defaultTiles from './defaultTiles.json';

import './reset.css';
import './utils.css';
import './App.css';

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      tiles: defaultTiles,
      mineCount: 10,
      debug: false,
      gameOver: false,
      gameWon: false
    };
  }

  getRandomTile(tiles) {
  	return Math.floor(Math.random() * tiles.length);
  }

  // TODO: account for when the same number is randomly picked twice 
  addMines() {
  	const {mineCount, tiles} = this.state;

  	let updatedTiles = tiles;
  	let i = 0;

  	for (i; i < mineCount; i++) {
  		updatedTiles[this.getRandomTile(tiles)].mine = true;
  	}

  	this.setState({tiles: updatedTiles});
  }

  findTile(row, col) {
  	const {tiles} = this.state;
  	return tiles.find(tile => (tile.row === row && tile.col === col));
  }

  countAdjacentMines() {
  	const {tiles} = this.state;
  	let updatedTiles = tiles;

  	updatedTiles.forEach((tile, i) => {
  		if (tile.mine === false) {

  			// direct left
  			if (tile.col !== 0 && this.findTile(tile.row, tile.col - 1).mine === true) {
					updatedTiles[i].adjacentMines += 1;
  			}
  			
  			// direct right
  			if (tile.col !== 8 && this.findTile(tile.row, tile.col + 1).mine === true) {
  				updatedTiles[i].adjacentMines += 1;
  			}

  			// above row
  			if (tile.row !== 0) {
  				// above left
  				if (tile.col !== 0 && this.findTile(tile.row - 1, tile.col - 1).mine === true) {
						updatedTiles[i].adjacentMines += 1;
  				}
  				// above center
					if (this.findTile(tile.row - 1, tile.col).mine === true) {
						updatedTiles[i].adjacentMines += 1;
					}
  				// above right
  				if (tile.col !== 8 && this.findTile(tile.row - 1, tile.col + 1).mine === true) {
						updatedTiles[i].adjacentMines += 1;
  				}
  			}

  			// below row
  			if (tile.row !== 8) {
  				// below left
  				if (tile.col !== 0 && this.findTile(tile.row + 1, tile.col - 1).mine === true) {
						updatedTiles[i].adjacentMines += 1;
  				}
  				// below center
					if (this.findTile(tile.row + 1, tile.col).mine === true) {
						updatedTiles[i].adjacentMines += 1;
					}
  				// below right
  				if (tile.col !== 8 && this.findTile(tile.row + 1, tile.col + 1).mine === true) {
						updatedTiles[i].adjacentMines += 1;
  				}
  			}
  		}

  		this.setState({tiles: updatedTiles});
  	})
  }

  componentDidMount() {
    this.addMines();
    this.countAdjacentMines();
  }

  handleClick(tile, i) {
  	const {tiles} = this.state;
  	let updatedTiles = tiles;

  	updatedTiles[i].clicked = true;

  	if (updatedTiles[i].mine) {
  		this.setState({gameOver: true});
  	}

  	else if (this.checkWinState(updatedTiles) === true) {
  		this.setState({gameWon: true});
  	}

  	this.setState({tiles: updatedTiles});
  }

  checkWinState(tiles) {
  	const {mineCount} = this.state;
  	const unclickedTiles = tiles.filter(tile => tile.clicked === false);

  	if (unclickedTiles.length === mineCount) {
  		return true;
  	}

  	return false;
  }

  render() {
    const {debug, gameOver, gameWon, tiles} = this.state;

    // console.log(tiles);
    // console.log(tiles.filter(t => t.mine === true));

    // defaultTiles = [ { row: number, col: number, clicked: false, mine: false } ... ];

    return (
      <div className="ms">

      	<h1 className="u-visually-hidden">James Ferrell's attempt at recreating Minesweeper in React</h1>

        <div className="ms-grid">
          {tiles.map((tile, i) =>
          	<button 
            	className={`ms-tile${tile.clicked ? ' is-clicked' : ''}`}
            	onClick={() => this.handleClick(tile, i)}
            	key={`${tile.row} : ${tile.col}`}
            >
              <span className={debug ? '' : 'u-visually-hidden'}>
                row {tile.row}, column {tile.col}, {tile.clicked ? 'clicked' : 'unclicked'}
              </span>
              {tile.mine 
              	? tile.clicked || gameOver ? '💥' : '💣' 
              	: tile.adjacentMines > 0 ? tile.adjacentMines : ''
              }
            </button>
          )}
        </div>

        {gameOver || gameWon 
        	? <h2 className="ms-message">
		        {gameOver ? "Game over ☹" : "Nice job!"}
	        </h2> : ""
        }
      </div>
    );
  }
}