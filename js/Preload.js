var Global = Global || {};
Global.Preload = function() {};

Global.Preload.prototype = {
	preload: function () {
		
		this.game.stage.backgroundColor = '#AAAAAA';

		// Load game assets
		
		//this.load.bitmapFont( 'Adventurer', 'assets/fonts/Adventurer/font.png', 'assets/fonts/Adventurer/font.fnt' ); // 16
		//this.load.bitmapFont( 'AdventurerFancy', 'assets/fonts/Adventurer/font_fancy.png', 'assets/fonts/Adventurer/font_fancy.fnt' ); // 16
		this.load.bitmapFont( 'Pixelade', 'assets/fonts/Pixelade/font.png', 'assets/fonts/Pixelade/font.fnt' ); // 13
		//this.load.bitmapFont( 'PixeladeFancy', 'assets/fonts/Pixelade/font_fancy.png', 'assets/fonts/Pixelade/font_fancy.fnt' ); // 13
		//this.load.bitmapFont( 'Fraktur', 'assets/fonts/Fraktur/font.png', 'assets/fonts/Fraktur/font.fnt' ); // 16
		this.load.bitmapFont( 'TinyUnicode', 'assets/fonts/TinyUnicode/font.png', 'assets/fonts/TinyUnicode/font.fnt' ); // 16
		//this.load.bitmapFont( 'OldWizard', 'assets/fonts/OldWizard/font.png', 'assets/fonts/OldWizard/font.fnt' ); // 16
		//this.load.bitmapFont( 'Peepo', 'assets/fonts/Peepo/font.png', 'assets/fonts/Peepo/font.fnt' ); // 9
		//this.load.bitmapFont( 'Superscript', 'assets/fonts/Superscript/font.png', 'assets/fonts/Superscript/font.fnt' ); // 10
		this.load.bitmapFont( '04b24', 'assets/fonts/04b24/font.png', 'assets/fonts/04b24/font.fnt' ); // 8

		this.load.image( 'tile', 'assets/sprites/tile.png' );
		this.load.image( 'bush', 'assets/sprites/bush.png' );
		this.load.image( 'tree', 'assets/sprites/tree.png' );

		this.load.spritesheet( 'player', 'assets/sprites/shiba.png', 128, 256 );
		this.load.spritesheet( 'ground', 'assets/sprites/ground.png', 128, 128 );
		this.load.spritesheet( 'tomato', 'assets/sprites/tomato.png', 128, 256 );

		//this.load.audio( 'footsteps', 'assets/sounds/footsteps.ogg' );

		//this.load.audio( 'menu', 'assets/sounds/menu.ogg' );


		// Loading progress bar
		var scale = 8;
		var x = this.game.world.centerX - this.game.cache.getImage( 'preloader-bar' ).width / 2 * scale;
		var y = this.game.world.centerY;
		var progressBg = this.game.add.sprite( x, y, 'preloader-bar' );
		var progressFg = this.game.add.sprite( x, y, 'preloader-bar' );
		progressBg.tint = 0x007700;
		progressBg.scale.set( scale );
		progressBg.anchor.setTo( 0, 0.5 );
		progressFg.scale.set( scale );
		progressFg.anchor.setTo( 0, 0.5 );
		this.game.load.setPreloadSprite( progressFg );
		this.game.load.onFileComplete.add( this.fileComplete, this );
	},
	setup: function () {
		Global.Audio = new AudioManager();
		Global.Light = new LightManager();
		Global.Gui = new GuiManager();
		Global.Particle = new ParticleManager();
	},
	create: function () {
		this.setup();

		this.camera.fade(0xFFFFFF, 200);
		this.time.events.add( 210, function() {
			this.state.start( 'Game' );
		}, this);
	},
	fileComplete: function ( progress, cacheKey, success, totalLoaded, totalFiles ) {}
};
