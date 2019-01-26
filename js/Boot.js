var Global = Global || {};
Global.Boot = function() {};

Global.Boot.prototype = {
	preload: function() {
		// Loading screen assets
		this.load.image( 'preloader-bar', 'assets/sprites/preloader-bar.png' );
	},
	create: function() {
		// Physics system
		this.game.physics.startSystem( Phaser.Physics.ARCADE );
		this.game.time.advancedTiming = true;

		//this.game.add.plugin(Phaser.Plugin.Debug);

		this.rescale();
		this.game.scale.setResizeCallback(function () {
			this.rescale();
		}, this);

		this.readSettings();

		this.state.start( 'Preload' );
	},

	rescale: function() {
		Global.inputScale.x = 1;
		Global.inputScale.y = 1;
	},

	readSettings: function() {
		var music = readCookie( 'music' );
		if ( music != null )
			Global.music = clamp( music, 0, 1 );

		var sound = readCookie( 'sound' );
		if ( sound != null )
			Global.sound = clamp( sound, 0, 1 );
	},
};
