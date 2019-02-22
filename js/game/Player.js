function Player () {}

Player.prototype.create = function ( x, y, playerGroup )
{
	this.sprite = playerGroup.create( x, y, 'player', 0 );
	this.sprite.persistent = true;

	this.grid = new Phaser.Point( Math.round(x/TILE_SIZE), Math.round(y/TILE_SIZE) );
	this.goal = new Phaser.Point( x, y );
	this.facing = new Phaser.Point( 0, 1 );

	this.holdItem = playerGroup.create( 0, 0, 'items', 0 );
	this.holdItem.alpha = 0;
	this.holdItem.anchor.set( 0, 1 );
	this.holdItem.show = false;
	this.holdItem.persistent = true;

	this.inventory = new Inventory();

	this.setupInput();
	this.setupAnimation();
};

Player.prototype.setupAnimation = function ()
{
	this.sprite.animations.add( 'idle_down',	[0], 8, false );
	this.sprite.animations.add( 'idle_right',	[1], 8, false );
	this.sprite.animations.add( 'idle_up',		[2], 8, false );
	this.sprite.animations.add( 'idle_left',	[3], 8, false );
	this.sprite.animations.add( 'raise',		[4], 8, false );
	this.sprite.animations.add( 'duck',			[5], 8, false );

	this.state = 'idle';
	this.direction = 'down';
	this.sprite.animations.play( 'idle_down' );
};

Player.prototype.setAnimation = function ( newState, newDirection )
{
	if ( this.state != newState || this.direction != newDirection ) {
		if ( newDirection ) {
			this.state = newState;
			this.direction = newDirection;
			this.sprite.animations.play( '{0}_{1}'.format( newState, newDirection ) );
		} else {
			this.state = newState;
			this.sprite.animations.play( this.state );
		}
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
	this.keys.e = Global.game.input.keyboard.addKey( Phaser.Keyboard.E );
	this.keys.i = Global.game.input.keyboard.addKey( Phaser.Keyboard.I );

	this.input = {
		"up": {},
		"left": {},
		"down": {},
		"right": {},
		"space": {},
		"inventory": {},
		"dir": new Phaser.Point(0,0)
	};
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
	this.input.inventory.isDown = this.keys.e.isDown || this.keys.i.isDown;

	for (var key in this.input) {
		this.input[key].justDown = ( this.input[key].isDown && !this.input[key].wasDown );
		this.input[key].justUp = ( !this.input[key].isDown && this.input[key].wasDown );
		this.input[key].holdTimer = this.input[key].justDown ? 0 : this.input[key].holdTimer + (this.input[key].isDown ? 1 : 0);
	}

	this.input.dir.set( 0, 0 );
	if ( this.input.up.justDown )
		this.input.dir.y -= 1;
	else if ( this.input.down.justDown )
		this.input.dir.y += 1;
	else if ( this.input.left.justDown )
		this.input.dir.x -= 1;
	else if ( this.input.right.justDown )
		this.input.dir.x += 1;
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

Player.prototype.getDirString = function ( vector )
{
	if ( vector.x < 0 )
		return 'left';
	if ( vector.x > 0 )
		return 'right';
	if ( vector.y < 0 )
		return 'up';
	if ( vector.y > 0 )
		return 'down';
};


Player.prototype.update = function ()
{
	this.handleInput();
	this.handleMovement();
	this.handleItemUsage();
	this.handleInventory();

	// Inventory
	this.inventory.update();
};

Player.prototype.handleMovement = function ()
{
	var blockInput = this.input.space.isDown || this.inventory.show;
	if ( !blockInput )
	{
		// Set new facing
		if ( this.input.dir.getMagnitude() > 0 ) {
			this.facing.copyFrom( this.input.dir );
			var direction = this.getDirString( this.facing );
			this.setAnimation( 'idle', direction );
		}

		// Move forward
		if ( this.input[this.direction].holdTimer == 2 ) {
			this.input[this.direction].holdTimer -= 12;

			var fx = this.grid.x + this.facing.x;
			var fy = this.grid.y + this.facing.y;
			if ( !Global.World.checkCollision( fx, fy ) ) {
				this.grid.x += this.facing.x;
				this.grid.y += this.facing.y;
				this.goal.x = this.grid.x * TILE_SIZE;
				this.goal.y = this.grid.y * TILE_SIZE;

				if ( Global.World.getTerrain( fx, fy ) == TileTypes.Dirt ) {
					Global.Audio.play( 'walking_dirt' );
				} else {
					Global.Audio.play( 'walking_grass' );
				}
			}
		}
	}

	// Character sliding movement
	var fac = 1 - Math.pow( 0.6, Global.game.time.elapsed * 0.06 );
	this.sprite.x += ( this.goal.x - this.sprite.x ) * fac;
	this.sprite.y += ( this.goal.y - this.sprite.y ) * fac;

	// Character bobbing animation
	this.sprite.anchor.y = 0.60 + Math.sin( Global.game.time.totalElapsedSeconds() * 3 * Math.PI ) / 256;
};

Player.prototype.handleInventory = function ()
{
	if ( this.input.inventory.justDown ) {
		if ( !this.inventory.show ) {
			this.openInventory();
		}
		else {
			this.closeInventory();
		}
	}

	if ( this.input.inventory.justUp && ( this.input.inventory.holdTimer > 20 || this.inventory.selected != this.inventory.prevSelected ) ) {
		if ( this.inventory.show ) {
			this.closeInventory();
		}
	}

	if ( this.inventory.show ) {
		if ( this.input.dir.getMagnitude() > 0 ) {
			this.inventory.moveSelection( this.input.dir.x, this.input.dir.y );
			this.holdItem.frame = this.inventory.getSelectedItem();
		}

		if ( this.input.space.justUp ) {
			this.closeInventory();
		}
	}
};

Player.prototype.openInventory = function ()
{
	this.inventory.open();
	this.prepareItem();
};

Player.prototype.closeInventory = function ()
{
	this.inventory.close();
	this.stopItem();
	this.hideItem();
};

Player.prototype.handleItemUsage = function ()
{
	if ( this.inventory.show ) {
		return;
	}

	if ( this.input.space.justDown ) {
		this.prepareItem();
	}

	if ( this.input.space.justUp ) {
		this.useItem();
	}
};

Player.prototype.prepareItem = function ()
{
	var crop = Global.World.getCropAt( this.grid.x, this.grid.y );

	if ( crop && crop.canHarvest() && !this.inventory.show ) {
		this.setAnimation( 'duck' );
	}
	else {
		this.setAnimation( 'raise' );
		this.showItem( this.inventory.getSelectedItem() );
	}
};

Player.prototype.useItem = function ()
{
	var success = false;

	var crop = Global.World.getCropAt( this.grid.x, this.grid.y );
	if ( crop && crop.canHarvest() ) {
		var harvest = crop.harvestCrop( this.inventory );
		var item = harvest[0];
		var quantity = harvest[1];

		this.inventory.addItem( item, quantity );
		this.showItem( item );

		this.setAnimation( 'raise' );
		Global.game.time.events.add( Phaser.Timer.SECOND * 1 / 6, function() {
			this.stopItem();
			this.hideItem();
		}, this );

		return;
	}

	var item = this.inventory.getSelectedItem();

	if ( item == Items.WateringCan ) {
		success = Global.World.waterCrop( this.grid.x, this.grid.y );
	}
	if ( item == Items.Scythe ) {
		success = Global.World.cutCrop( this.grid.x, this.grid.y );
	}
	if ( item == Items.Hoe ) {
		success = Global.World.digCrop( this.grid.x, this.grid.y );
	}
	if ( item == Items.TomatoSeeds || item == Items.Tomato ) {
		success = Global.World.plantCrop( this.grid.x, this.grid.y, Crops.Tomato );
		if ( success ) {
			this.inventory.spend();
		}
	}

	if ( !success )
		Global.Audio.play( 'error' );

	this.setAnimation( 'duck' );
	this.hideItem();
	Global.game.time.events.add( Phaser.Timer.SECOND * 1 / 6, function() {
		this.stopItem();
	}, this );
};

Player.prototype.stopItem = function ()
{
	if ( !this.input.space.isDown ) {
		this.setAnimation( 'idle', this.direction );
	}
};

Player.prototype.showItem = function ( item )
{
	if ( !this.holdItem.show ) {
		this.holdItem.goalY = this.sprite.y - TILE_SIZE * 0.85;
		this.holdItem.x = this.sprite.x;
		this.holdItem.y = this.holdItem.goalY + 16;
		this.holdItem.frame = item;
		this.holdItem.alpha = 0.0;
		this.holdItem.show = true;

		Global.game.add.tween( this.holdItem ).to({ alpha: 1.0, y: this.holdItem.goalY }, 80, Phaser.Easing.Circular.Out, true );
	}
};

Player.prototype.hideItem = function ()
{
	if ( this.holdItem.show ) {
		this.holdItem.y = this.holdItem.goalY;
		this.holdItem.alpha = 1.0;
		this.holdItem.show = false;

		Global.game.add.tween( this.holdItem ).to({ alpha: 0.0, y: this.holdItem.goalY+16 }, 80, Phaser.Easing.Circular.In, true );
	}
};
