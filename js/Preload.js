var Global = Global || {};
Global.Preload = function() {};

Global.Preload.prototype = {
	preload: function () {
		
		this.game.stage.backgroundColor = '#33333A';

		// Load game assets
		
		this.load.bitmapFont( 'Simplisicky', 'assets/fonts/Simplisicky/font.png', 'assets/fonts/Simplisicky/font.fnt' ); // 128

		this.load.image( 'tile', 'assets/sprites/tile.png' );
		this.load.image( 'tree', 'assets/sprites/tree.png' );
		this.load.image( 'inventory', 'assets/sprites/inventory.png' );
		this.load.image( 'select', 'assets/sprites/select.png' );
		this.load.image( 'glow', 'assets/sprites/glow.png' );
		this.load.image( 'torchlight', 'assets/sprites/torchlight.png' );

		this.load.spritesheet( 'player', 'assets/sprites/player.png', 128, 256 );
		this.load.spritesheet( 'ground', 'assets/sprites/ground.png', 128, 128 );
		this.load.spritesheet( 'soil', 'assets/sprites/soil.png', 128, 256 );
		this.load.spritesheet( 'bush', 'assets/sprites/bush.png', 384, 256 );
		this.load.spritesheet( 'tomato', 'assets/sprites/tomato.png', 128, 256 );
		this.load.spritesheet( 'items', 'assets/sprites/items.png', 128, 128 );

		this.load.audio( 'music', 'assets/sounds/Music.wav' );
		this.load.audio( 'ambience', 'assets/sounds/Ambience.ogg' );

		this.load.audio( 'walking_grass', 'assets/sounds/Walking_Grass.ogg' );
		this.load.audio( 'walking_dirt', 'assets/sounds/Walking_Dirt.ogg' );
		this.load.audio( 'menu_inventory', 'assets/sounds/Menu_Inventory.ogg' );
		this.load.audio( 'digging_dirt', 'assets/sounds/Digging_Dirt.ogg' ); // !!!!!!!
		this.load.audio( 'planting_seed', 'assets/sounds/Planting_Seed.ogg' );
		this.load.audio( 'grow_pop', 'assets/sounds/Grow_Pop.ogg' );
		this.load.audio( 'harvest_tomato', 'assets/sounds/Harvest_Tomato.ogg' ); // !!!!!!!!!
		this.load.audio( 'watering_crops', 'assets/sounds/Watering_Crops.ogg' );
		this.load.audio( 'scythe_swing', 'assets/sounds/Scythe_Swing.ogg' );
		this.load.audio( 'error', 'assets/sounds/Error.ogg' );


		// Loading progress bar
		var scale = 8;
		var x = this.game.world.centerX - this.game.cache.getImage( 'preloader-bar' ).width / 2 * scale;
		var y = this.game.world.centerY;
		var progressBg = this.game.add.sprite( x, y, 'preloader-bar' );
		var progressFg = this.game.add.sprite( x, y, 'preloader-bar' );
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
