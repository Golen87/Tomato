function EnemyManager ()
{
	TileManager.call( this, 'monsters' );
}


/* Tile generation */

EnemyManager.prototype.getValue = function ( x, y )
{
	return noise.simplex2(x + this.seed[0], y + this.seed[1]) + noise.simplex2(x/8 - this.seed[0], y/8 - this.seed[1]);
};

EnemyManager.prototype.generateTile = function ( x, y )
{
	if ( Math.abs(x) + Math.abs(y) < 4 ) {
		return TileTypes.None;
	}

	var value = this.getValue( x, y );

	if (value > -0.3 && value < 0.3 || value > 0.95) {
		if ( !Global.World.checkLandAt( x, y ) ) {
			return TileTypes.Enemy;
		}
	}

	return TileTypes.None;
};

EnemyManager.prototype.addEnemy = function( x, y, pos, sound ) {
	//var pos = enemy.pos.choice();
	var s = this.addSprite( x, y, 0 );
	s.sound = sound;

	var frames = pos.toIndex( this.tileset );
	s.animations.add( 'idle', frames, 2.5, true );
	s.animations.play( 'idle' );

	return s;
};

EnemyManager.prototype.addBlood = function( x, y ) {
	var s = this.addSprite( x, y, 0 );

	var frames = Tiles.Blood.pos.toIndex( this.tileset );
	s.animations.add( 'idle', frames, 1, true );
	s.animations.play( 'idle' );
	s.alpha = 0.8;

	return s;
};

EnemyManager.prototype.addMiss = function( x, y ) {
	var s = this.addSprite( x, y, Tiles.Miss.pos[2] );

	if ( !Global.World.checkLandAt( x, y ) ) {
		var frames = [Tiles.Miss.pos[0], Tiles.Miss.pos[1]].toIndex( this.tileset );
		s.animations.add( 'idle', frames, 1, true );
		s.animations.play( 'idle' );
		s.alpha = 0.8;
	}
	else{
		s.animations.stop();
	}

	return s;
};

EnemyManager.prototype.createTile = function( x, y ) {
	if ( this.isTile( x, y, TileTypes.Enemy ) ) {
		var monsters = [
			[Tiles.Shark, 'mouse'],
			[Tiles.Serpent, 'rat'],
			[Tiles.Squid, 'spider'],
			[Tiles.Tantacle, 'slime'],
			[Tiles.Whale, 'rhino']
		];
		var pair = monsters.choice();
		//var pair = monsters[1];

		//var values = [];
		//if ( this.isTile( x, y, TileTypes.Enemy ) )
		//	values.push( this.getValue( x, y ) );
		//if ( this.isTile( x+1, y, TileTypes.Enemy ) )
		//	values.push( this.getValue( x+1, y ) );
		//if ( this.isTile( x-1, y, TileTypes.Enemy ) )
		//	values.push( this.getValue( x-1, y ) );
		//if ( this.isTile( x, y+1, TileTypes.Enemy ) )
		//	values.push( this.getValue( x, y+1 ) );
		//if ( this.isTile( x, y-1, TileTypes.Enemy ) )
		//	values.push( this.getValue( x, y-1 ) );
		//if ( this.isTile( x+1, y+1, TileTypes.Enemy ) )
		//	values.push( this.getValue( x+1, y ) );
		//if ( this.isTile( x-1, y-1, TileTypes.Enemy ) )
		//	values.push( this.getValue( x-1, y ) );
		//if ( this.isTile( x-1, y+1, TileTypes.Enemy ) )
		//	values.push( this.getValue( x, y+1 ) );
		//if ( this.isTile( x+1, y-1, TileTypes.Enemy ) )
		//	values.push( this.getValue( x, y-1 ) );

		//if ( Math.max(...values) == this.getValue( x, y ) )
		//	pair = monsters[1];

		//var index = 3;
		//if ( this.isTile( x+1, y, TileTypes.Enemy ) )
		//	var index = 1;
		//if ( this.isTile( x-1, y, TileTypes.Enemy ) )
		//	index = 0;
		//if ( this.isTile( x+1, y, TileTypes.Enemy ) )
		//	index = 2;

		var s = this.addEnemy( x, y, pair[0].pos.choice(), pair[1] );

		s.visible = !Global.World.checkCloudAt( x, y );
	}

	if ( this.isTile( x, y, TileTypes.Blood ) ) {
		var s = this.addBlood( x, y );
	}

	if ( this.isTile( x, y, TileTypes.Miss ) ) {
		var s = this.addMiss( x, y );
	}
};


/* World building */

EnemyManager.prototype.checkEnemyAt = function ( x, y )
{
	return this.getTile(x,y) == TileTypes.Enemy;
};

EnemyManager.prototype.checkBloodOrMissAt = function ( x, y )
{
	return this.getTile(x,y) == TileTypes.Blood || this.getTile(x,y) == TileTypes.Miss;
};

EnemyManager.prototype.attack = function ( x, y, callback )
{
	Global.Audio.play( 'spikes' );

	if (this.checkEnemyAt( x, y )) {
		
		for ( var i = 0; i < this.group.children.length; i++ )
		{
			var s = this.group.children[i];
			if ( s.exists && s.key == [x,y] )
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

EnemyManager.prototype.kill = function ( x, y ) {
	var p = [x,y];
	if ( this.tileMap[p] ) {
		this.tileMap[p] = TileTypes.Blood;
	}

	for ( var i = 0; i < this.group.children.length; i++ )
	{
		var s = this.group.children[i];
		if ( s.exists && s.key == [x,y] )
		{
			s.kill();
			this.activeSet.delete(s.key);
			Global.Audio.play( s.sound, 'hurt' );
		}
	}
};

EnemyManager.prototype.reveal = function ( x, y )
{
	for ( var i = 0; i < this.group.children.length; i++ )
	{
		var s = this.group.children[i];
		if ( s.exists && s.key == [x,y] )
		{
			s.visible = true;
			Global.Audio.play( s.sound, 'cry' );
		}
	}
};

extend( TileManager, EnemyManager );
