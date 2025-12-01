class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootgame");
    }

    preload() {
    //Load tilemap from map.json file
    this.load.tilemapTiledJSON('map', 'assets/map.json');

    //Load tileset image as 'tiles'
    this.load.image('tiles', 'assets/tileset.png');

    //Load character spritesheet
    this.load.spritesheet('player', 'assets/player.png', {
        frameWidth: 32,
        frameHeight: 32
    });

    //Load coins spritesheet
    this.load.spritesheet('coin', 'assets/coin.png',{
        frameWidth: 32,
        frameHeight: 32
    });
}

    create() {
            // --- TILEMAP SETUP ---
        //Creates the map using the json file loaded as 'map'
        const map = this.make.tilemap({ key: 'map' });

        //Creates the tileset using 'dungeon' as key(name of tileset) and 'tiles' as the image(loaded before)
        const tileset = map.addTilesetImage('dungeon', 'tiles');

        //Creates layers from the tilemap
        const groundLayer = map.createLayer('Ground', tileset, 0, 0);
        const wallLayer   = map.createLayer('Walls', tileset, 0, 0);

        //Enables collision for the walls which have collides property set as true
        wallLayer.setCollisionByProperty({ collides: true });
            //------------------------

        //Creates instance of the character
        this.player = this.physics.add.sprite(300, 300, 'player');

        //Enables arrow keys input
        this.cursors = this.input.keyboard.createCursorKeys();

        //Collisions bw player and the layer of the walls with collisions enabled
        this.physics.add.collider(this.player, wallLayer);

        //World bounds match the map size
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.player.setCollideWorldBounds(true);

        //    ------SCORING------
        this.score=0;
        this.highScore=localStorage.getItem('highScore') || 0;

        this.scoreText=this.add.text(980,450,'Score: 0',{
            fontSize:'20px',
            fill:'#000000ff',
        })
        this.highScoreText=this.add.text(980,480,'High Score: ' + this.highScore,{
            fontSize:'20px',
            fill:'##000000ff',
        })
        this.scoreText.setScrollFactor(0);
        this.highScoreText.setScrollFactor(0);
        //    -----------------

        //     ------COINS------
        //Animation for the coins
        this.anims.create({
            key: 'spin',
            frames: this.anims.generateFrameNumbers('coin', {start: 0, end: 7}),
            frameRate: 8,
            repeat: -1
        });

        //Makes group called coins
        this.coins = this.physics.add.group({
             allowGravity: false
        });
        //Checks if random location is a wall/obstacle
        for(let i=0;i<20;i++){
            let x,y,tile;
            do{
                x=Phaser.Math.Between(0,map.widthInPixels);
                y=Phaser.Math.Between(0,map.heightInPixels);
                tile=wallLayer.getTileAtWorldXY(x,y);
            }while(tile && tile.properties.collides);
            let coin=this.coins.create(x,y,'coin');
            coin.play('spin');
        }
        //To detect collision between player and coin(of group coins)
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        //    ------------

        //    ----ANIMATIONS------
        //Walk Down
        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
            frameRate: 8,
            repeat: -1
        });

        // Walk Left
        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        // Walk Right
        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
            frameRate: 8,
            repeat: -1
        });

        // Walk Up
        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
            frameRate: 8,
            repeat: -1
        });

    }

    update() {
        const speed = 150;

        //Reset movement each frame
        this.player.setVelocity(0);

        //  ---- MOVEMENT LOGIC ----
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.anims.play('walk-left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
            this.player.anims.play('walk-right', true);
        }
        else if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
            this.player.anims.play('walk-up', true);
        }
        else if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
            this.player.anims.play('walk-down', true);
        }
        else {
            //Stop animation when idle
            this.player.anims.stop();
        }
    }
    //function to remove coin when collision is there and update score
    collectCoin(player, coin) {
        coin.destroy();  
        this.score+=10;
        this.scoreText.setText('Score: '+this.score);

        if(this.score > this.highScore){
            this.highScore=this.score;
            this.highScoreText.setText('High Score: '+this.highScore);

            localStorage.setItem('highScore',this.highScore);
        }
    }
}
