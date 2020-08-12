
window.onload = function() {

  console.info("Page loaded");

  var canvas = document.querySelector(".canvas");

  var w = canvas.width;
  var h = canvas.height;

  var ctx = canvas.getContext("2d");

  var nFrames = 0;

  function randColor() {

    var color = "rgba(" +
      parseInt(Math.random() * 255 + 1) + "," +
      parseInt(Math.random() * 255 + 1) + "," +
      parseInt(Math.random() * 255 + 1) + ",1)";

    return color;
  }

  //==========================================================================
  // Block class
  //==========================================================================
  class Block {

    constructor(x, y, vx, vy, width, height, color) {
      this.x0 = x;
      this.x1 = x + width;
      this.y0 = y;
      this.y1 = y + height;
      this.vx = vx;
      this.vy = vy;
      this.color = color;
    }


    paint() {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x0, this.y0, this.x1 - this.x0, this.y1 - this.y0);
    }

    report() {
      return "coord = ("+this.x0+","+this.y0+") vel = ("+this.vx+","+this.vy+")";
    }

    add(vx, vy) {
      this.x0 += vx;
      this.x1 += vx;
      this.y0 += vy;
      this.y1 += vy;
    }


    static intersect(block1, block2) {

      var x;
      var y;

      var coordinates = [
        [block1.x0,block1.y0],
        [block1.x0,block1.y1],
        [block1.x1,block1.y0],
        [block1.x1,block1.y1]];

      for(var i=0; i < coordinates.length; i++) {

        x = coordinates[i][0];

        y = coordinates[i][1];

        if(x >= block2.x0 && x <= block2.x1 &&
           y >= block2.y0 && y <= block2.y1) {
          return true;
        }
      }
      return false;
    }

    static copy(other) {

      return new Block(other.x0, other.y0,
                       other.vx, other.vy,
                       other.x1 - other.x0, other.y1 - other.y0,
                       other.color);
    }

  };

  //==========================================================================
  // HorizontalWall class
  //==========================================================================
  class HorizontalWall extends Block {

    constructor(x,y) {
      var width = 50;
      var height = 10;
      var color = "rgba(128,0,0,1)";
      super(x,y,0,0,width,height,color);
    }
  };

  //==========================================================================
  // VerticalWall class
  //==========================================================================
  class VerticalWall extends Block {

    constructor(x,y) {
      var width = 10;
      var height = 50;
      var color = "rgba(128,0,0,1)";
      super(x,y,0,0,width,height,color);
    }
  };

  //==========================================================================
  // Player class
  //==========================================================================
  class Player {

    constructor(x,y,map) {

      var vx = 15;
      var vy = 15;
      var width = 50;
      var height = 30;
      var color = "rgba(0,0,139,1)";

      this.block = new Block(x, y, vx, vy, width, height, color);

      this.map = map;
    }

    paint() {
      this.block.paint();
    }

    report() {
      this.block.report();
    }

    add(vx,vy) {
      this.block.add(vx,vy);
    }

    couldMove(newBlock) {

      for(var i=0; i < this.map.length; i++) {
        if(Block.intersect(newBlock, this.map[i])) {
          return false;
        }
      }
      return true;
    }

    right() {
      var newBlock = Block.copy(this.block);
      newBlock.add(this.block.vx, 0);
      if(newBlock.x1 <= w && this.couldMove(newBlock)) {
        this.block = newBlock;
      }
    }

    left() {
      var newBlock = Block.copy(this.block);
      newBlock.add(-this.block.vx, 0);
      if(newBlock.x0 >= 0 && this.couldMove(newBlock)) {
        this.block = newBlock;
      }
    }

    up() {
      var newBlock = Block.copy(this.block);
      newBlock.add(0, -this.block.vy);
      if(newBlock.y0 >= 0 && this.couldMove(newBlock)) {
        this.block = newBlock;
      }
    }

    down() {
      var newBlock = Block.copy(this.block);
      newBlock.add(0, this.block.vy);
      if(newBlock.y1 <= h && this.couldMove(newBlock)) {
        this.block = newBlock;
      }
    }

  };


  var obstacles = [];

  // x,y
  var horizontalCoordinates = [[10,20],[150,120],[200,300]];

  horizontalCoordinates.forEach(function(e) {
    obstacles.push(new HorizontalWall(e[0],e[1]));
  });

  var verticalCoordinates = [[210,20],[50,220],[300,200]];

  verticalCoordinates.forEach(function(e) {
    obstacles.push(new VerticalWall(e[0], e[1]));
  });

  var player = new Player(10,50,obstacles);

  document.addEventListener("keydown", function(event) {

    event.preventDefault();

    console.log(event.keyCode);

    switch(event.keyCode) {

      case 38: // up arrow
        player.up();
        break;
      case 40: // down arrow
        player.down();
        break;
      case 37: // left arrow
        player.left();
        break;
      case 39: // right arrow
        player.right();
        break;
      default:
    }

  });

  var update = function() {

    ctx.font = "Consolas MS";
    ctx.fillStyle = "rgba(0,0,128,1)";
    ctx.fillText("@ Javier Felipe Toribio 2020", 10, 10);
    ctx.fillText("Frames : " + nFrames, 10, 20);

    player.paint();

    console.info(player.report());

    obstacles.forEach(function(e) {
      e.paint();
    });
  }

  var start = function() {

    ctx.fillStyle = "rgba(245,245,220,1)";
    ctx.fillRect(0,0,w,h);

    update();

    ++nFrames;

    requestAnimationFrame(start);
  }

  start();
}
