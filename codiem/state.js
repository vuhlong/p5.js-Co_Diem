class State {
  constructor(bp, wp, grid) {
    this.bp = bp;
    this.wp = wp;
    this.grid = make2DArray(cols, rows);
  	for (let i = 0; i < cols; i++) {
  		for (let j = 0; j < rows; j++) {
  			this.grid[i][j] = grid[i][j].copy();
  		}
  	}
    this.bpoint = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [10, 0, 10, 0, 10, 0, 10, 0],
      [5, 10, 5, 10, 5, 10, 5, 10],
      [10, 20, 15, 20, 15, 20, 10, 5],
      [20, 15, 20, 15, 20, 15, 20, 15],
      [15, 5, 50, 30, 50, 30, 10, 20],
      [20, 50, 30, 10, 5, 50, 30, 15],
      [15, 0, 0, 0, 0, 0, 0, 20]
    ];
    this.wpoint = [
      [-20, 0, 0, 0, 0, 0, 0, -15],
      [-15, -30, -50, -5, -10, -30, -50, -20],
      [-20, -10, -30, -50, -30, -50, -5, -15],
      [-15, -20, -15, -20, -15, -20, -15, -20],
      [-5, -10, -20, -15, -20, -15, -20, -15, -20],
      [-10, -5, -10, -5, -10, -5, -10, -5],
      [0, -10, 0, -10, 0, -10, 0, -10],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];
  }

  childOf(turn) {
    let childs = [];
    let temp;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (this.grid[i][j].hasPiece && this.grid[i][j].pieceColor == turn) {
          let moves = this.grid[i][j].possibleMoves(this.grid);
          for (let m = 0; m < moves.length; m++){
            temp = new State(this.bp, this.wp, this.grid);
            temp.grid[i][j].computerMove(temp.grid[moves[m].i][moves[m].j], temp);
            childs.push(temp);
          }
        }
      }
    }
    return childs;
  }

  material(i, j) {
    if (this.grid[i][j].pieceColor) {
      return -800;
    } else {
      return 800;
    }
  }

  mobility(i, j) {
    let moves = this.grid[i][j].possibleMoves(this.grid);
    if (this.grid[i][j].pieceColor) {
      return -moves.length * 20; //50
    } else {
      return moves.length * 20;
    }
  }

  checkDef(i, j) {
    let result = 0;
    let pX = [i, i+1, i, i-1];
    let pY = [j-1, j, j+1, j];
    let aX = [i+1, i+1, i-1, i-1];
    let aY = [j-1,j+1, j+1, j-1];
    for (let k = 0; k < 4; k++) {
      if (pX[k] >= 0 && pX[k] < 8 && pY[k] >= 0 && pY[k] < 8) {
        if (this.grid[pX[k]][pY[k]].hasPiece && this.grid[pX[k]][pY[k]].pieceColor != this.grid[i][j].pieceColor) {
          let a;
          if (k == 0) {
            a = [1,2];
          } else if (k == 1) {
            a = [2,3];
          } else if (k == 2) {
            a = [0,3];
          } else {
            a = [0,1];
          }
          for (let t of a) {
            if (aX[t] >=0 && aX[t] < 8 && aY[t] >=0 && aY[t] < 8) {
              if (this.grid[aX[t]][aY[t]].hasPiece && this.grid[aX[t]][aY[t]].pieceColor == this.grid[i][j].pieceColor) {
                if (this.grid[i][j].pieceColor) {
                  result -= 50; //50
                } else {
                  result += 50;
                }
              }
              if (aX[t] == 3 || aX[t] == 4) {
                if (aY[t] == 0 && !this.grid[i][j].pieceColor) {
                  if (aX[t] == 3) {
                    result += 100; //100
                  } else {
                    result += 200; //200
                  }
                }
                if (aY[t] == 7 && this.grid[i][j].pieceColor) {
                  if (aX[t] == 3) {
                    result -= 200;
                  } else {
                    result -= 100;
                  }
                }
              }
            }
          }
        }
      }
    }
    return result;
  }

  posisionPoint(i, j) {
    let moves = this.grid[i][j].possibleMoves(this.grid);
    if (!this.grid[i][j].pieceColor) {
      for (let m of moves) {
        if (this.bpoint[j][i] != 50 && this.bpoint[j][i] != 30) {
          if (this.bpoint[m.j][m.i] > this.bpoint[j][i] || m.point != 0) return this.bpoint[j][i];
        } else {
          if (m.point != 0 && m.j == 7) {
            return this.bpoint[j][i];
          }
        }
      }
    } else {
      for (let m of moves) {
        if (this.wpoint[j][i] != -50 && this.wpoint[j][i] != -30) {
          if (this.wpoint[m.j][m.i] < this.wpoint[j][i] || m.point != 0) return this.wpoint[j][i];
        } else {
          if (m.point != 0 && m.j == 0) {
            return this.wpoint[j][i];
          }
        }
      }
    }
    return 0;
  }

  evaluation() {
    if (this.bp >= 6) {
      return Number.MAX_SAFE_INTEGER;
    }
    if (this.wp >= 6) {
      return Number.MIN_SAFE_INTEGER;
    }
    let result = 0;
    for (let i = 0; i < cols; i++) {
  		for (let j = 0; j < rows; j++) {
  			if (this.grid[i][j].hasPiece) {
          result = result + this.mobility(i,j) + this.material(i,j) + this.checkDef(i,j) + this.posisionPoint(i,j);
          //result += this.material(i,j);
        }
  		}
  	}
    result += 1000 * (this.bp - this.wp);
    return result;
  }

}
