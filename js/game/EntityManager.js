function EntityManager ( entityGroup )
{
	TileManager.call( this, '', entityGroup );
	this.outsideRange = 5;

	this.soilGroup = Global.game.add.group();
	this.soilGroup.createMultiple( 3*ROOM_WIDTH*ROOM_HEIGHT, 'soil', 0, false );

	this.cropInstances = [];

	this.updateTimer = getTime();
	this.updateFrequency = 0.11;
}


/* Tile generation */

EntityManager.prototype.getValue = function ( x, y )
{
	return noise.simplex2(x + this.seed[0], y + this.seed[1]) + noise.simplex2(x/8 - this.seed[0], y/8 - this.seed[1]);
};

EntityManager.prototype.generateTile = function ( x, y )
{
	if ( Math.abs(x) + Math.abs(y) < 4 ) {
		return TileTypes.None;
	}

	var value = this.getValue( x, y );

	if (value > 0.10 && value < 0.15) {
		if ( !Global.World.checkDirtAt( x, y ) ) {
			return TileTypes.Tree;
		}
	}

	if (value > -0.15 && value < -0.10) {
		if ( !Global.World.checkDirtAt( x, y ) ) {
			return TileTypes.Bush;
		}
	}

	return TileTypes.None;
};

EntityManager.prototype.addTree = function( x, y ) {
	var s = this.addSprite( x, y, 0 );
	s.loadTexture( 'tree' );
	s.anchor.set( 1/3, 3/4 );

	//var frames = pos.toIndex( this.tileset );
	//s.animations.add( 'idle', frames, 2.5, true );
	//s.animations.play( 'idle' );

	return s;
};

EntityManager.prototype.createTile = function( x, y ) {
	if ( this.isTile( x, y, TileTypes.Tree ) ) {
		this.addTree( x, y );
	}

	if ( this.isTile( x, y, TileTypes.Bush ) ) {
		var s = this.addSprite( x, y, 0 );
		s.loadTexture( 'bush' );
		s.frame = randInt(0,2);
		s.y -= TILE_SIZE/8;
		s.anchor.set( 1/3, 1/2 - 1/16 );
	}

	if ( this.getTile(x, y) instanceof Crop ) {
		var crop = this.addSpriteToGroup( this.group, x, y, 0 );
		var soil = this.addSpriteToGroup( this.soilGroup, x, y, 0 );
		this.getTile(x, y).init( crop, soil, x, y );
	}
};


/* World building */

EntityManager.prototype.checkCollisionAt = function ( x, y )
{
	return this.getTile(x,y) == TileTypes.Tree || this.getTile(x,y) == TileTypes.Bush;
};

EntityManager.prototype.clearOutOfView = function ()
{
	for ( var i = 0; i < this.group.children.length; i++ )
	{
		var s = this.group.children[i];
		if ( s.exists && !this.isInView( s.position.x, s.position.y ) )
		{
			if ( s.owner ) {
				s.owner.cropSprite = null;
				s.owner = null;
			}
			s.kill();
			this.activeSet.delete(s.pkey);
		}
	}

	for ( var i = 0; i < this.soilGroup.children.length; i++ )
	{
		var s = this.soilGroup.children[i];
		if ( s.exists && !this.isInView( s.position.x, s.position.y ) )
		{
			if ( s.owner ) {
				s.owner.soilSprite = null;
				s.owner = null;
			}
			s.kill();
			this.activeSet.delete(s.pkey);
		}
	}
};

EntityManager.prototype.loadArea = function ( worldX, worldY )
{
	TileManager.prototype.loadArea.call( this, worldX, worldY );

	this.soilGroup.sort( 'y', Phaser.Group.SORT_ASCENDING );
};


EntityManager.prototype.getCrop = function ( x, y )
{
	if ( this.getTile(x, y) instanceof Crop ) {
		return this.getTile(x, y);
	}
};

EntityManager.prototype.digCrop = function ( x, y )
{
	var p = [x,y];
	if ( this.tileMap[p] == TileTypes.None ) {

		var crop = new Crop();
		this.tileMap[p] = crop;
		this.cropInstances.push( crop );

		var key = x + "," + y;
		this.activeSet.delete(key);

		Global.Audio.play( 'digging_dirt' );
		return true;
	}
	return false;
};


EntityManager.prototype.update = function ()
{
	var time = getTime();
	if ( time > this.updateTimer ) {
		this.updateTimer = time + this.updateFrequency;
		
		for (var i = this.cropInstances.length - 1; i >= 0; i--) {
			this.cropInstances[i].update();
		}
	}
};

extend( TileManager, EntityManager );
