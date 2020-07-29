import React, {Component} from 'react';

import defaultTiles from './defaultTiles.json';
import './App.css';

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      tiles: defaultTiles,
      mineCount: 10
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

  componentDidMount() {
    this.addMines();
  }

  render() {
    const {tiles} = this.state;

    // console.log(tiles);
    // console.log(tiles.filter(t => t.mine === true));

    // defaultTiles = [ { row: number, col: number, clicked: false, mine: false } ... ];

    return (
      <div className="ms">
        <div className="ms-grid">
          {tiles.map((tile, i) =>
            <button className="ms-tile" key={`${tile.row} : ${tile.col}`}>
              <span className="u-visually-hidden">
                {tile.row} : {tile.col}
              </span>
              {tile.mine ? '💣' : ''}
            </button>
          )}
        </div>
      </div>
    );
  }
}