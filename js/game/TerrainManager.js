function TerrainManager ()
{
	TileManager.call( this, 'ground' );
	this.outsideRange = 1;
}


/* Tile generation */

TerrainManager.prototype.getNoise = function ( x, y )
{
	var distance = (x==0 && y==0) ? 0 : Math.sqrt( x*x + y*y );

	var island_radius = 30;
	var safe_radius = 8;

	var gradient = 1.0 - Math.pow( distance / island_radius, 2 );
	gradient = gradient.clamp( 0, 1 );
	var raise = ( 1 - distance / safe_radius ) / 1;
	raise = raise.clamp( 0, 1 );

	var k = 8;
	var value = 0.5 + noise.perlin2(x/k + this.seed[0], y/k + this.seed[1]) / 2;
	value = (value + raise).clamp( 0, 1 );
	value *= gradient;

	return value;
};

TerrainManager.prototype.generateTile = function ( x, y )
{
	//if ( Math.abs(x) + Math.abs(y) < 1 ) {
	//	return TileTypes.Grass;
	//}

	//if ( x < -6 || x > 6 || y < -6 || y > 6 ) {
	//	return TileTypes.Dirt;
	//}

	var value = this.getNoise( x, y );

	//if (value > 0.56 || value < -0.6) {
	//if (value > 0.6 || value < -0.6) {
	//	return TileTypes.Dirt;
	//}

	if ( value < 0.3 )
		return TileTypes.Water;
	if ( value < 0.4 )
		return TileTypes.Dirt;

	return TileTypes.Grass;
};

TerrainManager.prototype.addLand = function( x, y, dx, dy, index ) {
	if (this.isTile( x+dx, y+dy, TileTypes.Dirt )) {
		var s = this.addSprite( x, y, 0 );

		var frames = Tiles.Dirt.pos[index].toIndex( this.tileset );
		s.animations.add( 'idle', frames, 1, true );
		s.animations.play( 'idle' );

		return s;
	}
};

TerrainManager.prototype.createTile = function( x, y ) {
	if ( this.isTile( x, y, TileTypes.Dirt ) ) {
		var index = 0;
		index += 1 * this.isTile( x+1, y, TileTypes.Dirt ); // Right
		index += 2 * this.isTile( x, y+1, TileTypes.Dirt ); // Down
		index += 4 * this.isTile( x-1, y, TileTypes.Dirt ); // Left
		index += 8 * this.isTile( x, y-1, TileTypes.Dirt ); // Up

		index = randInt(0,2);

		var s = this.addSprite( x, y, Tiles.Dirt.pos[index] );
		//s.tint = 0x010101 * Math.floor(this.getNoise(x,y) * 255);
	}

	if ( this.isTile( x, y, TileTypes.Grass ) ) {
		var s = this.addSprite( x, y, Tiles.Grass.pos.choice() );
		//var s = this.addSprite( x, y, Tiles.Grass.pos[0] );
		//s.tint = 0x010101 * Math.floor(this.getNoise(x,y) * 255);
	};

	if ( this.isTile( x, y, TileTypes.Water ) ) {
		var s = this.addSprite( x, y, Tiles.Water.pos.choice() );
		//s.tint = 0x010101 * Math.floor(this.getNoise(x,y) * 255);
	};
};


extend( TileManager, TerrainManager );
