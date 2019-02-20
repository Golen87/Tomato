function Crop( cropData=null )
{
	this.cropTimer = null; // The timestamp at which the crop updates
	this.soilTimer = null; // The timestamp at which the soil updates

	this.soil = null;
	this.setSoilType( Soils.Dry, getTime() );

	this.crop = null;
	this.cropStage = null;
	this.cropTimer = null;
	this.setCropData( cropData );
};

Crop.prototype.init = function ( cropSprite, soilSprite, x, y )
{
	this.cropSprite = cropSprite;
	this.cropSprite.owner = this;

	this.cropSprite.loadTexture( Crops.Tomato.texture );
	this.cropSprite.y += TILE_SIZE/8;
	this.cropSprite.anchor.set( 0, 1/2 + 1/16 );
	this.cropSprite.alpha = 1.0;
	this.cropSprite.scale.set( 1 );
	this.cropSprite.visible = false;


	this.soilSprite = soilSprite;
	this.soilSprite.owner = this;

	this.soilSprite.loadTexture( Soils.texture );
	this.soilSprite.visible = true;
	this.soilSprite.anchor.set( 0, 1/2 );
	this.soilSprite.alpha = 1.0;
	this.soilSprite.scale.set( 1 );

	//if ( (x+y) % 2 == 0 )
	//	this.sprite.scale.x = -1;

	this.update( false );
	this.updateSprite();
};

Crop.prototype.updateSprite = function ()
{
	if ( this.cropSprite ) {
		if ( this.crop ) {
			this.cropSprite.visible = true;
			this.cropSprite.frame = this.getStage().frame;
		}
		else {
			this.cropSprite.visible = false;
		}
	}

	if ( this.soilSprite ) {
		if ( this.soil ) {
			this.soilSprite.visible = true;
			this.soilSprite.frame = this.soil.frame;
			if ( this.soil.type == CropType.Soil ) {
				this.soilSprite.y = this.cropSprite.y - TILE_SIZE/16;
				this.soilSprite.anchor.y = this.cropSprite.anchor.y - 1/32;
			} else {
				this.soilSprite.y = this.cropSprite.y + TILE_SIZE/16;
				this.soilSprite.anchor.y = this.cropSprite.anchor.y + 1/32;
			}
		}
		else {
			this.soilSprite.visible = false;
		}
	}
};

Crop.prototype.setCropData = function ( cropData )
{
	if ( cropData ) {
		this.crop = cropData;
		this.cropStage = this.crop.start;
		this.resetCropTimer( getTime() );
	}
	else {
		this.crop = null;
		this.cropStage = null;
		this.cropTimer = null;
	}
};

Crop.prototype.getStage = function ()
{
	if ( this.crop ) {
		return this.crop.stages[this.cropStage];
	}
};


/* ==== Crop growth ==== */

Crop.prototype.update = function ( exists=true )
{
	if ( this.cropSprite ) {
		var time = getTime();

		var updated = true;
		while ( updated ) {
			updated = false;

			// Ensures cropTimer is sooner than soilTimer
			if ( this.cropTimer && ( !this.soilTimer || this.cropTimer < this.soilTimer ) ) {
				if ( time > this.cropTimer ) {
					updated = this.growCrop( this.cropTimer, exists );
				}
			}
			else if ( this.soilTimer ) {
				if ( time > this.soilTimer ) {
					updated = this.drySoil( this.soilTimer, exists );
				}
			}
		}
	}
};

Crop.prototype.resetCropTimer = function ( time )
{
	var stage = this.getStage();

	if ( stage.next && stage.time ) {
		this.cropTimer = time + randFloat( stage.time[0], stage.time[1] );
		this.multCropTimer( time, this.soil.fertility );
	}
	else {
		this.cropTimer = null;
	}
};

Crop.prototype.growCrop = function ( time, exists )
{
	if ( this.getStage().next ) {
		this.cropStage = this.getStage().next;
		this.resetCropTimer( time );
		this.updateSprite();
		if ( exists ) {
			Global.Audio.play( 'grow_pop' );
		}

		return true;
	}
	return false;
	//Global.game.add.tween( this.cropSprite.scale ).to({ y: 1.0 }, 1000, Phaser.Easing.Linear.Out, true );
};

Crop.prototype.starveCrop = function ( time, exists )
{
	var stage = this.getStage();

	if ( stage/* && stage.type == CropType.Sprout*/ ) {
		if ( stage.wither ) {
			this.cropStage = stage.wither;
			this.resetCropTimer( time );
			if ( exists ) {
				Global.Audio.play( 'grow_pop' );
			}
		}
		else {
			this.setCropData( null );
		}
		this.updateSprite();
	}
};

Crop.prototype.resetSoilTimer = function ( time )
{
	if ( this.soil && this.soil.next ) {
		var t = this.soil.time;
		this.soilTimer = time + randFloat( t[0], t[1] );
	}
	else {
		this.soilTimer = null;
	}
};

Crop.prototype.drySoil = function ( time, exists )
{
	if ( this.soil.next ) {
		if ( this.soil == Soils.Dry ) {
			// Check if fruit
			this.starveCrop( time, exists );
		}

		this.setSoilType( Soils[this.soil.next], time );
		this.updateSprite();

		return true;
	}
	return false;
};

Crop.prototype.setSoilType = function ( newSoil, time )
{
	if ( this.soil != newSoil || newSoil == Soils.Watered ) {
		var stage = this.getStage();
		if ( stage && this.cropTimer ) {
			if ( this.soil ) {
				this.multCropTimer( time, 1 / this.soil.fertility );
			}
			if ( newSoil ) {
				this.multCropTimer( time, newSoil.fertility );
			}
		}

		this.soil = newSoil;
		this.resetSoilTimer( time );
	}
};

Crop.prototype.multCropTimer = function ( time, fertility )
{
	if ( time > this.cropTimer ) {
		return console.warn( "multCropTimer called after timer expiration" );
	}

	this.cropTimer = time + (this.cropTimer - time) / fertility;
};


/* ==== Player interaction ==== */

Crop.prototype.waterCrop = function ()
{
	if ( this.soil && this.soil.type == CropType.Soil ) {
		this.setSoilType( Soils.Watered, getTime() );
		this.updateSprite();
		Global.Audio.play( 'watering_crops' );

		return true;
	}
	return false;
};

Crop.prototype.cutCrop = function ()
{
	var success = false;

	if ( this.soil && this.soil.type == CropType.Weed ) {
		this.setSoilType( null );
		this.updateSprite();
		success = true;
	}

	var stage = this.getStage();
	if ( stage && ( stage.type == CropType.Sprout || stage.type == CropType.Weed ) ) {
		this.setCropData( null );
		this.updateSprite();
		success = true;
	}

	if ( success ) {
		Global.Audio.play( 'scythe_swing' );
	}
	return success;
};

Crop.prototype.digCrop = function ()
{
	if ( !this.crop && !this.soil ) {
		this.setSoilType( Soils.Dry, getTime() );
		this.updateSprite();
		Global.Audio.play( 'digging_dirt' );

		return true;
	}
	return false;
};

Crop.prototype.plantCrop = function ( cropData )
{
	if ( this.crop == null && cropData != null ) {
		if ( this.soil && this.soil.type == CropType.Soil ) {
			this.setCropData( cropData );
			this.resetSoilTimer( getTime() );
			this.updateSprite();
			Global.Audio.play( 'planting_seed' );

			return true;
		}
	}
	return false;
};

Crop.prototype.canHarvest = function ()
{
	var stage = this.getStage();
	return stage && stage.type == CropType.Fruit && stage.harvest;
};

Crop.prototype.harvestCrop = function ( container )
{
	var stage = this.getStage();

	if ( this.canHarvest() ) {
		this.cropStage = stage.harvest.next;
		this.resetCropTimer( getTime() );
		this.updateSprite();
		Global.Audio.play( 'harvest_tomato' );

		return [stage.harvest.item, stage.harvest.quantity];
	}
};
