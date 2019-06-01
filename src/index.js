import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return (
      <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
      />
    );
  }

  createBoard = () => {
    let table = []

    // Outer loop to create parent
    for (let i = 0; i < 9; i++) {
      //Create the parent and add the children
      table.push(this.renderSquare(i))
    }
    return table
  }

  render() {
    return (
      <div className="board-grid">
      { this.createBoard() }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0,this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
            squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
      'Go to move #' + move :
      'Go to game start';
      return (
        <li key={move}>
          <button className="btn" onClick={() => this.jumpTo(move)}>{desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    }
    else if (!winner && this.state.stepNumber > 8) {
      status =  'Draw';
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
			  <div className="wrapper">
          <div className="game">
          	<div className="game-board">
	            <Board
	            squares={current.squares}
	            onClick={(i) => this.handleClick(i)}
	            />
            </div>
	            <div className="game-info">
							<h1>Tic Tac Toe</h1>
							<div className="game-player"><h2>{status}</h2></div>
	            <h2 className="game-list">Move List</h2>
	            <ol>{moves}</ol>
            </div>
      		</div>
				</div>
    );
  }
}

// ========================================
//Setup canvas, drawing functions

    const colors = [ '#D8589F', '#EE4523', '#FBE75D', '#4FC5DF'];
    const bubbles = 500;

    const explode = (x, y) => {

        let particles = [];
        let ratio = window.devicePixelRatio;
        let c = document.createElement('canvas');
        let ctx = c.getContext('2d');

        c.style.position = 'absolute';
        c.style.left = 0;
        c.style.top = 0;
        c.style.pointerEvents = 'none';
        c.style.width = 100 + '%';
        c.style.height = 100 + '%';
        c.style.zIndex = 9999;
        c.width = window.innerWidth * ratio;
        c.height = window.innerHeight * ratio;
        document.body.appendChild(c);

        for(var i = 0; i < bubbles; i++) {
            particles.push({
                x: c.width / 2,
                y: c.height / r(2, 4),
                radius: r(6, 15),
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: r(230, 310, true),
                speed: r(6, 12),
                friction: .992,
                fade: .0005,
                opacity: r(100, 100, true),
                yVel: 0.1,
                gravity: 0.01
            });
        }

        render(particles, ctx, c.width, c.height);
        setTimeout(() => document.body.removeChild(c), 25000);
    }

    const render = (particles, ctx, width, height) => {
        requestAnimationFrame(() => render(particles, ctx, width, height));
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, i) => {
            p.x += p.speed * Math.cos(p.rotation * Math.PI / 180);
            p.y += p.speed * Math.sin(p.rotation * Math.PI / 180);

            p.opacity -= 0.005;
            p.speed *= p.friction;
            p.radius -= p.fade;
            p.yVel += p.gravity;
            p.y += p.yVel;

            if(p.opacity < 0 || p.radius < 0) return;

            ctx.beginPath();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
            ctx.fill();
        });

        return ctx;
    }

    const r = (a, b, c) => parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c ? c : 0));


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
      explode((window.innerWidth/8),(window.innerHeight/2));
      return squares[a];
    }
  }
  return null;
}
