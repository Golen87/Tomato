var Global = Global || {};
Global.Credits = function() {};

Global.Credits.prototype = {
	create: function() {
		Global.game.stage.backgroundColor = '#AAAAFF';

		// Particles need to move
		Global.game.physics.arcade.isPaused = false;

		this.background = Global.game.add.sprite( 0, 0, 'menubg' );
		this.background.animations.add( 'idle', [0,1], 2.5, true );
		this.background.animations.play( 'idle' );

		Global.game.camera.flash( 0xffffff, 400 );

		var y = 15;
		var text = this.add.bitmapText( SCREEN_WIDTH/2, y, 'TinyUnicode', '- Made by -', 16 );
		text.anchor.x = 0.5;

		y += 16;
		var text = this.add.bitmapText( SCREEN_WIDTH/2, y, 'Pixelade', 'Mans Gezelius', 13 );
		text.anchor.x = 0.5;
		y += 12;
		var text = this.add.bitmapText( SCREEN_WIDTH/2, y, 'Pixelade', 'Rasmus Vesik', 13 );
		text.anchor.x = 0.5;

		/* Copyright */
		var text = this.add.bitmapText( 1, SCREEN_HEIGHT+1, 'Pixelade', '©2018 LiU Fall GameJam', 13 );
		text.anchor.set( 0, 1 );
		text.tint = 0xffffff;

		var text = this.add.bitmapText( SCREEN_WIDTH-1, SCREEN_HEIGHT+1, 'Pixelade', 'www.golen.nu', 13 );
		text.anchor.set( 1, 1 );
		text.tint = 0xffffff;

		//var text = this.add.bitmapText( SCREEN_WIDTH/2, SCREEN_HEIGHT - 32, 'Pixelade', 'Press [space] to play again', 13 );
		//text.anchor.x = 0.5;

		var start = Global.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
		start.onDown.add( this.toMainMenu, this );
		var start = Global.game.input.keyboard.addKey( Phaser.Keyboard.ENTER );
		start.onDown.add( this.toMainMenu, this );
		var esc = Global.game.input.keyboard.addKey( Phaser.Keyboard.ESC );
		esc.onDown.add( this.toMainMenu, this );
	},
	update: function() {
		if ( Global.game.input.activePointer.isDown )
		{
			this.toMainMenu();
		}
	},

	toMainMenu: function() {
		Global.Audio.play( 'menu', 'click' );

		this.camera.fade(0xFFFFFF, 200);
		this.time.events.add( 210, function() {
			this.state.start( 'MainMenu' );
		}, this);
	},
};