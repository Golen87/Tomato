function EntityManager ( entityGroup )
{
	TileManager.call( this, 'tomato', entityGroup );
	this.outsideRange = 5;

	this.cropInstances = [];
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
		var s = this.addSprite( x, y, 0 );
		this.getTile(x, y).init( s, x, y );
	}
};


/* World building */

EntityManager.prototype.checkCollisionAt = function ( x, y )
{
	return this.getTile(x,y) == TileTypes.Tree || this.getTile(x,y) == TileTypes.Bush;
};

EntityManager.prototype.attack = function ( x, y, callback )
{
	Global.Audio.play( 'spikes' );

	if (this.checkEnemyAt( x, y )) {
		
		for ( var i = 0; i < this.group.children.length; i++ )
		{
			var s = this.group.children[i];
			if ( s.exists && s.pkey == [x,y] )
			{

				function blink( sprite, count=0 ) {
					if ( count < 6 )
					{
						sprite.alpha = 1.5 - sprite.alpha;
						sprite.tint = sprite.alpha == 1.0 ? 0xff7777 : 0xffffff;

						Global.game.time.events.add( Phaser.Timer.SECOND * 0.05, function() {
							blink.call( this, sprite, count+1 );
						}, this );
					}
					else {
						this.kill( x, y );
						callback( true );
					}
				};
				blink.call( this, s );

			}
		}
	}
	else {
		var p = [x,y];
		if ( this.tileMap[p] != TileTypes.Miss ) {
			this.tileMap[p] = TileTypes.Miss;
			var key = x + "," + y;
			this.activeSet.delete(key);
		}
		callback( false );
	}
};

EntityManager.prototype.kill = function ( x, y ) {
	var p = [x,y];
	if ( this.tileMap[p] ) {
		this.tileMap[p] = TileTypes.Blood;
	}

	for ( var i = 0; i < this.group.children.length; i++ )
	{
		var s = this.group.children[i];
		if ( s.exists && s.pkey == [x,y] )
		{
			s.kill();
			this.activeSet.delete(s.pkey);
			Global.Audio.play( s.sound, 'hurt' );
		}
	}
};

EntityManager.prototype.reveal = function ( x, y )
{
	for ( var i = 0; i < this.group.children.length; i++ )
	{
		var s = this.group.children[i];
		if ( s.exists && s.pkey == [x,y] )
		{
			s.visible = true;
			Global.Audio.play( s.sound, 'cry' );
		}
	}
};

EntityManager.prototype.createCrop = function ( x, y, entity )
{
	var p = [x,y];
	if ( this.tileMap[p] == TileTypes.None ) {

		var crop = new Crop( CropTypes.Tomato );
		this.tileMap[p] = crop;
		this.cropInstances.push( crop );

		var key = x + "," + y;
		this.activeSet.delete(key);
	}
	//callback( false );
}


EntityManager.prototype.update = function ()
{
	for (var i = this.cropInstances.length - 1; i >= 0; i--) {
		this.cropInstances[i].update();
	}
};

extend( TileManager, EntityManager );
