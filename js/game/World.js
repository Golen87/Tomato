function World () {}

World.prototype.create = function ()
{
	Global.game.world.setBounds( -Infinity, -Infinity, Infinity, Infinity );
	//Global.game.world.setBounds( -10, -10, 10, 10 );

	this.tileBg = Global.game.add.tileSprite( 0, 0, ROOM_WIDTH * TILE_SIZE, ROOM_HEIGHT * TILE_SIZE, 'tile' );
	this.tileBg.alpha = 0.1;

	this.entityGroup = Global.game.add.group();
	this.bubbleGroup = Global.game.add.group();

	this.Player = new Player();
	this.Player.create(
		0, 0,
		this.entityGroup
	);

	/*

	this.landManager = new LandManager();
	this.enemyManager = new EnemyManager();
	this.cloudManager = new CloudManager();

	this.camGoal = new Phaser.Point();
	this.camGoal.x = 0;
	this.camGoal.y = 0;
	this.camPos = new Phaser.Point();
	this.camPos.x = this.camGoal.x;
	this.camPos.y = this.camGoal.y;
	this.prevCamPos = new Phaser.Point();
	this.prevCamPos.x = this.camGoal.x;
	this.prevCamPos.y = this.camGoal.y;
	Global.game.camera.x = this.camGoal.x;
	Global.game.camera.y = this.camGoal.y;

	Global.game.camera.y = Math.round( this.camPos.y );
	this.shake = 0;
	this.prevShakeDir = [0,0];

	Global.game.camera.x = Math.round( this.camPos.x );

	this.landManager.loadArea( this.camGoal.x, this.camGoal.y );
	this.enemyManager.loadArea( this.camGoal.x, this.camGoal.y );
	this.cloudManager.loadArea( this.camGoal.x, this.camGoal.y );

	this.Player.updateCount();
	*/
};

World.prototype.update = function ()
{
	this.Player.update();

	//this.entityGroup.sort( 'y', Phaser.Group.SORT_ASCENDING );


	/* Camera */
	/*

	//var fac = 1 - Math.pow( 0.75, Global.game.time.elapsed * 0.06 );
	//this.camPos.x += ( this.camGoal.x - this.camPos.x ) * fac;
	//this.camPos.y += ( this.camGoal.y - this.camPos.y ) * fac;

	this.camPos.x = this.Player.sprite.position.x - SCREEN_WIDTH/2;
	this.camPos.y = this.Player.sprite.position.y - SCREEN_HEIGHT/2;

	var d = this.camPos.distance( this.camGoal );
	if ( d < 1 && d != 0 )
	{
		this.camPos.x = this.camGoal.x;
		this.camPos.y = this.camGoal.y;
	}
	//this.camPos.x += ( this.camGoal.x - this.camPos.x ).clamp(-2,2);
	//this.camPos.y += ( this.camGoal.y - this.camPos.y ).clamp(-2,2);

	Global.game.camera.x = Math.round( this.camPos.x );
	Global.game.camera.y = Math.round( this.camPos.y );

	if (!this.prevCamPos.equals(this.camPos)) {
		this.landManager.loadArea( this.camGoal.x, this.camGoal.y );
		this.enemyManager.loadArea( this.camGoal.x, this.camGoal.y );
		this.cloudManager.loadArea( this.camGoal.x, this.camGoal.y );
	}

	this.prevCamPos.x = this.camPos.x;
	this.prevCamPos.y = this.camPos.y;


	this.oceanBg.x = 16 * Math.round(this.camPos.x / 16) - 16;
	this.oceanBg.y = 16 * Math.round(this.camPos.y / 16) - 16;
	this.oceanBg.x += 1.1 * Math.sin( 0.7 * Global.game.time.totalElapsedSeconds() * Math.PI );

	this.helpGrid.x = this.Player.sprite.goalX - SCREEN_WIDTH/2;
	this.helpGrid.y = this.Player.sprite.goalY - SCREEN_HEIGHT/2;


	if ( this.shake > 0 )
	{
		do
		{
			var dir = Math.random() * 2 * Math.PI;
			var sx = Math.round( Math.sin(dir) * Math.ceil( this.shake/4 ) );
			var sy = Math.round( Math.cos(dir) * Math.ceil( this.shake/4 ) );
		}
		while ( this.prevShakeDir[0] == sx && this.prevShakeDir[1] == sy )
		this.prevShakeDir = [sx, sy];

		Global.game.camera.x += sx;
		Global.game.camera.y += sy;

		this.shake -= 1;
	}
	*/
};

World.prototype.pause = function ( isPaused )
{
	this.Player.sprite.animations.paused = isPaused;
}


World.prototype.checkCollision = function ( x, y )
{
	return false;
	//return this.landManager.checkLandAt( x, y );
};

World.prototype.cameraShake = function ( value )
{
	this.shake = Math.max( Math.round(value), this.shake );
};
