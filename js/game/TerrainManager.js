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

TerrainManager.prototype.addGround = function( x, y, pos ) {
	var s = this.addSprite( x, y, pos );
	if ( s ) {
		s.loadTexture( this.tileset );
		s.frame = posToIndex( this.tileset, pos );
	}
	return s;
};

TerrainManager.prototype.addEdge = function( x, y, pos ) {
	if ( pos ) {
		var s = this.addSprite( x, y, [0,0] );
		if ( s ) {
			s.loadTexture( 'grass_edge' );
			s.frame = posToIndex( 'grass_edge', pos );
		}
	}
};

TerrainManager.prototype.addEdges = function( x, y ) {
	var N	= this.isTile( x, y-1, TileTypes.Grass );
	var NE	= this.isTile( x+1, y-1, TileTypes.Grass );
	var E	= this.isTile( x+1, y, TileTypes.Grass );
	var SE	= this.isTile( x+1, y+1, TileTypes.Grass );
	var S	= this.isTile( x, y+1, TileTypes.Grass );
	var SW	= this.isTile( x-1, y+1, TileTypes.Grass );
	var W	= this.isTile( x-1, y, TileTypes.Grass );
	var NW	= this.isTile( x-1, y-1, TileTypes.Grass );

	var pos = null;
	if ( N && W )	pos = [0,0];
	else if ( N )	pos = [3,0];
	else if ( W )	pos = [2,0];
	else if ( NW )	pos = [5,1];
	this.addEdge( x, y, pos );

	var pos = null;
	if ( N && E )	pos = [1,0];
	else if ( N )	pos = [3,0];
	else if ( E )	pos = [3,1];
	else if ( NE )	pos = [4,1];
	this.addEdge( x+1/2, y, pos );

	var pos = null;
	if ( S && W )	pos = [0,1];
	else if ( S )	pos = [2,1];
	else if ( W )	pos = [2,0];
	else if ( SW )	pos = [5,0];
	this.addEdge( x, y+1/2, pos );

	var pos = null;
	if ( S && E )	pos = [1,1];
	else if ( S )	pos = [2,1];
	else if ( E )	pos = [3,1];
	else if ( SE )	pos = [4,0];
	this.addEdge( x+1/2, y+1/2, pos );
};

TerrainManager.prototype.createTile = function( x, y ) {
	var tileNoise = 0.5 + noise.perlin2(0.5+x*2.1, 0.5+y*2.1) / 2;

	if ( this.isTile( x, y, TileTypes.Dirt ) ) {
		var s = this.addGround( x, y, Tiles.Dirt.pos.choice() );
		s.tint = 0x010101 * Math.floor(255 - tileNoise*20);
		var s = this.addEdges( x, y );
		//s.tint = 0x010101 * Math.floor(this.getNoise(x,y) * 255);
	}

	if ( this.isTile( x, y, TileTypes.Grass ) ) {
		var s = this.addGround( x, y, Tiles.Grass.pos.choice() );
		//s.tint = 0x010101 * Math.floor(Global.World.entityManager.getNoise(x,y) * 255);
		s.tint = 0x010101 * Math.floor(255 - tileNoise*20);
	};

	if ( this.isTile( x, y, TileTypes.Water ) ) {
		var s = this.addGround( x, y, Tiles.Water.pos.choice() );
		//s.tint = 0x010101 * Math.floor(this.getNoise(x,y) * 255);
		s.tint = 0x010101 * Math.floor(255 - tileNoise*20);
	};
};


extend( TileManager, TerrainManager );
