class AI {
  constructor(bp, wp, grid) {
    this.state = new State(bp, wp, grid);
  }

  calculateMove() {
    let childs = this.state.childOf(false);
    let temp;
    let result = Number.MIN_SAFE_INTEGER;
    for (let i = 0; i < childs.length; i++) {
    // for (let i = childs.length - 1; i >= 0; i--) {
      let min = this.alphaBeta(childs[i], 4, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, false);
      //console.log(min);
      if (result <= min) {
        result = min;
        temp = childs[i];
      }
    }
    return this.generateMove(temp);
  }

  alphaBeta(state, depth, alpha, beta, maximizingPlayer) {
    if (depth == 0 || state.wp >= 6 || state.bp >= 6) {
      return state.evaluation();
    }
    if (maximizingPlayer) {
      let V = Number.MIN_SAFE_INTEGER;
      let childs = state.childOf(false);
      for (let i = 0; i < childs.length; i++) {
        V = Math.max(V, this.alphaBeta(childs[i], depth-1, alpha, beta, false));
        alpha = Math.max(alpha, V);
        if(beta <= alpha) {
          break;
        }
      }
      return V;
    } else {
      let V = Number.MAX_SAFE_INTEGER;
      let childs = state.childOf(true);
      for (let i = 0; i < childs.length; i++) {
        V = Math.min(V, this.alphaBeta(childs[i], depth-1, alpha, beta, true));
        beta = Math.min(beta, V);
        if(beta <= alpha) {
          break;
        }
      }
      return V;
    }
  }

  generateMove(s) {
    let m = new Array(4);
    for (let i = 0; i < cols; i++) {
  		for (let j = 0; j < rows; j++) {
  			if (this.state.grid[i][j].hasPiece) {
          if (!this.state.grid[i][j].pieceColor && !s.grid[i][j].hasPiece) {
            m[0] = i;
            m[1] = j;
          } else if (this.state.grid[i][j].pieceColor && s.grid[i][j].hasPiece) {
            if(!s.grid[i][j].pieceColor) {
              m[2] = i;
  						m[3] = j;
            }
          }
        } else {
          if (s.grid[i][j].hasPiece) {
            if (!s.grid[i][j].pieceColor) {
              m[2] = i;
							m[3] = j;
            }
          }
        }
  		}
  	}

    let eatPoint = true;
    let x = m[0];
    let y = m[1];
    let posX = [x+1, x+2, x+2, x+1, x-1, x-2, x-2, x-1];
    let posY = [y-2, y-1, y+1, y+2, y+2, y+1, y-1, y-2];
    for (let i = 0; i < 8; i++) {
      if (posX[i] >= 0 && posX[i] < 8 && posY[i] >= 0 && posY[i] < 8) {
        if (m[2] == posX[i] && m[3] == posY[i]) {
          eatPoint = false;
          break;
        }
      }
    }

    if (eatPoint) {
      if (m[2] == 7 && m[3] == 0) {
        m[2] = 4;
        m[3] = 7;
      } else if (m[2] == 0 && m[3] == 0){
        m[2] = 3;
        m[3] = 7;
      }
    }
    return m;
  }
}
