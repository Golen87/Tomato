function AudioManager()
{
	this.sounds = {};

	var name = 'footsteps';
	var vol = 0.05;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( '1', 0.0, 0.3, vol );
	this.sounds[name].sound.addMarker( '2', 0.4, 0.3, vol );
	this.sounds[name].sound.addMarker( '3', 0.8, 0.3, vol );
	this.sounds[name].sound.addMarker( '4', 1.2, 0.3, vol );
	this.sounds[name].markers = ['1', '2', '3', '4'];

	var name = 'swing';
	var vol = 0.15;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.allowMultiple = true;
	this.sounds[name].sound.addMarker( '1', 0.0, 0.4, vol );
	this.sounds[name].sound.addMarker( '2', 0.5, 0.4, vol );
	this.sounds[name].sound.addMarker( '3', 1.0, 0.4, vol );
	this.sounds[name].sound.addMarker( '4', 1.5, 0.4, vol );
	this.sounds[name].markers = ['1', '2', '3', '4'];

	var name = 'chop';
	var vol = 0.3;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( '1', 0.0, 0.2, vol );
	this.sounds[name].sound.addMarker( '2', 0.3, 0.2, vol );
	this.sounds[name].sound.addMarker( '3', 0.6, 0.2, vol );
	this.sounds[name].markers = ['1', '2', '3'];

	var name = 'eating';
	var vol = 0.4;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( '1', 0.0, 0.95, vol );
	this.sounds[name].sound.addMarker( '2', 1.0, 0.95, vol );
	this.sounds[name].sound.addMarker( '3', 2.0, 0.95, vol );
	this.sounds[name].markers = ['1', '2', '3'];

	var name = 'death';
	var vol = 0.3;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.volume = vol;

	var name = 'hurt';
	var vol = 0.4;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( '1', 0.0, 0.4, vol );
	this.sounds[name].sound.addMarker( '2', 0.5, 0.4, vol );
	this.sounds[name].sound.addMarker( '3', 1.0, 0.4, vol );
	this.sounds[name].markers = ['1', '2', '3'];

	var name = 'break';
	var vol = 0.4;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.volume = vol;

	var name = 'boxPush';
	var vol = 0.4;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( '1', 0.0, 0.4, vol );
	this.sounds[name].sound.addMarker( '2', 0.5, 0.4, vol );
	this.sounds[name].sound.addMarker( '3', 1.0, 0.4, vol );
	this.sounds[name].markers = ['1', '2', '3'];

	var name = 'blockPush';
	var vol = 0.4;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( '1', 0.0, 0.9, vol );
	this.sounds[name].sound.addMarker( '2', 1.0, 0.9, vol );
	this.sounds[name].sound.addMarker( '3', 2.0, 0.9, vol );
	this.sounds[name].markers = ['1', '2', '3'];

	var name = 'crystal';
	var vol = 0.3;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.allowMultiple = true;
	this.sounds[name].sound.addMarker( 'on', 0.0, 0.9, vol );
	this.sounds[name].sound.addMarker( 'off', 1.0, 1.0, vol );
	this.sounds[name].markers = [];
	this.sounds[name].markers['on'] = ['on'];
	this.sounds[name].markers['off'] = ['off'];

	var name = 'spikes';
	var vol = 0.2;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( '1', 0.0, 0.2, vol );
	this.sounds[name].sound.addMarker( '2', 0.3, 0.2, vol );
	this.sounds[name].sound.addMarker( '3', 0.6, 0.2, vol );
	this.sounds[name].markers = ['1', '2', '3'];

	var name = 'chest';
	var vol = 0.3;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.volume = vol;

	var name = 'open';
	var vol = 0.3;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.volume = vol;

	var name = 'pressureplate';
	var vol = 0.15;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( 'on', 0.0, 0.2, vol );
	this.sounds[name].sound.addMarker( 'off', 0.3, 0.2, vol );
	this.sounds[name].markers = [];
	this.sounds[name].markers['on'] = ['on'];
	this.sounds[name].markers['off'] = ['off'];

	var name = 'monsterroom-spawn';
	var vol = 0.4;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.volume = vol;

	var name = 'menu';
	var vol = 0.3;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( 'select', 0.0, 0.2, vol );
	this.sounds[name].sound.addMarker( 'open', 0.3, 0.3, vol );
	this.sounds[name].sound.addMarker( 'close', 0.7, 0.3, vol );
	this.sounds[name].sound.addMarker( 'click', 1.1, 0.2, vol );
	this.sounds[name].markers = [];
	this.sounds[name].markers['select'] = ['select'];
	this.sounds[name].markers['open'] = ['open'];
	this.sounds[name].markers['close'] = ['close'];
	this.sounds[name].markers['click'] = ['click'];


	var vol = 0.4;
	var cryVol = 0.2;

	var name = 'rat';
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( 'cry_1', 0.0, 0.5, cryVol );
	this.sounds[name].sound.addMarker( 'cry_2', 0.6, 0.5, cryVol );
	this.sounds[name].sound.addMarker( 'cry_3', 1.2, 0.5, cryVol );
	this.sounds[name].sound.addMarker( 'hurt_1', 1.8, 0.35, vol );
	this.sounds[name].sound.addMarker( 'hurt_2', 2.25, 0.35, vol );
	this.sounds[name].sound.addMarker( 'hurt_3', 2.7, 0.35, vol );
	this.sounds[name].sound.addMarker( 'death_1', 3.15, 0.55, vol );
	this.sounds[name].sound.allowMultiple = true;
	this.sounds[name].markers = [];
	this.sounds[name].markers['cry'] = ['cry_1', 'cry_2', 'cry_3'];
	this.sounds[name].markers['hurt'] = ['hurt_1', 'hurt_2', 'hurt_3'];
	this.sounds[name].markers['death'] = ['death_1'];

	var name = 'mouse';
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( 'cry_1', 0.0, 0.2, cryVol );
	this.sounds[name].sound.addMarker( 'cry_2', 0.3, 0.2, cryVol );
	this.sounds[name].sound.addMarker( 'cry_3', 0.6, 0.2, cryVol );
	this.sounds[name].sound.addMarker( 'hurt_1', 0.9, 0.4, vol );
	this.sounds[name].sound.addMarker( 'hurt_2', 1.4, 0.4, vol );
	this.sounds[name].sound.addMarker( 'hurt_3', 1.9, 0.4, vol );
	this.sounds[name].sound.addMarker( 'death_1', 2.4, 0.3, vol );
	this.sounds[name].sound.allowMultiple = true;
	this.sounds[name].markers = [];
	this.sounds[name].markers['cry'] = ['cry_1', 'cry_2', 'cry_3'];
	this.sounds[name].markers['hurt'] = ['hurt_1', 'hurt_2', 'hurt_3'];
	this.sounds[name].markers['death'] = ['death_1'];

	var name = 'rhino';
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( 'cry_1', 0.0, 1.1, cryVol );
	this.sounds[name].sound.addMarker( 'cry_2', 1.2, 1.1, cryVol );
	this.sounds[name].sound.addMarker( 'cry_3', 2.4, 1.1, cryVol );
	this.sounds[name].sound.addMarker( 'cry_4', 3.6, 1.3, cryVol );
	this.sounds[name].sound.addMarker( 'hurt_1', 5.0, 0.6, vol );
	this.sounds[name].sound.addMarker( 'hurt_2', 5.7, 0.5, vol );
	this.sounds[name].sound.addMarker( 'hurt_3', 6.3, 0.7, vol );
	this.sounds[name].sound.addMarker( 'hurt_4', 7.1, 0.6, vol );
	this.sounds[name].sound.addMarker( 'death_1', 7.8, 0.9, vol );
	this.sounds[name].sound.allowMultiple = true;
	this.sounds[name].markers = [];
	this.sounds[name].markers['cry'] = ['cry_1', 'cry_2', 'cry_3', 'cry_4'];
	this.sounds[name].markers['hurt'] = ['hurt_1', 'hurt_2', 'hurt_3', 'hurt_4'];
	this.sounds[name].markers['groan'] = ['cry_3'];
	this.sounds[name].markers['death'] = ['death_1'];

	var name = 'spider';
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( 'cry_1', 0.0, 0.9, cryVol );
	this.sounds[name].sound.addMarker( 'cry_2', 1.0, 0.9, cryVol );
	this.sounds[name].sound.addMarker( 'cry_3', 2.0, 0.9, cryVol );
	this.sounds[name].sound.addMarker( 'cry_4', 3.0, 0.9, cryVol );
	this.sounds[name].sound.addMarker( 'hurt_1', 4.0, 0.7, vol );
	this.sounds[name].sound.addMarker( 'hurt_2', 4.8, 0.7, vol );
	this.sounds[name].sound.addMarker( 'hurt_3', 5.6, 0.7, vol );
	this.sounds[name].sound.addMarker( 'death_1', 6.4, 0.8, vol );
	this.sounds[name].sound.addMarker( 'death_2', 7.3, 0.8, vol );
	this.sounds[name].sound.allowMultiple = true;
	this.sounds[name].markers = [];
	this.sounds[name].markers['cry'] = ['cry_1', 'cry_2', 'cry_3', 'cry_4'];
	this.sounds[name].markers['hurt'] = ['hurt_1', 'hurt_2', 'hurt_3'];
	this.sounds[name].markers['death'] = ['death_1', 'death_2'];

	var name = 'slime';
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( 'cry_1', 0.0, 1.2, cryVol );
	this.sounds[name].sound.addMarker( 'cry_2', 1.3, 1.2, cryVol );
	this.sounds[name].sound.addMarker( 'cry_3', 2.6, 1.2, cryVol );
	this.sounds[name].sound.addMarker( 'hurt_1', 3.9, 1.2, vol );
	this.sounds[name].sound.addMarker( 'hurt_2', 5.2, 1.2, vol );
	this.sounds[name].sound.addMarker( 'hurt_3', 6.5, 1.2, vol );
	this.sounds[name].sound.addMarker( 'death_1', 7.8, 1.2, vol );
	this.sounds[name].sound.allowMultiple = true;
	this.sounds[name].markers = [];
	this.sounds[name].markers['cry'] = ['cry_1', 'cry_2', 'cry_3'];
	this.sounds[name].markers['hurt'] = ['hurt_1', 'hurt_2', 'hurt_3'];
	this.sounds[name].markers['death'] = ['death_1'];

	var name = 'creature';
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.addMarker( 'cry_1', 0.0, 1.6, cryVol );
	this.sounds[name].sound.addMarker( 'cry_2', 1.7, 1.3, cryVol );
	this.sounds[name].sound.addMarker( 'cry_3', 3.1, 1.3, cryVol );
	this.sounds[name].sound.addMarker( 'cry_4', 4.5, 1.7, cryVol );
	this.sounds[name].sound.addMarker( 'hurt_1', 6.3, 1.4, vol );
	this.sounds[name].sound.addMarker( 'hurt_2', 7.8, 1.4, vol );
	this.sounds[name].sound.addMarker( 'hurt_3', 9.3, 1.4, vol );
	this.sounds[name].sound.addMarker( 'death_1', 10.8, 1.1, vol );
	this.sounds[name].sound.addMarker( 'death_2', 12.0, 1.3, vol );
	this.sounds[name].sound.allowMultiple = true;
	this.sounds[name].markers = [];
	this.sounds[name].markers['cry'] = ['cry_1', 'cry_2', 'cry_3', 'cry_4'];
	this.sounds[name].markers['hurt'] = ['hurt_1', 'hurt_2', 'hurt_3'];
	this.sounds[name].markers['death'] = ['death_1', 'death_2'];

	var name = 'waves';
	var vol = Global.music;
	this.sounds[name] = {};
	this.sounds[name].sound = Global.game.add.audio( name );
	this.sounds[name].sound.volume = vol;
	this.sounds[name].sound.loop = true;
};

AudioManager.prototype.getMarkers = function ( name, marker=null )
{
	if ( marker )
		return this.sounds[name].markers[marker];
	else
		return this.sounds[name].markers;
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
	this.sounds['waves'].sound.volume = Global.music;
};