function LandManager ()
{
	TileManager.call( this, 'ground' );
}


/* Tile generation */

LandManager.prototype.generateTile = function ( x, y )
{
	//if ( Math.abs(x) + Math.abs(y) < 1 ) {
	//	return TileTypes.Grass;
	//}

	//if ( x < -6 || x > 6 || y < -6 || y > 6 ) {
	//	return TileTypes.Dirt;
	//}

	var value = noise.simplex2(x/14 + this.seed[0], y/14 + this.seed[1]);

	if (value > 0.55 || value < -0.6) {
		return TileTypes.Dirt;
	}

	return TileTypes.Grass;
};

LandManager.prototype.addLand = function( x, y, dx, dy, index ) {
	if (this.isTile( x+dx, y+dy, TileTypes.Dirt )) {
		var s = this.addSprite( x, y, 0 );

		var frames = Tiles.Dirt.pos[index].toIndex( this.tileset );
		s.animations.add( 'idle', frames, 1, true );
		s.animations.play( 'idle' );

		return s;
	}
};

LandManager.prototype.addLandEdge = function( x, y, dx, dy, index ) {
	if (this.isTile( x+dx, y+dy, TileTypes.Dirt ) && !this.isTile( x+dx, y, TileTypes.Dirt ) && !this.isTile( x, y+dy, TileTypes.Dirt )) {
		var s = this.addSprite( x, y, 0 );

		var frames = Tiles.Dirt.pos[index].toIndex( this.tileset );
		s.animations.add( 'idle', frames, 1, true );
		s.animations.play( 'idle' );

		return s;
	}
};

LandManager.prototype.addLandCorner = function( x, y, dx, dy, index ) {
	if (this.isTile( x+dx, y, TileTypes.Dirt ) && this.isTile( x, y+dy, TileTypes.Dirt )) {
		var s = this.addSprite( x, y, 0 );

		var frames = Tiles.Dirt.pos[index].toIndex( this.tileset );
		s.animations.add( 'idle', frames, 1, true );
		s.animations.play( 'idle' );

		return s;
	}
};

LandManager.prototype.createTile = function( x, y ) {
	if ( this.isTile( x, y, TileTypes.Dirt ) ) {
		var index = 0;
		index += 1 * this.isTile( x+1, y, TileTypes.Dirt ); // Right
		index += 2 * this.isTile( x, y+1, TileTypes.Dirt ); // Down
		index += 4 * this.isTile( x-1, y, TileTypes.Dirt ); // Left
		index += 8 * this.isTile( x, y-1, TileTypes.Dirt ); // Up

		this.addSprite( x, y, Tiles.Dirt.pos[index] );
	}

	if ( this.isTile( x, y, TileTypes.Grass ) ) {
		this.addSprite( x, y, Tiles.Grass.pos.choice() );
	}
};


/* World building */

LandManager.prototype.checkLandAt = function ( x, y )
{
	return false;
	//return this.getTile(x,y) == TileTypes.Dirt;
};

extend( TileManager, LandManager );
