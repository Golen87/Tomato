var Global = Global || {};
Global.Boot = function() {};

Global.Boot.prototype = {
	preload: function() {
		// Loading screen assets
		this.load.image( 'preloader-bar', 'assets/sprites/preloader-bar.png' );
		this.load.spritesheet( 'tileset', 'assets/sprites/tileset.png', 16, 16 );
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
		var isFirefox = false;

		var element = document.getElementsByTagName('canvas')[0];
		var style = window.getComputedStyle(element);
		var rect = element.getBoundingClientRect();

		var zoom = style.getPropertyValue('zoom') || style.getPropertyValue('-moz-transform');
		if (isNaN(zoom)) { // Firefox
			isFirefox = true;
			var values = zoom.split('(')[1].split(')')[0].split(',');
			zoom = values[0];
			rect.x /= zoom;
			rect.y /= zoom;
		}
		zoom = parseInt(zoom);

		Global.inputScale.x = 1 / zoom;
		Global.inputScale.y = 1 / zoom;
		if (!isFirefox) {
			Global.inputOffset.x = rect.left * (1 - 1/zoom);
			Global.inputOffset.y = rect.top * (1 - 1/zoom);
		}
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
