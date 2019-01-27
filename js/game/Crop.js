function Crop( cropData )
{
	this.cropData = cropData;
	this.cropStage = this.cropData.start;
	this.lifetime = this.getLifetime();

	this.timestamp = Global.game.time.totalElapsedSeconds();
};

Crop.prototype.init = function ( sprite, x, y )
{
	this.sprite = sprite;
	this.sprite.owner = this;

	this.sprite.loadTexture( this.cropData.texture );
	this.sprite.y -= TILE_SIZE/8;
	this.sprite.anchor.set( 0, 1/2 - 1/16 );
	this.sprite.visible = true;
	this.sprite.alpha = 1.0;
	this.sprite.scale.set( 1 );

	//if ( (x+y) % 2 == 0 )
	//	this.sprite.scale.x = -1;

	this.updateSprite();
};

Crop.prototype.create = function () {};

Crop.prototype.destroy = function () {};

Crop.prototype.update = function ()
{
	var time = Global.game.time.totalElapsedSeconds();
	if ( time > this.timestamp + this.lifetime ) {
		this.grow();
	}
};


Crop.prototype.getStage = function ()
{
	return this.cropData.stages[this.cropStage];
};

Crop.prototype.grow = function ()
{
	if ( this.getStage().next ) {
		this.cropStage = this.getStage().next;

		if ( this.getStage().type != GrowthType.None ) {
			this.timestamp += this.lifetime;
			this.lifetime = this.getLifetime();
		}

		this.updateSprite();
	}
};

Crop.prototype.getLifetime = function ()
{
	var time = this.getStage().time;
	return randFloat( time[0], time[1] );
};

Crop.prototype.updateSprite = function ( power )
{
	if ( this.sprite ) {
		this.sprite.frame = this.getStage().frame;
		Global.Audio.play( 'grow_pop' );
		this.sprite.tint = 0xffffff;
		//Global.game.add.tween( this.sprite.scale ).to({ y: 1.0 }, 1000, Phaser.Easing.Linear.Out, true );
	}
}
