function TileManager ( tileset, group=null )
{
	this.seed = [randFloat( -10000, 10000 ), randFloat( -10000, 10000 )];
	noise.seed(Math.random());
	this.tileMap = {};

	this.tileset = tileset;
	if (group != null)
		this.group = group;
	else
		this.group = Global.game.add.group();
	this.group.createMultiple( 5*ROOM_WIDTH*ROOM_HEIGHT, tileset, 0, false );

	this.activeSet = new Set();

	this.outsideRange = 1;
}


/* Tile generation */

TileManager.prototype.generateTile = function ( x, y )
{
	return TileTypes.None;
};

TileManager.prototype.getTile = function ( x, y )
{
	var p = [x,y];
	if ( this.tileMap[p] == null ) {
		this.tileMap[p] = this.generateTile(x, y);
	}
	return this.tileMap[p];
};

TileManager.prototype.isTile = function ( x, y, tile )
{
	return this.getTile(x, y) == tile;
};

TileManager.prototype.addSpriteToGroup = function ( group, x, y, pos )
{
	var s = group.getFirstDead();
	if ( s )
	{
		s.reset( TILE_SIZE*x, TILE_SIZE*y );
		s.frame = posToIndex( this.tileset, pos );
		s.pkey = x + "," + y;
		s.alpha = 1.0;
		s.tint = 0xffffff;
	}
	else
	{
		console.warn( "Out of resources!" );
	}
	return s;
};

TileManager.prototype.addSprite = function ( x, y, pos )
{
	return this.addSpriteToGroup( this.group, x, y, pos );
};


/* World building */

TileManager.prototype.isInView = function ( x, y )
{
	return (
		x >= Global.game.camera.x - TILE_SIZE - this.outsideRange * TILE_SIZE &&
		y >= Global.game.camera.y - TILE_SIZE - this.outsideRange * TILE_SIZE &&
		x < Global.game.camera.x + TILE_SIZE * ROOM_WIDTH + this.outsideRange * TILE_SIZE &&
		y < Global.game.camera.y + TILE_SIZE * ROOM_HEIGHT + this.outsideRange * TILE_SIZE
	);
};

TileManager.prototype.clearOutOfView = function ()
{
	for ( var i = 0; i < this.group.children.length; i++ )
	{
		var s = this.group.children[i];
		if ( s.exists && !this.isInView( s.position.x, s.position.y ) && !s.persistent )
		{
			if ( s.owner ) {
				s.owner.cropSprite = null;
				s.owner.soilSprite = null;
				s.owner = null;
			}
			s.kill();
			this.activeSet.delete(s.pkey);
		}
	}
};

TileManager.prototype.loadArea = function ( worldX, worldY )
{
	this.clearOutOfView();

	var startX = Global.game.camera.x - this.outsideRange * TILE_SIZE;
	var startY = Global.game.camera.y - this.outsideRange * TILE_SIZE;
	var endX = Global.game.camera.x + TILE_SIZE * ROOM_WIDTH + this.outsideRange * TILE_SIZE;
	var endY = Global.game.camera.y + TILE_SIZE * ROOM_HEIGHT + this.outsideRange * TILE_SIZE;

	for ( var y = startY.grid(); y < endY.grid(); y++ ) {
		for ( var x = startX.grid(); x < endX.grid(); x++ ) {
			var key = x + "," + y;
			if ( !this.activeSet.has(key) ) {
				this.activeSet.add(key);
				this.createTile(x, y);
			}
		}
	}

	this.group.sort( 'y', Phaser.Group.SORT_ASCENDING );
};
