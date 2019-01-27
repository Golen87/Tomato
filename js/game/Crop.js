function Crop( cropData=null )
{
	this.setCropData( cropData );

	this.cropTimestamp = null;
	this.cropLifetime = null;
	this.soilTimestamp = null;
	this.soilLifetime = null;

	this.soilType = SoilType.Dry;
};

Crop.prototype.init = function ( cropSprite, soilSprite, x, y )
{
	this.cropSprite = cropSprite;
	this.cropSprite.owner = this;

	this.cropSprite.loadTexture( CropTypes.Tomato.texture );
	this.cropSprite.y -= TILE_SIZE/8;
	this.cropSprite.anchor.set( 0, 1/2 - 1/16 );
	this.cropSprite.alpha = 1.0;
	this.cropSprite.scale.set( 1 );
	this.cropSprite.visible = false;


	this.soilSprite = soilSprite;
	this.soilSprite.owner = this;

	//this.soilSprite.loadTexture( this.cropData.texture );
	this.soilSprite.y -= TILE_SIZE/8;
	this.soilSprite.anchor.set( 0, -1/16 );
	this.soilSprite.visible = true;
	this.soilSprite.alpha = 1.0;
	this.soilSprite.scale.set( 1 );


	//if ( (x+y) % 2 == 0 )
	//	this.sprite.scale.x = -1;

	this.updateSprite();
};

Crop.prototype.create = function () {};

Crop.prototype.destroy = function () {};

Crop.prototype.update = function ()
{
	var time = Global.game.time.totalElapsedSeconds();

	if ( this.cropData ) {
		while ( time > this.cropTimestamp + this.cropLifetime && this.getStage().next ) {
			this.growCrop();
		}
	}

	while ( time > this.soilTimestamp + this.soilLifetime && this.soilType.next ) {
		this.drySoil();
	}
};


Crop.prototype.setCropData = function ( cropData )
{
	if ( cropData ) {
		this.cropData = cropData;
		this.cropStage = this.cropData.start;
		this.cropLifetime = this.getCropLifetime();
	}
	else {
		this.cropData = null;
		this.cropStage = 0;
		this.cropLifetime = 0;
	}
};

Crop.prototype.getStage = function ()
{
	if ( this.cropData ) {
		return this.cropData.stages[this.cropStage];
	}
};

Crop.prototype.growCrop = function ()
{
	if ( this.getStage().next ) {
		this.cropStage = this.getStage().next;

		if ( this.getStage().type != GrowthType.None ) {
			this.cropTimestamp += this.cropLifetime;
			this.cropLifetime = this.getCropLifetime();
		}

		Global.Audio.play( 'grow_pop' );
		this.updateSprite();
	}
};

Crop.prototype.drySoil = function ()
{
	if ( this.soilType.next ) {
		this.soilType = SoilType[this.soilType.next];

		this.soilTimestamp += this.soilLifetime;
		this.soilLifetime = this.getSoilLifetime();

		this.updateSprite();
	}
};

Crop.prototype.getCropLifetime = function ()
{
	var time = this.getStage().time;
	return randFloat( time[0], time[1] );
};

Crop.prototype.getSoilLifetime = function ()
{
	var time = this.soilType.time;
	if ( time ) {
		return randFloat( time[0], time[1] );
	}
};

Crop.prototype.updateSprite = function ()
{
	if ( this.cropSprite ) {
		if ( this.cropData ) {
			this.cropSprite.visible = true;
			this.cropSprite.frame = this.getStage().frame;
		}
		else {
			this.cropSprite.visible = false;
		}
		//Global.game.add.tween( this.cropSprite.scale ).to({ y: 1.0 }, 1000, Phaser.Easing.Linear.Out, true );
	}

	if ( this.soilSprite ) {
		this.soilSprite.frame = this.soilType.frame;
	}
};


Crop.prototype.waterCrop = function ()
{
	this.soilType = SoilType.Watered;
	this.soilTimestamp = Global.game.time.totalElapsedSeconds();
	this.soilLifetime = this.getSoilLifetime();

	this.updateSprite();
	Global.Audio.play( 'watering_crops' );
	return true;
};

Crop.prototype.cutCrop = function ()
{
	if ( this.cropData ) {
		this.setCropData( null );
		this.updateSprite();
		Global.Audio.play( 'scythe_swing' );

		return true;
	}
	return false;
};

/*Crop.prototype.digCrop = function ()
{
};*/

Crop.prototype.plantCrop = function ( cropData )
{
	if ( this.cropData == null && cropData != null ) {
		this.setCropData( cropData );
		this.updateSprite();
		Global.Audio.play( 'planting_seed' );
		this.cropTimestamp = Global.game.time.totalElapsedSeconds();

		return true;
	}
	return false;
};
