var Global = Global || {};

const TILE_SIZE = 64;
const ROOM_WIDTH = 12;
const ROOM_HEIGHT = 8;
const SCREEN_WIDTH = ROOM_WIDTH * TILE_SIZE;
const SCREEN_HEIGHT = ROOM_HEIGHT * TILE_SIZE;

var config = {
	width: SCREEN_WIDTH,
	height: SCREEN_HEIGHT,
	renderer: Phaser.CANVAS,
	parent: "TITLE HERE",
	state: null,
	transparent: false,
	antialias: false,
	physicsConfig: null,
}

Global.game = new Phaser.Game( config );

Global.game.state.add( 'Boot', Global.Boot );
Global.game.state.add( 'Preload', Global.Preload );
Global.game.state.add( 'MainMenu', Global.MainMenu );
Global.game.state.add( 'Game', Global.Game );
Global.game.state.add( 'Credits', Global.Credits );

Global.game.state.start( 'Boot' );

Global.input = {};
Global.inputScale = new Phaser.Point( 0, 0 );
Global.inputOffset = new Phaser.Point( 0, 0 );

Global.paused = false;

/* Options */
Global.music = 0.4;
Global.sound = 0.8;
