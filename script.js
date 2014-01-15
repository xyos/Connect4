var Game = (function(){
  // This defines our grid's size and the size of each of its tiles
  var board_grid = {
    width: 7,
    height: 7,
    tile: {
      width: 32,
      height: 32
    },
    score_board: {
      height: 50
    }
  };
  // The total width of the game screen. Since our grid takes up the entire screen
  // this is just the width of a tile times the width of the grid
  var width = function() {
    return board_grid.width * board_grid.tile.width;
  };
  // The total height of the game screen. Since our grid takes up the entire screen
  // this is just the height of a tile times the height of the grid
  var height = function() {
    return board_grid.height * board_grid.tile.height + board_grid.score_board.height;
  };
  // Initialize and start our game
  var start = function() {
    // Start crafty and set a background color so that we can see it's working
    Crafty.init(width(),height());
    Crafty.background('rgb(249, 223, 225)');
    Crafty.scene('Loading');
  };

  Crafty.c('Actor', {
    init: function(){
      this.requires('2D, Canvas, Grid');
    }
  });

  Crafty.c('Player',{
    init: function(){
      this.position = 0;
      this.requires('Actor, Solid, Keyboard');
      // moves the currently selected player's token
      this.moveSelf = function(pos){
        if((this.position === 0 && pos < 0)
          || (this.position === board_grid.width - 1 && pos > 0)){
          console.log('left');
        } else {
          this.shift((pos * board_grid.tile.width),0,0,0);
          this.position += pos;
        }
      }
      // evaluates the keyboard input
      this.evalKey = function(){
        if (this.isDown('DOWN_ARROW')){
          this.toggleTurn();
          // TODO: add method to this
        } else if (this.isDown('LEFT_ARROW')){
          this.moveSelf(-1);
        } else if (this.isDown('RIGHT_ARROW')){
          this.moveSelf(1)
        }
      };
      this.bind('KeyDown', function(){
        this.evalKey();
      });
      this.toggleTurn = function(){
        this.destroy();
        Crafty.trigger('TurnEnded', this);
      }
    }
  });
  Crafty.c('Player1',{
    init: function(){
      this.requires('Player, spr_blue');
    }
  });
  Crafty.c('Player2',{
    init: function(){
      this.requires('Player, spr_red');
    }
  });

  // Game scene
  // ----------
  // runs the core game-loop
  Crafty.scene('Game',function(){
    // a 2d array to represent the board
    this.board = new Array(board_grid.width);
    for(var x = 0; x < board_grid.width; x++){
      this.board[x] = new Array(board_grid.height);
      for(var y = 0; y < board_grid.height; y++){
        this.board[x][y] = false;
      }
    }
    this.player = Crafty.e('Player1');
    // we evaluate the winning condition here
    this.victory = this.bind('TurnEnded',function(player){
      console.log(player);
      this.player = Crafty.e('Player2');
    });
    //this.board.
    console.log('game');
  }, function(){
    this.unbind('TurnEnded',this.victory);
  });
  // Loading scene
  // -------------
  // takes care of loading the sprites
  Crafty.scene('Loading',function(){
    Crafty.load(['img/blue.png','img/red.png'],function(){
      Crafty.sprite(32,'img/blue.png',{
        spr_blue: [0,0]
      });
      Crafty.sprite(32,'img/red.png',{
        spr_red: [0,0]
      });
      // draw some text if the request takes for too long
      Crafty.e('2D, DOM, Text')
        .attr({ x: 0, y: height() / 2 - 24, w: width() })
        .text('Loading...');
      Crafty.scene('Game');
    });
  });
  start()
})();
