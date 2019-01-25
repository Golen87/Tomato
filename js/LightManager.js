function LightManager() {};

LightManager.prototype.create = function ()
{
	this.lightGroup = Global.game.add.group();


	/* General darkness */
	//NORMAL, ADD, MULTIPLY, SCREEN, OVERLAY, DARKEN, LIGHTEN, COLOR_DODGE, COLOR_BURN, HARD_LIGHT, SOFT_LIGHT, DIFFERENCE, EXCLUSION, HUE, SATURATION, COLOR, LUMINOSITY

	// The FOW darkness that gets carved out by adding lights
	this.fowBmd = Global.game.make.bitmapData( SCREEN_WIDTH, SCREEN_HEIGHT );
	this.fowBmd.fill( 0, 0, 0, 1 );
	this.fowBmdAnchor = this.lightGroup.create( 0, 0, this.fowBmd );
	this.fowBmdAnchor.blendMode = Phaser.blendModes.MULTIPLY;
	this.fowBmdAnchor.alpha = 1.0;
	this.fowSpriteTemp = this.lightGroup.create( 0, 0, 'glow', 0, false );
	this.fowBmdAnchor.visible = false;

	// The additional brightness from torches. Has a max brightness limit.
	this.lightBmd = Global.game.make.bitmapData( SCREEN_WIDTH, SCREEN_HEIGHT );
	this.lightBmd.fill( 0, 0, 0, 1 );
	this.lightBmdAnchor = this.lightGroup.create( 0, 0, this.lightBmd );
	this.lightBmdAnchor.blendMode = Phaser.blendModes.COLOR_DODGE;
	this.lightBmdAnchor.alpha = 1.0;
	this.lightSpriteTemp = this.lightGroup.create( 0, 0, 'torchlight', 0, false );
	this.lightBmdAnchor.visible = false;
	//this.lightGroup.create(400, 300, 'player');
};

LightManager.prototype.update = function ()
{
	this.fowBmdAnchor.x = Global.game.camera.view.x;
	this.fowBmdAnchor.y = Global.game.camera.view.y;

	this.lightBmdAnchor.x = Global.game.camera.view.x;
	this.lightBmdAnchor.y = Global.game.camera.view.y;
};

LightManager.prototype.clear = function ()
{
	this.fowBmd.fill(255, 255, 255, 1.0);
	this.lightBmd.fill(0, 0, 0, 1.0);
};


LightManager.prototype.drawFow = function(x, y, scale=1.0, alpha=1.0)
{
	// BMD is only the size of the screen.
	x -= Global.game.camera.view.x;
	y -= Global.game.camera.view.y;

	this.fowSpriteTemp.alpha = alpha;

	var w = scale * this.fowSpriteTemp.width;
	var h = scale * this.fowSpriteTemp.height;
	var px = x - Math.floor( w / 2 );
	var py = y - Math.floor( h / 2 );
	this.fowBmd.draw(this.fowSpriteTemp, px, py, w, h, 'screen', true);
};

LightManager.prototype.drawLight = function(x, y, scale=1.0, alpha=1.0)
{
	// BMD is only the size of the screen.
	x -= Global.game.camera.view.x;
	y -= Global.game.camera.view.y;

	this.lightSpriteTemp.alpha = alpha;

	var w = scale * this.lightSpriteTemp.width;
	var h = scale * this.lightSpriteTemp.height;
	var px = x - Math.floor( w / 2 );
	var py = y - Math.floor( h / 2 );
	this.lightBmd.draw(this.lightSpriteTemp, px, py, w, h, 'exclusion', true);
};
