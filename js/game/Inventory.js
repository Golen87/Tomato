const Items = {
	'None': 0,
	'WateringCan': 1,
	'Scythe': 2,
	'Hoe': 3,
	'TomatoSeeds': 4,
	'Tomato': 5,
};

function Slot( item, quantity )
{
	this.item = item;
	this.quantity = quantity;
};


function Inventory()
{
	this.selected = 0;
	this.prevSelected = 0;
	this.show = false;

	this.invSize = [4,3];
	this.invSlots = [];
	for ( var i = 0; i < this.invSize[0] * this.invSize[1]; i++ ) {
		this.invSlots.push( new Slot( Items.None, 0 ) );
	}

	this.addItem( Items.Hoe, 1, 0 );
	this.addItem( Items.Scythe, 1, 1 );
	this.addItem( Items.WateringCan, 1, 4 );
	this.addItem( Items.TomatoSeeds, 5, 5 );

	this.updateItems();
};

Inventory.prototype.update = function ()
{
	Global.Gui.invAnchor.alpha = ( Global.Gui.invAnchor.alpha + ( this.show ? 0.25 : -0.25 ) ).clamp( 0, 0.8 );
};

Inventory.prototype.open = function ()
{
	if ( !this.show ) {
		this.show = true;
		this.prevSelected = this.selected;
		Global.Audio.play( 'menu_inventory', 'open' );
	}
};

Inventory.prototype.close = function ()
{
	if ( this.show ) {
		this.show = false;

		var item = this.getSelectedItem();
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
		Global.Gui.invSlots[i].frame = this.invSlots[i].item;
		var count = this.invSlots[i].quantity;
		Global.Gui.invSlots[i].label.setText( count > 1 ? count.toString() : '' );
	}
};

Inventory.prototype.getSelectedItem = function ()
{
	return this.invSlots[this.selected].item;
};

Inventory.prototype.findSlotWithItem = function ( item=null )
{
	for ( var i = 0; i < this.invSize[0] * this.invSize[1]; i++ ) {
		if ( this.invSlots[i].item == item ) {
			return i;
		}
	}
	return null;
};


Inventory.prototype.addItem = function ( item, quantity, slot=null )
{
	if ( slot == null ) {
		slot = this.findSlotWithItem( item );
		if ( slot == null ) {
			slot = this.findSlotWithItem( Items.None );
		}
	}

	if ( slot == null ) {
		return console.warn( "Inventory full" );
	}

	if ( this.invSlots[slot].item == item ) {
		this.invSlots[slot].quantity += quantity;
		//console.log( "Increased item at", slot, item, quantity );
	}
	else if ( this.invSlots[slot].item == Items.None ) {
		this.invSlots[slot].item = item;
		this.invSlots[slot].quantity = quantity;
		//console.log( "Set item at", slot, item, quantity );
	}
	else {
		console.error( "addItem panic" );
	}

	this.updateItems();
};

Inventory.prototype.spend = function ()
{
	this.invSlots[this.selected].quantity -= 1;

	if ( this.invSlots[this.selected].quantity <= 0 ) {
		this.invSlots[this.selected].item = Items.None;
	}

	this.updateItems();
};