class Cell {
  constructor(i, j, w) {
    this.i = i;
    this.j = j;
    this.x = i * w;
    this.y = j * w;
    this.w = w;
    this.hasPiece = false;
    this.point = 0;
    this.pieceColor = false;
    this.bg = false;
    this.possibleDestination = false;
  }

  show() {
    stroke(0);
    if (this.bg) {
      fill(255, 0, 0);
    } else if (this.possibleDestination) {
      fill(100,255,100);
    } else if ((this.i+this.j) % 2 == 0) {
      fill(200);
    } else {
      noFill();
    }
    rect(this.x, this.y, this.w, this.w);
    if (this.point != 0) {
      textAlign(CENTER);
      fill(0);
      textSize(20);
      text(this.point, this.x+this.w*0.5, this.y-15+this.w);
    }
    if (this.hasPiece) {
      if (this.pieceColor) {
        stroke(0);
        fill(255);
        ellipse(this.x+this.w*0.5, this.y+this.w*0.5, this.w * 0.5);
      } else {
        stroke(0);
        fill(127);
        ellipse(this.x+this.w*0.5, this.y+this.w*0.5, this.w * 0.5);
      }
    }
  }

  clicked() {
    if (this.hasPiece) {
      let moves = this.possibleMoves(grid);
      if (this.bg) {
        this.bg = false;
        for (let i = 0; i < moves.length; i++) {
          moves[i].possibleDestination = false;
        }
      } else {
        this.bg = true;
        for (let i = 0; i < moves.length; i++) {
          moves[i].possibleDestination = true;
        }
      }
    }
  }

  possibleMoves(grid) {
    let moves = new Array();
    if (this.hasPiece) {
      let posX = [this.i+1, this.i+2, this.i+2, this.i+1, this.i-1, this.i-2, this.i-2, this.i-1];
      let posY = [this.j-2, this.j-1, this.j+1, this.j+2, this.j+2, this.j+1, this.j-1, this.j-2];
      let defX = [this.i, this.i+1, this.i+1, this.i, this.i, this.i-1, this.i-1, this.i];
      let defY = [this.j-1, this.j, this.j, this.j+1, this.j+1, this.j, this.j, this.j-1];
      for (let k = 0; k < 8; k++) {
        if (posX[k] >= 0 && posX[k] < 8 && posY[k] >= 0 && posY[k] < 8) {
          if (!grid[posX[k]][posY[k]].hasPiece || (grid[posX[k]][posY[k]].hasPiece && (grid[posX[k]][posY[k]].pieceColor != this.pieceColor))) {
            if (!grid[defX[k]][defY[k]].hasPiece){
              moves.push(grid[posX[k]][posY[k]]);
            }
          }
        }
      }
    }
    return moves;
  }

  isPossibleMove(des) {
    let moves = this.possibleMoves(grid);
    for (let i = 0; i < moves.length; i++) {
      if (des == moves[i]) return true;
    }
    return false;
  }

  playerMove(des) {
    if (des.hasPiece) {
      if (des.pieceColor) {
        bpoint++;
      } else {
        wpoint++;
      }
    }
    des.hasPiece = true;
    if (this.pieceColor) {
      des.pieceColor = true;
    } else des.pieceColor = false;
    this.hasPiece = false;
    des.clicked();
    //
    if (des.point != 0) {
      if (des.j == 0 && this.pieceColor) {
        des.clicked();
        if (des.point == 2) {
          wpoint += 2;
          des.computerMove(grid[7][7]);
        } else {
          wpoint++;
          des.computerMove(grid[0][7]);
        }
      } else if (des.j == 7 && !this.pieceColor) {
        des.clicked();
        if (des.point == 1) {
          bpoint++;
          des.computerMove(grid[7][0]);
        } else {
          bpoint+=2;
          des.computerMove(grid[0][0]);
        }
      }
    }
  }

  computerMove(des, state = false) {
    if (des.hasPiece) {
      if (des.pieceColor != this.pieceColor) {
        if (des.pieceColor) {
          if(!state) {
            bpoint++;
          } else {
            state.bp++;
          }
        } else {
          if(!state) {
            wpoint++;
          } else {
            state.wp++;
          }
        }
      }
    }
    des.hasPiece = true;
    if (this.pieceColor) {
      des.pieceColor = true;
    } else des.pieceColor = false;
    this.hasPiece = false;

    if (des.point != 0) {
      if (des.j == 0 && this.pieceColor) {
        if (des.point == 2) {
          if (!state) {
            wpoint+=2;
            des.computerMove(grid[7][7]);
          } else {
            state.wp+=2;
            des.computerMove(state.grid[7][7], state);
          }
        } else {
          if (!state) {
            wpoint++;
            des.computerMove(grid[0][7]);
          } else {
            state.wp++;
            des.computerMove(state.grid[0][7], state);
          }
        }
      } else if (des.j == 7 && !this.pieceColor) {
        if (des.point == 1) {
          if (!state) {
            bpoint++;
            des.computerMove(grid[7][0]);
          } else {
            state.bp++;
            des.computerMove(state.grid[7][0], state);
          }
        } else {
          if (!state) {
            bpoint+=2;
            des.computerMove(grid[0][0]);
          } else {
            state.bp+=2;
            des.computerMove(state.grid[0][0], state);
          }
        }
      }
    }
    //console.log('bpoint: ' + bpoint + ' wpoint: ' + wpoint);
  }

  copy() {
    let temp = new Cell(this.i, this.j, this.w);
    temp.hasPiece = this.hasPiece;
    temp.point = this.point;
    temp.pieceColor = this.pieceColor;
    temp.bg = this.bg;
    temp.isPossibleMove = this.isPossibleMove;
    return temp;
  }

  contains(x, y) {
    return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.w);
  }
}
