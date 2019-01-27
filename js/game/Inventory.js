const Items = {
	'None': 0,
	'WateringCan': 1,
	'Scythe': 2,
	'Hoe': 3,
	'TomatoSeeds': 4,
	'Tomato': 5,
};


function Inventory()
{
	this.selected = 0;
	this.show = false;

	this.invSize = [4,3];
	this.invSlots = [
		Items.Hoe, Items.Scythe, Items.None, Items.None,
		Items.WateringCan, Items.TomatoSeeds, Items.None, Items.None,
		Items.None, Items.None, Items.None, Items.None,
	];
	this.updateItems();
};

Inventory.prototype.open = function ()
{
	if ( !this.show ) {
		this.show = true;
		Global.Audio.play( 'menu_inventory', 'open' );
	}
};

Inventory.prototype.close = function ()
{
	if ( this.show ) {
		this.show = false;

		var item = this.getItem();
		if ( item == Items.WateringCan ) {
			Global.Audio.play( 'menu_inventory', 'watercan' );
		}
		else if ( item == Items.Scythe || item == Items.Hoe ) {
			Global.Audio.play( 'menu_inventory', 'scythe_hoe' );
		}
		else if ( item == Items.TomatoSeeds || item == Items.Tomato ) {
			Global.Audio.play( 'menu_inventory', 'seeds' );
		}
		else {
			Global.Audio.play( 'menu_inventory', 'close' );
		}
	}
};

Inventory.prototype.update = function ()
{
	Global.Gui.invAnchor.alpha = ( Global.Gui.invAnchor.alpha + ( this.show ? 0.25 : -0.25 ) ).clamp( 0, 0.8 );
};


Inventory.prototype.moveSelection = function ( dx, dy )
{
	var x = this.selected % this.invSize[0];
	var y = Math.floor( this.selected / this.invSize[0] );

	x = ( x + dx + this.invSize[0] ) % this.invSize[0];
	y = ( y + dy + this.invSize[1] ) % this.invSize[1];

	this.selected = x + y * this.invSize[0];

	var offsetX = TILE_SIZE * (ROOM_WIDTH/2-3);
	var offsetY = TILE_SIZE * (ROOM_HEIGHT/2-2.5);
	Global.Gui.invCursor.x = offsetX + (x+1) * TILE_SIZE;
	Global.Gui.invCursor.y = offsetY + (y+1) * TILE_SIZE;

	Global.Audio.play( 'menu_inventory', 'move_cursor' );
};

Inventory.prototype.updateItems = function ()
{
	for ( var i = 0; i < this.invSize[0] * this.invSize[1]; i++ ) {	
		Global.Gui.invSlots[i].frame = this.invSlots[i];
	}
};

Inventory.prototype.getItem = function ()
{
	return this.invSlots[this.selected];
};
