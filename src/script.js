var config = {
    type: Phaser.AUTO,
    scale: {
        mode:Phaser.Scale.FIT, // scala automaticamente
        autoCenter:Phaser.Scale.CENTER_BOTH, // centra automaticamente
        width:1000, // ancho de pantalla
        height:600,// alto de pantalla
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    }
};

var score = 0;
var scoreText;
var gameOver = false;
var level = 1;
var texLevel;
var btnL;
var btnR;
var btnP;
var btnRes;
var botonFull

var game = new Phaser.Game(config);

function preload() {
    this.load.image("sky", "assets/pixel.jpg"); 
    this.load.image("Plataforma", "assets/platform.png"); 
    this.load.image("star", "assets/agua.png"); 
    this.load.image("bomb", "assets/bomb.png");
    this.load.spritesheet("dude", "assets/avatar.png", {frameWidth: 250, frameHeight: 241}); 
    this.load.image("btnL", "assets/btnL.png");
    this.load.image("btnR", "assets/btnR.png");
    this.load.image("btnP", "assets/btnP.png");
    this.load.image("btnRes", "assets/btnRes.png");
    this.load.image("botonFullScreen","assets/pantalla.png");

}

function create() {
    gameOver = false;
    this.add.image(500, 215, "sky").setScale(1.6);
    
    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, "Plataforma").setScale(3.2).refreshBody();

    platforms.create(600, 400, "Plataforma").setTint(0x55ff88);
    platforms.create(50, 250, "Plataforma").setTint(0x55ff88);
    platforms.create(750, 220, "Plataforma").setTint(0x55ff88);

    player = this.physics.add.sprite(100, 450, "dude").setScale(0.2).refreshBody();

    player.setCollideWorldBounds(true);
    player.setBounce(0.2);

    this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 7}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: "turn",
        frames: [{ key: "dude", frame: 8 }],
        frameRate: 20
    });

    this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", { start: 9, end: 16}),
        frameRate: 10,
        repeat: -1
    });

    /*player.body.setGravityY(300);*/

    this.physics.add.collider(player, platforms);

    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: "star",
        repeat: 12,
        setXY: {x: 100, y:0, stepX: 65}
    })

    stars.children.iterate(function(child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.6))
    })

    this.physics.add.collider(stars, platforms);

    this.physics.add.overlap(player, stars, collectStar, null, true);

    scoreText = this.add.text(16, 16, "Score: 0", {fontSize: "32px Arial Black", fill: "#000"});

    texLevel = this.add.text(16, 64, "Level: 0", {fontSize: "32px Arial Black", fill: "#000"});

    bombs = this.physics.add.group();

    this.physics.add.collider(bombs, platforms);

    this.physics.add.collider(player, bombs, hitBomb, null, this);

    //Botones
    btnL = this.add.image(100, 555, "btnL").setScale(1.3).setInteractive();
    btnR = this.add.image(200, 555, "btnR").setScale(1.3).setInteractive();
    btnP = this.add.image(800, 560, "btnP").setScale(0.7);
    btnP.setInteractive().on("pointerdown", function() {
        if(player.body.touching.down) {
            player.setVelocityY(-330);
        }
    });
btnL.on("pointerdown", ()=>{
    cursors.left.isDown = true;
}
),
btnL.on("pointerup", ()=>{
    cursors.left.isDown = false;
}
),
btnL.on("dragend", ()=>{
    cursors.left.isDown = false;
}
),
btnR.on("pointerdown", ()=>{
    cursors.right.isDown = true;
}
),
btnR.on("pointerup", ()=>{
    cursors.right.isDown = false;
}
),
btnR.on("dragend", ()=>{
    cursors.right.isDown = false;
});
btnRes = this.add.image(500, 300, "btnRes");
btnRes.setVisible(false);
btnRes.on("pointerdown", ()=> this.scene.restart());

let botonFull=this.add.image(500,570,"botonFullScreen").setScale(0.4);// agregamos una imagen
// decirle a la imagen boton que sea interactiva osea clickeable 
//que compruebe si se hace click en el boton pone el juego en pantalla completa
       botonFull.setInteractive().on("pointerdown",function() {
        if(this.scene.scale.isFullscreen==false) {
            this.scene.scale.startFullscreen();
        }
        else {
            this.scene.scale.stopFullscreen();
        }
        
       })

}


function update() {

    if(gameOver){
        return
    }

    if(cursors.left.isDown) {
        player.setVelocityX(-180);

        player.anims.play("left", true);
    }else if(cursors.right.isDown) {
        player.setVelocityX(180);

        player.anims.play("right", true);
    }else {
        player.setVelocityX(0);

        player.anims.play("turn");
    }

    if(cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }




}

function collectStar(player, star){
    star.disableBody(true, true);

    score += 10;
    scoreText.setText("Score: " + score);

    texLevel.setText("Level: " + level);

    if(stars.countActive(true) === 0) {
        
        stars.children.iterate(function(child){
            child.enableBody(true, child.x, 0, true, true)
        })
        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        
    var bomb = bombs.create(x, 16, "bomb");
    level += 1;
    bomb.setScale(0.3);
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-250, 250), 20);

    }

    

}

function hitBomb(player, bomb) {
     this.physics.pause();
     level = 0;

     player.setTint(0xff0000);

     player.anims.play("turn");

     gameOver = true;
     btnRes.setVisible(true);
     btnRes.setInteractive();
}