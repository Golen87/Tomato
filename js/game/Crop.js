
// Constructor
function Crop( cropType )
{
	this.cropType = cropType;
	this.cropStage = 0;
	this.timer = Global.game.time.totalElapsedSeconds();
	this.lifetime = randFloat( 20, 30 );
};

Crop.prototype.init = function ( sprite, x, y )
{
	this.sprite = sprite;
	this.sprite.owner = this;

	this.sprite.loadTexture( 'tomato' );
	this.sprite.frame = this.cropStage;
	this.sprite.y -= TILE_SIZE/8;
	this.sprite.anchor.set( 0, 1/2 - 1/16 );

	this.sprite.visible = true;
	this.sprite.alpha = 1.0;
	this.sprite.scale.set( 1 );
};

Crop.prototype.create = function () {};

Crop.prototype.destroy = function () {};

Crop.prototype.update = function ()
{
	var time = Global.game.time.totalElapsedSeconds();

	if ( time > this.timer + this.lifetime ) {
		this.timer += this.lifetime;
		this.lifetime = randFloat( 20, 30 );

		if (this.cropStage < 9) {
			this.cropStage += 1;
			this.updateSprite();
		}
	}
};

Crop.prototype.updateSprite = function ( power )
{
	if ( this.sprite ) {
		this.sprite.frame = this.cropStage;
	}
}


Crop.prototype.damage = function ( power )
{
};
