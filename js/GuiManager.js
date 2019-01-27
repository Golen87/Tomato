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
	this.invBg.beginFill( 0x000000, 0.7 );
	this.invBg.drawRect( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
	this.invBg.endFill();
	//this.group.add( this.invBg );
	this.invAnchor.addChild( this.invBg );
	this.invAnchor.addChild( this.invFg );

	this.invCursor = this.invAnchor.addChild( this.group.create( offsetX + 1*TILE_SIZE, offsetY + 1*TILE_SIZE, 'tile' ) );

	this.invSize = [4,3];
	this.invSlots = Array( this.invSize );
	for ( var i = 0; i < this.invSize[0] * this.invSize[1]; i++ ) {	
		//this.invSlots[i] = this.group.create( 0, 0, 'items' );
		var x = 1 + i % this.invSize[0];
		var y = 1 + Math.floor( i / this.invSize[0] );
		this.invSlots[i] = this.invFg.addChild( this.group.create( x*TILE_SIZE, y*TILE_SIZE, 'items' ) );
	}


	/* Score GUI */
	/*
	this.scoreGui = this.group.create( 0, 0, 'hud' );
	this.scoreGui.anchor.setTo( 0.0, 0.0 );

	this.scoreCount = Global.game.add.bitmapText( 0, 0, 'Pixelade', 'Score: 123', 13, this.group );
	this.scoreCount.anchor.setTo( 0.0, 0.0 );

	this.highscoreCount = Global.game.add.bitmapText( 0, 0, '04b24', 'Highscore: 123', 8, this.group );
	this.highscoreCount.anchor.setTo( 0.0, 0.0 );
	this.highscoreCount.tint = 0xBBBBBB;
	*/
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
	var quit = function() {
		if ( this.menuManager.allowInput )
		{
			this.menuManager.allowInput = false;

			Global.game.camera.fade(0xffffff, 300);
			Global.game.time.events.add( 400, function() {
				Global.game.state.start( 'MainMenu' );
			}, this);
		}
	};

	this.pauseMenu = [
		[ 'resume', resume.bind(this), null ],
		[ 'options', options.bind(this), null ],
		[ 'quit', quit.bind(this), null ],
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


	this.gameoverMenu = [
		[ 'Try again', quit.bind(this), null ],
	];
};

GuiManager.prototype.showPauseMenu = function ()
{
	this.menuManager.allowInput = true;

	var c = Global.game.camera.view;

	this.darkBg = Global.game.add.graphics( c.x, c.y );
	this.darkBg.beginFill( 0x000000, 0.75 );
	this.darkBg.drawRect( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
	this.darkBg.endFill();

	this.darkFg = Global.game.add.graphics( c.x, c.y );
	this.darkFg.beginFill( 0x000000, 0.2 );
	for (var i=0; i<SCREEN_HEIGHT/2; i++)
		this.darkFg.drawRect( 0, i*2, SCREEN_WIDTH, 1 );
	this.darkFg.endFill();

	var x = c.x+SCREEN_WIDTH/2;
	var y = c.y + 64;

	this.choiceTitle = Global.game.add.bitmapText( x, y, 'TinyUnicode', 'Pause', 16*2 );
	this.choiceTitle.anchor.setTo( 0.5, 0.5 );
	y += 24;
	this.menuManager.createMenu( x, y, this.pauseMenu );

	Global.Audio.play( 'menu', 'open' );
};

GuiManager.prototype.hidePauseMenu = function ()
{
	this.menuManager.allowInput = false;

	this.darkBg.clear();
	this.darkFg.clear();
	this.choiceTitle.kill();

	this.menuManager.killMenu();

	Global.game.input.reset();

	Global.Audio.play( 'menu', 'close' );
};


GuiManager.prototype.showGameOver = function ()
{
	var c = Global.game.camera.view;

	var x = c.x + SCREEN_WIDTH/2;
	var y = c.y + SCREEN_HEIGHT/2;

	this.darkBg = Global.game.add.graphics( c.x, c.y );
	this.darkBg.beginFill( 0x000000, 0.7 );
	this.darkBg.drawRect( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
	this.darkBg.endFill();
	this.darkBg.alpha = 0;
	Global.game.add.tween( this.darkBg ).to({ alpha: 1.0 }, 800, Phaser.Easing.Linear.In, true );

	this.choiceTitle = Global.game.add.bitmapText( x, y, 'TinyUnicode', 'Game Over', 16*2 );
	this.choiceTitle.anchor.setTo( 0.5, 0.65 );
	this.choiceTitle.tint = 0xFF0000;

	this.choiceTitle.alpha = 0;
	Global.game.add.tween( this.choiceTitle ).to({ alpha: 1 }, 800, Phaser.Easing.Quadratic.Out, true );

	Global.game.time.events.add( 1000, function() {
		var x = c.x + SCREEN_WIDTH/2;
		var y = c.y + SCREEN_HEIGHT - 20;
		this.menuManager.allowInput = true;
		this.menuManager.createMenu( x, y, this.gameoverMenu );
	}, this );
};


GuiManager.prototype.showInventory = function ()
{
	this.invAnchor.alpha = 1.0;
};

GuiManager.prototype.hideInventory = function ()
{
	this.invAnchor.alpha = 0.0;
};
