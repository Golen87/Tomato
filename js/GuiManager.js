function GuiManager() {};

GuiManager.prototype.create = function ()
{
	this.group = Global.game.add.group();


	/* Pause menu */

	this.menuManager = new MenuManager();
	this.setupMenus();
	this.menuManager.allowInput = false;


	/* Inventory */

	this.invAnchor = this.group.create( 0, 0, null );
	this.invAnchor.alpha = 0.0;

	var offsetX = TILE_SIZE * (ROOM_WIDTH/2-3);
	var offsetY = TILE_SIZE * (ROOM_HEIGHT/2-2.5);
	this.invFg = this.group.create( offsetX, offsetY, 'inventory' );
	this.invBg = Global.game.add.graphics( 0, 0 );
	this.invBg.beginFill( 0x000000, 0.75 );
	this.invBg.drawRect( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
	this.invBg.endFill();
	//this.group.add( this.invBg );
	this.invAnchor.addChild( this.invBg );
	this.invAnchor.addChild( this.invFg );

	this.invCursor = this.invAnchor.addChild( this.group.create( offsetX + 1*TILE_SIZE, offsetY + 1*TILE_SIZE, 'select' ) );

	this.invSize = [4,3];
	this.invSlots = Array( this.invSize );

	for ( var i = 0; i < this.invSize[0] * this.invSize[1]; i++ ) {	
		var x = 1 + i % this.invSize[0];
		var y = 1 + Math.floor( i / this.invSize[0] );
		this.invSlots[i] = this.invFg.addChild( this.group.create( x*TILE_SIZE, y*TILE_SIZE, 'items' ) );

		this.invSlots[i].label = this.invFg.addChild( Global.game.add.bitmapText( x*TILE_SIZE+12, (y+1)*TILE_SIZE+10, 'Simplisicky', '', 128*0.4, this.group ) );
		this.invSlots[i].label.anchor.setTo( 0.0, 1.0 );
	}
};

GuiManager.prototype.update = function ()
{
	this.menuManager.update();

	this.invAnchor.x = Global.game.camera.view.x;
	this.invAnchor.y = Global.game.camera.view.y;

	/*for ( var i = 0; i < this.invSize; i++ )
	{
		this.invSlots[i].x = Global.game.camera.view.x + SCREEN_WIDTH - 4 - 22 * ( i );
		this.invSlots[i].y = Global.game.camera.view.y + SCREEN_HEIGHT - 2;
	}
	*/
};


GuiManager.prototype.setupMenus = function ()
{
	var resume = function() { Global.togglePause(); };
	var options = function() { this.menuManager.nextMenu( this.optionsMenu ); };
	var credits = function() { this.menuManager.nextMenu( this.creditsMenu ); };

	this.pauseMenu = [
		[ 'resume', resume.bind(this), null ],
		[ 'options', options.bind(this), null ],
		[ 'credits', credits.bind(this), null ],
	];

	function musicText() {
		var index = Math.round( 5 * Global.music );
		var slider = '......'.replaceAt( index, '|' );
		return '[' + slider + '] - music';
	}
	function ambienceText() {
		var index = Math.round( 5 * Global.ambience );
		var slider = '......'.replaceAt( index, '|' );
		return '[' + slider + '] - ambience';
	}
	function soundText() {
		var index = Math.round( 5 * Global.sound );
		var slider = '......'.replaceAt( index, '|' );
		return '[' + slider + '] - sound';
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
	var ambience = function( inc ) {
		Global.ambience = clamp( Global.ambience + 0.2 * inc, 0, 1 );
		Global.ambience = Math.round( Global.ambience * 10 ) / 10;
		Global.Audio.updateMusic();
		createCookie( 'ambience', Global.ambience, 100 );

		var newText = ambienceText();
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
		[ ambienceText(), null, ambience.bind(this) ],
		[ soundText(), null, sound.bind(this) ],
		[ '<back>', back.bind(this), null ],
	];


	var back = function() { this.menuManager.previousMenu(); };

	this.creditsMenu = [
		[ 'Golen - programming', back.bind(this), null ],
		[ 'Miau - art', back.bind(this), null ],
		[ 'Roz - sound effects', back.bind(this), null ],
		[ 'Gasparatus - music', back.bind(this), null ],
		[ 'Klankbeeld - soundscape', back.bind(this), null ],
		[ '<back>', back.bind(this), null ],
	];
};

GuiManager.prototype.showPauseMenu = function ()
{
	this.menuManager.allowInput = true;

	var c = Global.game.camera.view;

	this.darkBg = Global.game.add.graphics( c.x, c.y );
	this.darkBg.beginFill( 0x000000, 0.7 );
	this.darkBg.drawRect( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
	this.darkBg.endFill();

	var x = c.x+SCREEN_WIDTH/7;
	var y = c.y + TILE_SIZE*1.5;

	this.choiceTitle = Global.game.add.bitmapText( x, y, 'Simplisicky', 'Paused', 128 );
	this.choiceTitle.tint = 0x89dcff;
	y += TILE_SIZE*2;
	this.menuManager.createMenu( x, y, this.pauseMenu );

	Global.Audio.play( 'menu_inventory', 'open' );
};

GuiManager.prototype.hidePauseMenu = function ()
{
	this.menuManager.allowInput = false;

	this.darkBg.clear();
	this.choiceTitle.kill();

	this.menuManager.killMenu();

	Global.game.input.reset();

	Global.Audio.play( 'menu_inventory', 'close' );
};


GuiManager.prototype.showInventory = function ()
{
	this.invAnchor.alpha = 1.0;
};

GuiManager.prototype.hideInventory = function ()
{
	this.invAnchor.alpha = 0.0;
};
