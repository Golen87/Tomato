function Player () {}

Player.prototype.create = function ( x, y, playerGroup )
{
	this.sprite = playerGroup.create( x, y, 'player', 0 );
	this.sprite.anchor.set( 0, 0.5 );

	this.sprite.goalX = x;
	this.sprite.goalY = y;
	this.prevGridPos = new Phaser.Point(0, 0);
	this.gridPos = new Phaser.Point(0, 0);

	this.allowInput = true;
	this.inventory = new Inventory();

	this.setupInput();
	this.setupAnimation();

	this.holdItem = playerGroup.create( 0, 0, 'items', 0 );
	this.holdItem.alpha = 0;
	this.holdItem.anchor.set( 0, 3/2 );
};

Player.prototype.setupAnimation = function ()
{
	var len = 1;
	var idle = [0];
	this.sprite.animations.add( 'idle_down', idle, 8, false );
	idle = idle.map( n => n + len );
	this.sprite.animations.add( 'idle_right', idle, 8, false );
	idle = idle.map( n => n + len );
	this.sprite.animations.add( 'idle_up', idle, 8, false );
	idle = idle.map( n => n + len );
	this.sprite.animations.add( 'idle_left', idle, 8, false );

	idle = idle.map( n => n + len );
	this.sprite.animations.add( 'hold', idle, 8, false );
	idle = idle.map( n => n + len );
	this.sprite.animations.add( 'use', idle, 8, false );

	this.state = 'idle';
	this.direction = 'down';
	this.sprite.animations.play( 'idle_down' );
};

Player.prototype.setAnimation = function ( newState, newDirection )
{
	var name = null;
	if ( this.state != newState || this.direction != newDirection )
	{
		if ( newDirection ) {
			name = '{0}_{1}'.format( newState, newDirection );
			this.state = newState;
			this.direction = newDirection;
		} else {
			name = newState;
			this.state = newState;
		}
	}

	if ( name )
	{
		this.sprite.animations.play( name );
	}
};

Player.prototype.setupInput = function ()
{
	this.keys = Global.game.input.keyboard.createCursorKeys();
	this.keys.w = Global.game.input.keyboard.addKey( Phaser.Keyboard.W );
	this.keys.a = Global.game.input.keyboard.addKey( Phaser.Keyboard.A );
	this.keys.s = Global.game.input.keyboard.addKey( Phaser.Keyboard.S );
	this.keys.d = Global.game.input.keyboard.addKey( Phaser.Keyboard.D );
	this.keys.space = Global.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );

	this.input = { "up": {}, "left": {}, "down": {}, "right": {}, "space": {} };
	this.resetInput();
};

Player.prototype.handleInput = function ()
{
	for (var key in this.input) {
		this.input[key].wasDown = this.input[key].isDown;
	}

	this.input.up.isDown = this.keys.up.isDown || this.keys.w.isDown;
	this.input.left.isDown = this.keys.left.isDown || this.keys.a.isDown;
	this.input.down.isDown = this.keys.down.isDown || this.keys.s.isDown;
	this.input.right.isDown = this.keys.right.isDown || this.keys.d.isDown;
	this.input.space.isDown = this.keys.space.isDown;

	for (var key in this.input) {
		this.input[key].justDown = ( this.input[key].isDown && !this.input[key].wasDown );
		this.input[key].justUp = ( !this.input[key].isDown && this.input[key].wasDown );
		this.input[key].holdTimer = this.input[key].isDown ? this.input[key].holdTimer + 1 : 0;
	}
};

Player.prototype.resetInput = function ()
{
	for (var key in this.input) {
		this.input[key].wasDown = false;
		this.input[key].isDown = false;
		this.input[key].justDown = false;
		this.input[key].justUp = false;
		this.input[key].holdTimer = 0;
	}

	Global.game.input.reset();
};

Player.prototype.update = function ()
{
	this.gridX = Math.round( ( this.sprite.goalX ) / TILE_SIZE );
	this.gridY = Math.round( ( this.sprite.goalY ) / TILE_SIZE );
	var dx = (this.direction == 'right') - (this.direction == 'left');
	var dy = (this.direction == 'down') - (this.direction == 'up');

	/* Walking input */

	this.handleInput();

	var inputDir = new Phaser.Point( 0, 0 );
	if ( this.allowInput )
	{
		if ( this.input.space.isDown ) {
			this.prepareItem();
		} else {
			this.stopItem();
		}
		if ( this.input.space.justUp ) {
			this.useItem();
		}

		if ( this.input.up.justDown )
			inputDir.y -= 1;
		else if ( this.input.down.justDown )
			inputDir.y += 1;
		else if ( this.input.left.justDown )
			inputDir.x -= 1;
		else if ( this.input.right.justDown )
			inputDir.x += 1;
	}

	if ( !this.input.space.isDown ) {

		var direction = this.direction;
		if ( inputDir.getMagnitude() > 0 ) {
			if ( Math.abs( inputDir.x ) >= Math.abs( inputDir.y ) )
				direction = inputDir.x > 0 ? 'right' : 'left';
			else
				direction = inputDir.y > 0 ? 'down' : 'up';

			this.setAnimation( 'idle', direction );
		}

		if ( this.allowInput && this.input[this.direction].holdTimer == 2 ) {
			this.input[this.direction].holdTimer -= 12;

			if ( !Global.World.checkCollision( this.gridX + dx, this.gridY + dy ) ) {
				this.sprite.goalX += dx * TILE_SIZE;
				this.sprite.goalY += dy * TILE_SIZE;
			
				if ( Global.World.checkDirtAt( this.gridX + dx, this.gridY + dy ) ) {
					Global.Audio.play( 'walking_dirt' );
				} else {
					Global.Audio.play( 'walking_grass' );
				}
			}
		}
	}

	if ( this.input.space.holdTimer > 30 ) {
		this.inventory.open();
		if ( inputDir.getMagnitude() > 0 ) {
			this.inventory.moveSelection( inputDir.x, inputDir.y );
		}
	} else {
		this.inventory.close();
	}

	this.inventory.update();


	var fac = 1 - Math.pow( 0.6, Global.game.time.elapsed * 0.06 );
	this.sprite.x += ( this.sprite.goalX - this.sprite.x ) * fac;
	this.sprite.y += ( this.sprite.goalY - this.sprite.y ) * fac;

	this.sprite.anchor.y = 0.5 + Math.sin( Global.game.time.totalElapsedSeconds() * 3 * Math.PI ) / 256;

	this.holdItem.x = this.sprite.x;
	this.holdItem.y = this.sprite.y+1;
};


Player.prototype.prepareItem = function ()
{
	var crop = Global.World.getCropAt( this.gridX, this.gridY );
	if ( crop && crop.canHarvest() ) {
		this.setAnimation( 'use' );
	}
	else {
		this.setAnimation( 'hold' );
		this.holdItem.alpha = 1;
		this.holdItem.frame = this.inventory.getItem();
	}
};

Player.prototype.useItem = function ()
{
	if ( this.inventory.show ) {
		this.setAnimation( 'idle', this.direction );
		return;
	}

	var success = false;

	if ( !this.inventory.show ) {

		var crop = Global.World.getCropAt( this.gridX, this.gridY );
		if ( crop && crop.canHarvest() ) {

			var harvest = crop.harvestCrop( this.gridX, this.gridY );
			this.inventory.addItems( harvest );

			this.setAnimation( 'hold' );
			Global.game.time.events.add( Phaser.Timer.SECOND * 1 / 6, function() {
				this.setAnimation( 'idle', this.direction );
			}, this );

			return;
		}

		var item = this.inventory.getItem();

		if ( item == Items.WateringCan ) {
			success = Global.World.waterCrop( this.gridX, this.gridY );
		}
		if ( item == Items.Scythe ) {
			success = Global.World.cutCrop( this.gridX, this.gridY );
		}
		if ( item == Items.Hoe ) {
			success = Global.World.digCrop( this.gridX, this.gridY );
		}
		if ( item == Items.TomatoSeeds ) {
			success = Global.World.plantCrop( this.gridX, this.gridY, Crops.Tomato );
		}
	}

	if ( !success )
		Global.Audio.play( 'error' );

	this.setAnimation( 'use' );
	Global.game.time.events.add( Phaser.Timer.SECOND * 1 / 6, function() {
		this.setAnimation( 'idle', this.direction );
	}, this );
};

Player.prototype.stopItem = function ()
{
	this.holdItem.alpha = 0;
};
