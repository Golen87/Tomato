function LandManager ()
{
	TileManager.call( this, 'tileset' );
}


/* Tile generation */

LandManager.prototype.generateTile = function ( x, y )
{
	if ( Math.abs(x) + Math.abs(y) < 3 ) {
		return TileTypes.Water;
	}

	//if ( x < -6 || x > 6 || y < -6 || y > 6 ) {
	//	return TileTypes.Land;
	//}

	var value = noise.simplex2(x/10 + this.seed[0], y/10 + this.seed[1]);

	if (value > 0.55 || value < -0.6) {
		return TileTypes.Land;
	}

	return TileTypes.Water;
};

LandManager.prototype.addLand = function( x, y, dx, dy, index ) {
	if (this.isTile( x+dx, y+dy, TileTypes.Land )) {
		var s = this.addSprite( x, y, 0 );

		var frames = Tiles.Land.pos[index].toIndex( this.tileset );
		s.animations.add( 'idle', frames, 1, true );
		s.animations.play( 'idle' );

		return s;
	}
};

LandManager.prototype.addLandEdge = function( x, y, dx, dy, index ) {
	if (this.isTile( x+dx, y+dy, TileTypes.Land ) && !this.isTile( x+dx, y, TileTypes.Land ) && !this.isTile( x, y+dy, TileTypes.Land )) {
		var s = this.addSprite( x, y, 0 );

		var frames = Tiles.Land.pos[index].toIndex( this.tileset );
		s.animations.add( 'idle', frames, 1, true );
		s.animations.play( 'idle' );

		return s;
	}
};

LandManager.prototype.addLandCorner = function( x, y, dx, dy, index ) {
	if (this.isTile( x+dx, y, TileTypes.Land ) && this.isTile( x, y+dy, TileTypes.Land )) {
		var s = this.addSprite( x, y, 0 );

		var frames = Tiles.Land.pos[index].toIndex( this.tileset );
		s.animations.add( 'idle', frames, 1, true );
		s.animations.play( 'idle' );

		return s;
	}
};

LandManager.prototype.createTile = function( x, y ) {
	if ( this.isTile( x, y, TileTypes.Water ) ) {
		this.addLandEdge(x, y, +1, -1, 6);
		this.addLandEdge(x, y, -1, -1, 8);
		this.addLand(x, y, +0, -1, 7);
		this.addLand(x, y, +1, +0, 3);
		this.addLand(x, y, -1, +0, 5);
		this.addLandEdge(x, y, +1, +1, 0);
		this.addLandEdge(x, y, -1, +1, 2);
		this.addLand(x, y, +0, +1, 1);

		this.addLandCorner(x, y, +1, +1, 9);
		this.addLandCorner(x, y, -1, +1, 10);
		this.addLandCorner(x, y, +1, -1, 11);
		this.addLandCorner(x, y, -1, -1, 12);
	}

	if ( this.isTile( x, y, TileTypes.Land ) ) {
		this.addLand( x, y, 0, 0, [4,4,4,13].choice() );
	}
};


/* World building */

LandManager.prototype.checkLandAt = function ( x, y )
{
	return this.getTile(x,y) == TileTypes.Land;
};

extend( TileManager, LandManager );
