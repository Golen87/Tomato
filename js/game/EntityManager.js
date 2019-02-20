function EntityManager ( entityGroup )
{
	TileManager.call( this, '', entityGroup );
	this.outsideRange = 5;

	//this.soilGroup = Global.game.add.group();
	this.group.createMultiple( 3*ROOM_WIDTH*ROOM_HEIGHT, '', 0, false );

	this.cropInstances = [];

	this.updateTimer = getTime();
	this.updateFrequency = 0.11;
}


/* Tile generation */

EntityManager.prototype.getValue = function ( x, y )
{
	return noise.perlin2(x + this.seed[0], y + this.seed[1]) + noise.perlin2(x/8 - this.seed[0], y/8 - this.seed[1]);
};

EntityManager.prototype.generateTile = function ( x, y )
{
	var value = this.getValue( x, y );
	var terrain = Global.World.getTerrain( x, y );

	if ( Math.abs(x) + Math.abs(y) >= 4 ) {

		if (value > 0.10 && value < 0.15) {
			if ( terrain != TileTypes.Water ) {
				return TileTypes.Tree;
			}
		}

		if (value > -0.15 && value < -0.10) {
			if ( terrain != TileTypes.Water ) {
				return TileTypes.Bush;
			}
		}
	}

	if (value > -0.40 && value < -0.20) {
		if ( terrain == TileTypes.Grass ) {
			return TileTypes.Shrub;
		}
	}

	if (value > -0.10 && value < 0.10) {
		if ( terrain == TileTypes.Dirt ) {
			return TileTypes.Crop;
		}
	}

	return TileTypes.None;
};

EntityManager.prototype.addTree = function( x, y ) {
	var s = this.addSprite( x, y, 0 );
	s.loadTexture( 'tree' );
	//s.anchor.set( 1/3, 3/4 );
	s.y += TILE_SIZE/8;
	s.anchor.set( 1/3, 3/4 + 1/16 );

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
		s.frame = randInt( 0, 2 );
		s.y -= TILE_SIZE/8;
		s.anchor.set( 1/3, 1/2 - 1/16 );
	}

	if ( this.isTile( x, y, TileTypes.Shrub ) ) {
		var s = this.addSprite( x, y, 0 );
		s.loadTexture( 'shrub' );
		s.frame = randInt( 0, 5 );
		s.y -= TILE_SIZE/8;
		s.anchor.set( 0, 1/2 - 1/16 );
	}

	if ( this.getTile(x, y) instanceof Crop ) {
		var crop = this.addSpriteToGroup( this.group, x, y, 0 );
		var soil = this.addSpriteToGroup( this.group, x, y, 0 );
		this.getTile(x, y).init( crop, soil, x, y );
	}
	else if ( this.isTile( x, y, TileTypes.Crop ) ) {
		var p = [x,y];
		var crop = new Crop();
		crop.setSoilType( [Soils.Weed_1, Soils.Weed_2, Soils.Weed_3].choice(), getTime() );
		this.tileMap[p] = crop;
		this.cropInstances.push( crop );

		var crop = this.addSpriteToGroup( this.group, x, y, 0 );
		var soil = this.addSpriteToGroup( this.group, x, y, 0 );
		this.getTile(x, y).init( crop, soil, x, y );
	}
};


/* World building */

EntityManager.prototype.checkCollisionAt = function ( x, y )
{
	return this.getTile(x,y) == TileTypes.Tree || this.getTile(x,y) == TileTypes.Bush;
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
