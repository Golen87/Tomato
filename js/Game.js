var Global = Global || {};
Global.Game = function() {};

Global.Game.prototype =
{
	create: function()
	{
		Global.game.stage.backgroundColor = '#FFFFFF';
		Global.game.camera.flash( 0xffffff, 400 );

		Global.paused = false;
		Global.game.physics.arcade.isPaused = false;

		Global.Audio.play( 'ambience' );
		Global.Audio.play( 'music' );

		Global.Light.create();
		Global.Gui.create();

		this.World = new World();
		Global.World = this.World;
		this.World.create();

		var key = Global.game.input.keyboard.addKey( Phaser.Keyboard.ESC );
		key.onDown.add( this.togglePause, this );
		var key = Global.game.input.keyboard.addKey( Phaser.Keyboard.P );
		key.onDown.add( this.togglePause, this );

		this.mousePosition = new Phaser.Point( 0, 0 );
		this.holdPosition = new Phaser.Point( 0, 0 );

		Global.togglePause = Global.Game.prototype.togglePause.bind( this );


		Global.game.world.bringToTop( Global.World.terrainManager.group );
		Global.game.world.bringToTop( Global.World.helpGrid );
		Global.game.world.bringToTop( Global.World.entityManager.soilGroup );
		Global.game.world.bringToTop( Global.World.entityGroup );
		Global.game.world.bringToTop( Global.Light.lightGroup );
		Global.game.world.bringToTop( Global.Gui.group );
	},

	update: function()
	{
		if ( !Global.paused ) {
			//Global.Light.clear();
			this.World.update();
		}

		Global.Light.update();
		Global.Gui.update();

		//this.handleMouseInput();
	},

	togglePause: function()
	{
		if ( !Global.cinematic )
		{
			Global.paused = !Global.paused;
			Global.game.physics.arcade.isPaused = Global.paused;
			this.World.pause( Global.paused );

			if ( Global.paused )
			{
				Global.Gui.showPauseMenu();
			}
			else
			{
				Global.Gui.hidePauseMenu();
			}
		}
	},

	handleMouseInput: function()
	{
		if ( Global.game.input.activePointer.isDown )
		{
			this.mousePosition.set(
				Global.game.input.x * Global.inputScale.x - Global.inputOffset.x,
				Global.game.input.y * Global.inputScale.y - Global.inputOffset.y,
			);

			if ( this.mousePosition.x < 32 )
				this.mousePosition.x = 0;
			if ( this.mousePosition.x > SCREEN_WIDTH-32 )
				this.mousePosition.x = SCREEN_WIDTH;
			if ( this.mousePosition.y < 32 )
				this.mousePosition.y = 0;
			if ( this.mousePosition.y > SCREEN_HEIGHT-32 )
				this.mousePosition.y = SCREEN_HEIGHT;

			if ( this.leftDown == null )
			{
				this.leftDown = true;
				this.holdTimestamp = Global.game.time.totalElapsedSeconds();
				this.clickTime = 0.4;
				this.moveTime = 0.1;
				this.holdPosition.copyFrom( this.mousePosition );
			}

			var dt = Global.game.time.totalElapsedSeconds() - this.holdTimestamp;
			if ( dt >= this.moveTime ) {
				this.checkDirection();
			}
		}
		else
		{
			Global.input.space = false;
			Global.input.direction = null;

			if ( this.leftDown == true )
			{
				this.leftDown = null;
				var dt = Global.game.time.totalElapsedSeconds() - this.holdTimestamp;
				if ( dt < this.clickTime )
				{
					Global.input.space = true;
					this.checkDirection();
				}
			}
		}
	},

	checkDirection: function()
	{
		var playerScreenPos = new Phaser.Point(
			Global.World.Player.sprite.position.x - Global.World.camPos.x,
			Global.World.Player.sprite.position.y - Global.World.camPos.y
		);

		if ( playerScreenPos.distance( this.mousePosition ) > 4 ) {
			Global.input.direction = Phaser.Point.subtract( this.mousePosition, playerScreenPos );
		} else {
			Global.input.direction = null;
		}
	}
};
