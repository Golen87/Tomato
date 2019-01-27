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

		Global.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		Global.game.scale.setShowAll();
		window.addEventListener('resize', function () {
			Global.game.scale.refresh();
		});
		Global.game.scale.refresh();

		this.readSettings();

		this.state.start( 'Preload' );
	},

	readSettings: function() {
		var music = readCookie( 'music' );
		if ( music != null )
			Global.music = clamp( music, 0, 1 );

		var ambience = readCookie( 'ambience' );
		if ( ambience != null )
			Global.ambience = clamp( ambience, 0, 1 );

		var sound = readCookie( 'sound' );
		if ( sound != null )
			Global.sound = clamp( sound, 0, 1 );
	},
};
