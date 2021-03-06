function World () {}

World.prototype.create = function ()
{
	Global.game.world.setBounds( -Infinity, -Infinity, Infinity, Infinity );
	//Global.game.world.setBounds( -10, -10, 10, 10 );

	this.helpGrid = Global.game.add.tileSprite( -TILE_SIZE, -TILE_SIZE, (ROOM_WIDTH+2) * TILE_SIZE, (ROOM_HEIGHT+2) * TILE_SIZE, 'tile' );
	this.helpGrid.tint = 0;
	this.helpGrid.alpha = 0.1;

	this.entityGroup = Global.game.add.group();
	this.bubbleGroup = Global.game.add.group();

	this.Player = new Player();
	this.Player.create(
		0, 0,
		this.entityGroup
	);

	this.terrainManager = new TerrainManager();
	this.entityManager = new EntityManager( this.entityGroup );

	this.camGoal = new Phaser.Point();
	this.camGoal.x = -SCREEN_WIDTH/2;
	this.camGoal.y = -SCREEN_HEIGHT/2;
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

	this.terrainManager.loadArea( this.camGoal.x, this.camGoal.y );
	this.entityManager.loadArea( this.camGoal.x, this.camGoal.y );
};

World.prototype.update = function ()
{
	this.Player.update();

	this.entityManager.update();

	this.entityGroup.sort( 'y', Phaser.Group.SORT_ASCENDING );


	/* Camera */

	if ( this.Player.goal.x + TILE_SIZE/2 > this.camGoal.x + SCREEN_WIDTH - TILE_SIZE ) {
		//console.log(this.Player.goal.x);
		this.camGoal.x += TILE_SIZE * (ROOM_WIDTH/2);
	}
	if ( this.Player.goal.x + TILE_SIZE/2 < this.camGoal.x + TILE_SIZE ) {
		this.camGoal.x -= TILE_SIZE * (ROOM_WIDTH/2);
	}
	if ( this.Player.goal.y + TILE_SIZE/2 > this.camGoal.y + SCREEN_HEIGHT - TILE_SIZE ) {
		this.camGoal.y += TILE_SIZE * (ROOM_HEIGHT/2);
	}
	if ( this.Player.goal.y + TILE_SIZE/2 < this.camGoal.y + 2*TILE_SIZE ) {
		this.camGoal.y -= TILE_SIZE * (ROOM_HEIGHT/2);
	}

	var fac = 1 - Math.pow( 0.75, Global.game.time.elapsed * 0.06 );
	this.camPos.x += ( this.camGoal.x - this.camPos.x ) * fac;
	this.camPos.y += ( this.camGoal.y - this.camPos.y ) * fac;

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
		this.terrainManager.loadArea( this.camGoal.x, this.camGoal.y );
		this.entityManager.loadArea( this.camGoal.x, this.camGoal.y );
	}

	this.prevCamPos.x = this.camPos.x;
	this.prevCamPos.y = this.camPos.y;


	this.helpGrid.x = (Global.game.camera.x.grid()-1) * TILE_SIZE;
	this.helpGrid.y = (Global.game.camera.y.grid()-1) * TILE_SIZE;


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
};

World.prototype.pause = function ( isPaused )
{
	this.Player.sprite.animations.paused = isPaused;
}

World.prototype.cameraShake = function ( value )
{
	this.shake = Math.max( Math.round(value), this.shake );
};


World.prototype.getTerrain = function ( x, y )
{
	return this.terrainManager.getTile( x, y );
};

World.prototype.checkCollision = function ( x, y )
{
	if ( this.entityManager.checkCollisionAt( x, y ) )
		return true;

	if ( this.terrainManager.getTile( x, y ) == TileTypes.Water )
		return true;

	return false;
};

World.prototype.getCropAt = function ( x, y )
{
	return this.entityManager.getCrop( x, y );
};


World.prototype.waterCrop = function ( x, y )
{
	var crop = this.entityManager.getCrop( x, y );
	if ( crop ) {
		return crop.waterCrop();
	}
	return false;
};

World.prototype.cutCrop = function ( x, y )
{
	var crop = this.entityManager.getCrop( x, y );
	if ( crop ) {
		return crop.cutCrop();
	}
	return false;
};

World.prototype.digCrop = function ( x, y )
{
	var crop = this.entityManager.getCrop( x, y );
	if ( crop ) {
		return crop.digCrop();
	}

	if ( this.getTerrain( x, y ) == TileTypes.Dirt ) {
		if ( this.entityManager.digCrop( x, y ) ) {
			this.entityManager.loadArea( this.camGoal.x, this.camGoal.y );
			return true;
		}
	}
	return false;
};

World.prototype.plantCrop = function ( x, y, cropData )
{
	var crop = this.entityManager.getCrop( x, y );
	if ( crop ) {
		return crop.plantCrop( cropData );
	}
	return false;
};
