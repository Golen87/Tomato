function AudioManager()
{
	this.sounds = {};

	var name = 'walking_grass';
	var vol = 0.2;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( '1', 0.000, 0.42, vol );
	this.sounds[name].sound.addMarker( '2', 0.460, 0.42, vol );
	this.sounds[name].sound.addMarker( '3', 0.920, 0.42, vol );
	this.sounds[name].sound.addMarker( '4', 1.380, 0.42, vol );
	this.sounds[name].sound.addMarker( '5', 1.840, 0.42, vol );
	this.sounds[name].sound.addMarker( '6', 2.300, 0.42, vol );
	this.sounds[name].markers = ['1', '2', '3', '4', '5', '6'];

	var name = 'walking_dirt';
	var vol = 0.2;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( '1', 0.000, 0.42, vol );
	this.sounds[name].sound.addMarker( '2', 0.460, 0.42, vol );
	this.sounds[name].sound.addMarker( '3', 0.920, 0.42, vol );
	this.sounds[name].sound.addMarker( '4', 1.380, 0.42, vol );
	this.sounds[name].sound.addMarker( '5', 1.840, 0.42, vol );
	this.sounds[name].sound.addMarker( '6', 2.300, 0.42, vol );
	this.sounds[name].markers = ['1', '2', '3', '4', '5', '6'];

	var name = 'menu_inventory';
	var vol = 0.8;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( 'open',			0.000, 0.42, 0.8*vol );
	this.sounds[name].sound.addMarker( 'move_cursor',	0.460, 0.42, vol );
	this.sounds[name].sound.addMarker( 'seeds',			0.920, 0.42, vol );
	this.sounds[name].sound.addMarker( 'scythe_hoe',	1.380, 0.42, vol );
	this.sounds[name].sound.addMarker( 'watercan',		1.840, 0.42, vol );
	this.sounds[name].sound.addMarker( 'close',			2.300, 0.42, 0.8*vol );	
	this.sounds[name].sound.allowMultiple = true;

	var name = 'digging_dirt';
	var vol = 0.4;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( '1', 0.000, 0.42, vol );
	this.sounds[name].sound.addMarker( '2', 0.460, 0.42, vol );
	this.sounds[name].sound.addMarker( '3', 0.920, 0.42, vol );
	this.sounds[name].sound.addMarker( '4', 1.380, 0.42, vol );
	this.sounds[name].sound.addMarker( '5', 1.840, 0.42, vol );
	this.sounds[name].markers = ['1', '2', '3', '4', '5'];

	var name = 'planting_seed';
	var vol = 0.4;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( '1', 0.000, 0.42, vol );
	this.sounds[name].sound.addMarker( '2', 0.460, 0.42, vol );
	this.sounds[name].sound.addMarker( '3', 0.920, 0.42, vol );
	this.sounds[name].sound.addMarker( '4', 1.380, 0.42, vol );
	this.sounds[name].sound.addMarker( '5', 1.840, 0.42, vol );
	this.sounds[name].sound.addMarker( '6', 2.300, 0.42, vol );
	this.sounds[name].markers = ['1', '2', '3', '4', '5', '6'];

	var name = 'grow_pop';
	var vol = 0.08;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( '1', 0.000, 0.42, vol );
	this.sounds[name].sound.addMarker( '2', 0.460, 0.42, vol );
	this.sounds[name].sound.addMarker( '3', 0.920, 0.42, vol );
	this.sounds[name].sound.addMarker( '4', 1.380, 0.42, vol );
	this.sounds[name].sound.addMarker( '5', 1.840, 0.42, vol );
	this.sounds[name].sound.addMarker( '6', 2.300, 0.42, vol );
	this.sounds[name].markers = ['1', '2', '3', '4', '5', '6'];

	var name = 'harvest_tomato';
	var vol = 0.4;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( '1', 0.000, 0.42, vol );
	this.sounds[name].sound.addMarker( '2', 0.460, 0.42, vol );
	this.sounds[name].sound.addMarker( '3', 0.920, 0.42, vol );
	this.sounds[name].sound.addMarker( '4', 1.380, 0.42, vol );
	this.sounds[name].sound.addMarker( '5', 1.840, 0.42, vol );
	this.sounds[name].sound.addMarker( '6', 2.300, 0.42, vol );
	this.sounds[name].markers = ['1', '2', '3', '4', '5', '6'];

	var name = 'watering_crops';
	var vol = 0.4;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( '1', 0.000, 0.88, vol );
	this.sounds[name].sound.addMarker( '2', 0.920, 0.88, vol );
	this.sounds[name].sound.addMarker( '3', 1.840, 0.88, vol );
	this.sounds[name].sound.addMarker( '4', 2.760, 0.88, vol );
	this.sounds[name].sound.addMarker( '5', 3.690, 0.88, vol );
	this.sounds[name].sound.addMarker( '6', 4.610, 0.88, vol );
	this.sounds[name].markers = ['1', '2', '3', '4', '5', '6'];


	var name = 'music';
	var vol = Global.music;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.volume = vol;
	this.sounds[name].sound.loop = true;

	var name = 'ambience';
	var vol = Global.ambience;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.volume = vol;
	this.sounds[name].sound.loop = true;
};

AudioManager.prototype.getMarkers = function ( name, marker=null )
{
	if ( marker ) {
		if ( this.sounds[name].markers ) {
			return this.sounds[name].markers[marker];
		}
		else {
			return [marker];
		}
	}
	else {
		return this.sounds[name].markers;
	}
};

AudioManager.prototype.play = function ( name, marker=null )
{
	if ( !Global.sound )
		return;

	var vol = this.sounds[name].sound.volume;
	var index = '';
	var markers = this.getMarkers( name, marker );
	if ( markers )
	{
		do {
			index = markers.choice();
		}
		while (
			this.sounds[name].lastPlayed == index && markers.length > 1
		);

		this.sounds[name].lastPlayed = index;
		vol = this.sounds[name].sound.markers[index]['volume'];
	}

	this.sounds[name].sound.play( index, 0, Global.sound * vol );
};

AudioManager.prototype.updateMusic = function ()
{
	this.sounds['music'].sound.volume = Global.music;
	this.sounds['ambience'].sound.volume = Global.ambience;
};