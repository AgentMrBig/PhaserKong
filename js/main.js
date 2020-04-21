// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function () {
  // player parameters
  this.playerSpeed = 150;
  this.jumpSpeed = -600;

  // world limits
  this.gameWidth = 600;
  this.gameHeight = 800;
};

// load asset files for our game
gameScene.preload = function () {
  // load images
  this.load.image('ground', 'assets/images/ground.png');
  this.load.image('platform', 'assets/images/platform.png');
  this.load.image('block', 'assets/images/block.png');
  this.load.image('goal', 'assets/images/gorilla3.png');
  this.load.image('barrel', 'assets/images/barrel.png');

  // load spritesheets
  this.load.spritesheet('player', 'assets/images/player_spritesheet.png', {
    frameWidth: 28,
    frameHeight: 30,
    margin: 1,
    spacing: 1,
  });

  this.load.spritesheet('fire', 'assets/images/fire_spritesheet.png', {
    frameWidth: 20,
    frameHeight: 21,
    margin: 1,
    spacing: 1,
  });
};

// executed once, after assets were loaded
gameScene.create = function () {
  // world bounds
  this.physics.world.bounds.width = this.gameWidth;
  this.physics.world.bounds.height = this.gameHeight;

  this.platforms = this.add.group();
  // ground
  let ground = this.add.sprite(180, 400, 'ground');
  this.physics.add.existing(ground, true);
  this.platforms.add(ground);

  // platform
  let platform = this.add.tileSprite(180, 300, 3 * 36, 1 * 30, 'block');
  this.physics.add.existing(platform, true);
  this.platforms.add(platform);

  // player
  this.player = this.add.sprite(180, 250, 'player', 3);
  this.physics.add.existing(this.player);

  // constrain player to game bounds
  this.player.body.setCollideWorldBounds(true);

  // walking animation
  this.anims.create({
    key: 'walking',
    frames: this.anims.generateFrameNames('player', {
      frames: [0, 1, 2],
    }),
    frameRate: 12,
    yoyo: true,
    repeat: -1,
  });

  //ground.body.allowGravity = false;

  // make it immovable
  //ground.body.immovable = true;

  // 2 creating and adding sprites to the physics system at one time
  //let ground2 = this.physics.add.sprite(180, 200, 'ground');

  // collision detection
  this.physics.add.collider(this.player, this.platforms);

  // enable cursor keys
  this.cursors = this.input.keyboard.createCursorKeys();
};

// executed on every frame
gameScene.update = function () {
  // are we on the ground?
  let onGround =
    this.player.body.blocked.down || this.player.body.touching.down;

  if (this.cursors.left.isDown) {
    this.player.body.setVelocityX(-this.playerSpeed);

    this.player.flipX = false;

    if (onGround && !this.player.anims.isPlaying) {
      this.player.anims.play('walking');
    }
  } else if (this.cursors.right.isDown) {
    this.player.body.setVelocityX(this.playerSpeed);

    this.player.flipX = true;

    // play animation if none is playing
    if (onGround && !this.player.anims.isPlaying) {
      this.player.anims.play('walking');
    }
  } else {
    this.player.body.setVelocityX(0);

    // stop walking animation
    this.player.anims.stop('walking');
    // set default frame
    if (onGround) {
      this.player.setFrame(3);
    }
  }

  // handle jumping
  if (onGround && (this.cursors.space.isDown || this.cursors.up.isDown)) {
    // give the player a velocity in y
    this.player.body.setVelocityY(this.jumpSpeed);

    // stop the walking animation
    this.player.anims.stop('walking');

    // change the frame
    this.player.setFrame(2);
  }
};

// our game's configuration
let config = {
  type: Phaser.AUTO,
  width: 600,
  height: 800,
  scene: gameScene,
  title: 'Monster Kong',
  pixelArt: false,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1000 },
      debug: true,
    },
  },
};

// create the game, and pass it the configuration
let game = new Phaser.Game(config);
