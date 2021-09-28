import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {

    renderSquare(i) {
      // pass a prop called value to the square 
        // a square would either display O X or null 
        return <Square value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}/>;
  }

    render() {

    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
    // let game have full control of the board to allow for backtracking of moves 
    constructor(props) {
    super(props);
    this.state = {
        history: [{
            squares: Array(9).fill(null),
            //set first player to be X by default 
        }],
        stepNumber: 0, 
        xIsNext: true,
        };
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber +1);
        const current = history[history.length - 1];
        //call slice to copy the array instead of modifying the existing array 
        const squares = current.squares.slice();
        //ignore click when won the game or when square is filled 
        if (calculateWinner(squares) || squares[i]) {
            return; 
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{ squares: squares, }]),
            stepNumber: history.length, 
            // set xIsNext to true if the number that we’re changing stepNumber to is even:
            xIsNext: !this.state.xIsNext,
            });
    }
    jumpTo(step) {
        this.setState({
            stepNumber: step, 
            // set xIsNext to true if the number that we’re changing stepNumber to is even:
            xIsNext: (step % 2) === 0,
        });
    }
    render() {
        const history = this.state.history;
        //render the current selected move 
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        //using map method to map each move in the history as buttons, allowing jumping to past moves 
        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move: ' + move : 'Go to game start';
            return (
                //for each move, create a button 
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

    return (
      <div className="game">
        <div className="game-board">
            <Board squares={current.squares}
            onClick={(i) => this.handleClick(i)}></Board>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}