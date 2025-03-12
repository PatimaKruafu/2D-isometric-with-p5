//load images
function preload() {
  tile1 = loadImage('img/tile1_main.png');
  tileGhost = loadImage('img/tile_ghost.png');
  tile1Grid = loadImage('img/tile1_grid.png');
  tileNull = loadImage('img/emptyTile.png');
}

//--variables--
//tiles
let tile1;
let tileGhost;
let tile1Grid;

//tiles info
let tileWidth;
let tileHeight;
let tileScale = 2;

///create 2D array for grid mapping
let gridMap = [];
let gridSize = 15;
function gridMapping(gridSize) {
  for (let r = 0; r < gridSize; r++ ) {
    gridMap[r] = []

    for (let c = 0; c < gridSize; c++) {
      gridMap[r][c] = 0;
    }
  }
}


function setup() {
  createCanvas(1280, 640);
  //tile info
  tileWidth = tile1.width * tileScale;
  tileHeight = tile1.height * tileScale;

  hTileWidth = tileWidth / 2;
  qTileHeight = tileHeight / 4;

  //iso tiles starting point
  originX = width / 2;
  originY = height / 4;

  //inverse matrix
  /*  A  B  offsetA
      C  D  offsetB */
  inverseDet = 1 / (2 * hTileWidth * qTileHeight);
  invA = qTileHeight * inverseDet;
  invB = hTileWidth * inverseDet;
  invC = -invA;
  invD = invB;
  offSetA = ( ((originX + hTileWidth) * qTileHeight) - (originY * hTileWidth) - (originX * hTileWidth) - (2 * hTileWidth * qTileHeight) ) * inverseDet;
  offSetB = ( -((originX + hTileWidth) * qTileHeight) - (originY * hTileWidth) + (originX * hTileWidth) + (2 * hTileWidth * qTileHeight) ) * inverseDet;
  gridMapping(gridSize);
}


function draw() {
  noSmooth();
  background(231, 231, 231);

  //lines for debug
  //line(0, originY, width, originY); // X axis
  //line(originX, 0, originX, height); // Y axis

  //image(tile1Grid, originX, originY, tileWidth, tileHeight)  draw tile on origin x,y

  let x = originX;
  let y = originY;

  //grid creation
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      //offset for tile drawing
      x = originX + (j-i) * hTileWidth;
      y = originY + (i+j) * qTileHeight;

      function mapGenerating() {
        switch (gridMap[i][j]) {
          case 0: image(tileNull, x, y, tileWidth, tileHeight);
          break;

          case 1: image(tile1Grid, x, y, tileWidth, tileHeight);
          break;
        }
      }

  //new drawTile with responsive ghost cursor but clunky
  function drawTile() {
    if (mouseGridX == gridX && mouseGridY == gridY) {
        if (gridMap[mouseGridY][mouseGridX] == 0) {
          image(tileGhost, x, y, tileWidth, tileHeight); //GhostTile for cursor //not optimized enough
          
          if (mouseIsPressed == true && mouseButton === LEFT) {
            gridMap[mouseGridY][mouseGridX] = 1;
          }
        } else if (gridMap[mouseGridY][mouseGridX] == 1) {
          image(tileGhost, x, y - tileHeight / 2, tileWidth, tileHeight); //GhostTile for cursor //not optimized enough
          
          if (mouseIsPressed == true && mouseButton === RIGHT) {
            gridMap[mouseGridY][mouseGridX] = 0;
          }
        }
    }
  }

      gridX = floor(x * invA + y * invB + offSetA + 1); // jesus christ why is + 1 magic number
      gridY = floor(x * invC + y * invD + offSetB);

      mouseGridX = floor((mouseX * invA  + mouseY * invB + offSetA));
      mouseGridY = floor((mouseX * invC + mouseY * invD + offSetB));
      
      mapGenerating();
      drawTile();

      //debug corners
      mouseGridXdb = (mouseX * invA  + mouseY * invB + offSetA);
      mouseGridYdb = (mouseX * invC + mouseY * invD + offSetB);
      text(`MouseX : ${mouseX}`, 50, 50)
      text(`MouseY : ${mouseY}`, 50, 70)
      text(`mouseGridX : ${mouseGridX}`, 50, 90)
      text(`mosueGridY : ${mouseGridY}`, 50, 110)
      text(`originX : ${originX}`, 50, 130)
      text(`originY : ${originY}`, 50, 150)
      text(`mouseGridXdb : ${mouseGridXdb}`, 50, 170)
      text(`mouseGridYdb : ${mouseGridYdb}`, 50, 190)
      text(`mouseIsPressed : ${mouseIsPressed}`, 50, 250)
    }
  }
}