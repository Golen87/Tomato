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

EntityManager.prototype.getNoise = function ( x, y )
{
	return 0.5 + noise.perlin2(0.5+x*2.1, 0.5+y*2.1) / 2;
};

EntityManager.prototype.blueCheck = function ( x, y, r )
{
	var max = -1;
	r = Math.round(r);
	for ( var dx = x-r; dx <= x+r; dx++ ) {
		for ( var dy = y-r; dy <= y+r; dy++ ) {
			var value = this.getNoise( dx, dy );
			if ( value > max ) {
				max = value;
			}
		}
	}

	return ( this.getNoise( x, y ) == max );
};

EntityManager.prototype.generateTile = function ( x, y )
{
	var value = this.getNoise( x, y );
	var terrain = Global.World.getTerrain( x, y );

	if ( Math.abs(x) + Math.abs(y) >= 3 ) {
		if ( terrain != TileTypes.Water ) {

			var radius = (terrain == TileTypes.Grass) ? 1 : 2;
			if ( this.blueCheck(x,y,radius) ) {
				if ( this.getNoise( x+100, y ) < 0.5 ) {
					return TileTypes.Tree;
				}
				else {
					return TileTypes.Bush;
				}
			}

		}
	}

	if ( terrain == TileTypes.Grass ) {
		if ( this.blueCheck(x+50,y,value+0.1) ) {
			return TileTypes.Shrub;
		}
	}

	if ( terrain == TileTypes.Dirt ) {
		if ( this.blueCheck(x+50,y,value+0.1) ) {
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
		s.y -= TILE_SIZE/4;
		s.anchor.set( 0, 1/2 - 1/8 );
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
