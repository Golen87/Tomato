var Global = Global || {};
Global.MainMenu = function() {};

Global.MainMenu.prototype = {
	create: function() {
		Global.game.stage.backgroundColor = '#AAAAFF';

		// Particles need to move
		Global.game.physics.arcade.isPaused = false;

		/*
		this.background = Global.game.add.sprite( 0, 0, 'menubg' );
		this.background.animations.add( 'idle', [0,1], 2.5, true );
		this.background.animations.play( 'idle' );

		Global.game.camera.flash( 0xffffff, 400 );

		Global.Audio.play( 'waves' );



		x = SCREEN_WIDTH / 2;
		y = 11;
		this.titleBg = this.add.bitmapText( x+1, y, 'Pixelade', 'Navy Nightmare', 26 );
		this.titleBg.tint = 0x000077;
		this.titleBg.anchor.x = 0.5;

		x = SCREEN_WIDTH / 2;
		y = 10;
		this.titleFg = this.add.bitmapText( x, y, 'Pixelade', 'Navy Nightmare', 26 );
		this.titleFg.tint = 0xffffff;
		this.titleFg.anchor.x = 0.5;
		*/

		/* Selection menu */
		y = 100;
		this.menuManager = new MenuManager();
		this.setupMenus();
		this.menuManager.createMenu( SCREEN_WIDTH/2, y, this.startMenu );

		this.menuManager.allowInput = true;
	},
	update: function() {
		this.menuManager.update();

		if ( Global.game.input.activePointer.isDown )
		{
			this.startGame();
		}
	}
};


Global.MainMenu.prototype.setupMenus = function ()
{
	var play = function() { this.startGame(); };
	var options = function() { this.menuManager.nextMenu( this.optionsMenu ); };
	var credits = function() { this.startCredits(); };

	this.startMenu = [
		[ 'play', play.bind(this), null ],
		[ 'options', options.bind(this), null ],
		[ 'credits', credits.bind(this), null ],
	];

	function musicText() {
		var index = Math.round( 5 * Global.music );
		var slider = '......'.replaceAt( index, '|' );
		return 'Music: [' + slider + ']';
	}
	function soundText() {
		var index = Math.round( 5 * Global.sound );
		var slider = '......'.replaceAt( index, '|' );
		return 'Sound: [' + slider + ']';
	}

	var music = function( inc ) {
		Global.music = clamp( Global.music + 0.2 * inc, 0, 1 );
		Global.music = Math.round( Global.music * 10 ) / 10;
		Global.Audio.updateMusic();
		createCookie( 'music', Global.music, 100 );

		var newText = musicText();
		this.optionsMenu[this.menuManager.selection][0] = newText;
		return newText;
	};
	var sound = function( inc ) {
		Global.sound = clamp( Global.sound + 0.2 * inc, 0, 1 );
		Global.sound = Math.round( Global.sound * 10 ) / 10;
		createCookie( 'sound', Global.sound, 100 );

		var newText = soundText();
		this.optionsMenu[this.menuManager.selection][0] = newText;
		return newText;
	};
	var back = function() { this.menuManager.previousMenu(); };

	this.optionsMenu = [
		[ musicText(), null, music.bind(this) ],
		[ soundText(), null, sound.bind(this) ],
		[ 'back', back.bind(this), null ],
	];
};

Global.MainMenu.prototype.startGame = function ()
{
	if ( this.menuManager.allowInput )
	{
		this.menuManager.allowInput = false;

		this.camera.fade(0xFFFFFF, 200);
		this.time.events.add( 210, function() {
			this.state.start( 'Game' );
		}, this);
	}
};

Global.MainMenu.prototype.startCredits = function ()
{
	if ( this.menuManager.allowInput )
	{
		this.menuManager.allowInput = false;

		this.camera.fade(0xFFFFFF, 200);
		this.time.events.add( 210, function() {
			this.state.start( 'Credits' );
		}, this);
	}
};
