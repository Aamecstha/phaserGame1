
let gameScene= new Phaser.Scene('Game')

let config={
    type:Phaser.AUTO,
    width:640,
    height:360,
    scene: gameScene
}

let game=new Phaser.Game(config)

gameScene.init=function(){
    this.playerSpeed=3.5
    this.enemySpeed=2
    this.enemyMaxY=320
    this.enemyMinY=40
}

gameScene.preload=function(){
    this.load.image('background','assets/konoha.jpg')
    this.load.image('player',"assets/Shady.png")
    this.load.image('enemy',"assets/enemy.png")
    this.load.image('chest',"assets/chest.png")
}

gameScene.create=function(){
    let bg=this.add.sprite(0,0,'background')
    // bg.setOrigin(0,0)

    this.player=this.add.sprite(40,this.sys.game.config.height / 2,'player')
    this.player.setScale(0.1)

    this.treasure=this.add.sprite(this.sys.game.config.width-80,this.sys.game.config.height/2,"chest")
    this.treasure.setScale(0.6)

    this.enemies=this.add.group({
        key:'enemy',
        repeat:3,
        setXY:{
            x:110,
            y:100,
            stepX:130,
            stepY:20
        }
    })
    Phaser.Actions.ScaleXY(this.enemies.getChildren(),-0.9,-0.9)
    
    //set speeds
    Phaser.Actions.Call(this.enemies.getChildren(),function(enemy){
        enemy.speed=Math.random()*2+1
    },this)

    this.isPlayerAlive=true

    //reset camera effects
    this.cameras.main.resetFX()
}

gameScene.update=function(){
    //only if the player is alive
    if(!this.isPlayerAlive){
        return
    }

    if(this.input.activePointer.isDown){
        this.player.x+=this.playerSpeed
    }

    //treasure collision
    if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(),this.treasure.getBounds())){
        this.gameOver()
    }

    //enemy movement and collision
    let enemies=this.enemies.getChildren()
    let numEnemies=enemies.length

    for(let i=0;i<numEnemies;i++){
        //move enemies
        enemies[i].y+=enemies[i].speed

        //reverse movement if reaches edges
        if(enemies[i].y>=this.enemyMaxY && enemies[i].speed>0){
            enemies[i].speed*=-1
        }
        else if(enemies[i].y<=this.enemyMinY && enemies[i].speed <0){
            enemies[i].speed*=-1
        }

        //enemy collision
        if(Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(),enemies[i].getBounds())){
            this.gameOver()
            break
        }
    }
}

gameScene.gameOver=function(){
    console.log("game gober!!!!")
    this.isPlayerAlive=false
    //shake the camera
    this.cameras.main.shake(500)

    //fade camera
    this.time.delayedCall(250,function(){
        this.cameras.main.fade(250)
    },[],this)

    //restart game
    this.time.delayedCall(500,function(){
        this.scene.restart()
    },[],this)
    
}