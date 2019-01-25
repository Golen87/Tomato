function TileManager ( tileset )
{
	this.seed = [randFloat( -10000, 10000 ), randFloat( -10000, 10000 )];
	this.tileMap = {};

	this.tileset = tileset;
	this.group = Global.game.add.group();
	this.group.createMultiple( 3*ROOM_WIDTH*ROOM_HEIGHT, tileset, 0, false );

	this.activeSet = new Set();
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
		s.reset( 16*x, 16*y );
		s.frame = posToIndex( this.tileset, pos );
		s.key = x + "," + y;
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
		x >= Global.game.camera.x - 16 - 16 &&
		y >= Global.game.camera.y - 16 - 16 &&
		x < Global.game.camera.x + 16 * ROOM_WIDTH + 16 &&
		y < Global.game.camera.y + 16 * ROOM_HEIGHT + 16
	);
};

TileManager.prototype.clearOutOfView = function ()
{
	for ( var i = 0; i < this.group.children.length; i++ )
	{
		var s = this.group.children[i];
		if ( s.exists && !this.isInView( s.position.x, s.position.y ) )
		{
			s.kill();
			this.activeSet.delete(s.key);
		}
	}
};

TileManager.prototype.loadArea = function ( worldX, worldY )
{
	this.clearOutOfView();

	var startX = Global.game.camera.x - 16;
	var startY = Global.game.camera.y - 16;
	var endX = Global.game.camera.x + 16 * ROOM_WIDTH + 16;
	var endY = Global.game.camera.y + 16 * ROOM_HEIGHT + 16;

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
