
// Constructor
function MenuManager ()
{
	this.allowInput = true;
	this.startPosition = new Phaser.Point( 0, 0 );
	this.corners = null;

	this.history = [];

	this.animationTime = 500;
	this.animationDist = 96;
	this.animationDelay = 0;
	this.easing = Phaser.Easing.Quartic.Out;

	this.separation = 12;

	this.setupInput();
}

MenuManager.prototype.setupInput = function ()
{
	var key = Global.game.input.keyboard.addKey( Phaser.Keyboard.DOWN );
	key.onDown.add( function() {this.nextChoice( 1 );}, this );
	var key = Global.game.input.keyboard.addKey( Phaser.Keyboard.S );
	key.onDown.add( function() {this.nextChoice( 1 );}, this );
	var key = Global.game.input.keyboard.addKey( Phaser.Keyboard.UP );
	key.onDown.add( function() {this.nextChoice( -1 );}, this );
	var key = Global.game.input.keyboard.addKey( Phaser.Keyboard.W );
	key.onDown.add( function() {this.nextChoice( -1 );}, this );

	var key = Global.game.input.keyboard.addKey( Phaser.Keyboard.RIGHT );
	key.onDown.add( function() {this.pickChoice( 1 );}, this );
	var key = Global.game.input.keyboard.addKey( Phaser.Keyboard.D );
	key.onDown.add( function() {this.pickChoice( 1 );}, this );
	var key = Global.game.input.keyboard.addKey( Phaser.Keyboard.LEFT );
	key.onDown.add( function() {this.pickChoice( -1 );}, this );
	var key = Global.game.input.keyboard.addKey( Phaser.Keyboard.A );
	key.onDown.add( function() {this.pickChoice( -1 );}, this );

	var key = Global.game.input.keyboard.addKey( Phaser.Keyboard.SPACEBAR );
	key.onDown.add( function() {this.pickChoice();}, this );
	var key = Global.game.input.keyboard.addKey( Phaser.Keyboard.ENTER );
	key.onDown.add( function() {this.pickChoice();}, this );
};

MenuManager.prototype.update = function ()
{
	if ( this.corners )
	{
		for ( var i=0; i<4; i++ )
		{
			var corner = this.corners[i];
			corner.anchor.x = 0.5 + 0.25 * Math.sin( 1.6 * Global.game.time.totalElapsedSeconds() * Math.PI );
		}
	}
};

MenuManager.prototype.createMenu = function ( x, y, choiceList )
{
	this.startPosition.set( x, y );

	this.choiceList = choiceList;

	this.selection = 0;

	this.labels = [];
	for ( var i=0; i<this.choiceList.length; i++ )
	{
		var label = this.createLabel( x, y, this.choiceList[i] );
		this.labels.push( label );
		y += this.separation;
	}


	this.corners = [];
	this.corners.push( Global.game.add.sprite( 0, 0, 'corner' ) );
	this.corners[0].scale.set( 1, 1 );
	this.corners.push( Global.game.add.sprite( 0, 0, 'corner' ) );
	this.corners[1].scale.set( 1, -1 );
	this.corners.push( Global.game.add.sprite( 0, 0, 'corner' ) );
	this.corners[2].scale.set( -1, 1 );
	this.corners.push( Global.game.add.sprite( 0, 0, 'corner' ) );
	this.corners[3].scale.set( -1, -1 );

	this.nextChoice( 0 );
};

MenuManager.prototype.createLabel = function ( x, y, choice )
{
	var label = Global.game.add.bitmapText( x, y, 'TinyUnicode', choice[0], 16 );
	label.anchor.x = Math.round(label.textWidth * 0.5) / label.textWidth;
	label.anchor.y = Math.round(label.textHeight * 0.6) / label.textHeight;
	label.tint = 0x333333;
	label.function = choice[1];
	return label;
};

MenuManager.prototype.nextMenu = function ( choiceList )
{
	this.history.push( [this.choiceList, this.selection, this.labels] );
	for ( var i=0; i<this.labels.length; i++ )
	{
		Global.game.add.tween( this.labels[i] ).to({ x: this.startPosition.x - this.animationDist, alpha: 0 }, this.animationTime, this.easing, true, this.animationDelay*i );
	}

	this.choiceList = choiceList;

	this.selection = 0;

	var x = this.startPosition.x;
	var y = this.startPosition.y;
	this.labels = [];
	for ( var i=0; i<this.choiceList.length; i++ )
	{
		var label = this.createLabel( x, y, this.choiceList[i] );
		this.labels.push( label );
		y += this.separation;

		label.x += this.animationDist;
		label.alpha = 0;
		Global.game.add.tween( label ).to({ x: this.startPosition.x, alpha: 1 }, this.animationTime, this.easing, true, this.animationDelay*i );
	}

	for ( var i=0; i<4; i++ )
	{
		this.corners[i].x = this.corners[i].startX + this.animationDist;
		this.corners[i].alpha = 0;
		Global.game.add.tween( this.corners[i] ).to({ x: this.corners[i].startX, alpha: 1 }, this.animationTime, this.easing, true, this.animationDelay*this.selection );
	}

	this.nextChoice( 0 );
};

MenuManager.prototype.previousMenu = function ()
{
	if ( this.history.length == 0 )
		return;

	for ( var i=0; i<this.labels.length; i++ )
	{
		Global.game.add.tween( this.labels[i] ).to({ x: this.startPosition.x + this.animationDist, alpha: 0 }, this.animationTime, this.easing, true, this.animationDelay*i );
		Global.game.time.events.add( this.animationTime, this.labels[i].kill, this.labels[i] );
	}

	var previousMenu = this.history.pop();
	this.choiceList = previousMenu[0];
	this.selection = previousMenu[1];
	this.labels = previousMenu[2];

	for ( var i=0; i<this.labels.length; i++ )
	{
		Global.game.add.tween( this.labels[i] ).to({ x: this.startPosition.x, alpha: 1 }, this.animationTime, this.easing, true, this.animationDelay*i );
	}

	for ( var i=0; i<4; i++ )
	{
		this.corners[i].x = this.corners[i].startX - this.animationDist;
		this.corners[i].alpha = 0;
		Global.game.add.tween( this.corners[i] ).to({ x: this.corners[i].startX, alpha: 1 }, this.animationTime, this.easing, true, this.animationDelay*this.selection );
	}

	this.nextChoice( 0 );
};

MenuManager.prototype.killMenu = function ()
{
	for ( var i=0; i<this.labels.length; i++ )
	{
		this.labels[i].kill();
	}

	for ( var i=0; i<4; i++ )
	{
		this.corners[i].kill();
	}
	this.corners = null;

	for ( var i=0; i<this.history.length; i++ )
	{
		var menu = this.history[i];
		this.choiceList = menu[0];
		this.selection = menu[1];
		this.labels = menu[2];

		for ( var j=0; j<this.labels.length; j++ )
		{
			this.labels[j].kill();
		}
	}
};

MenuManager.prototype.nextChoice = function ( inc )
{
	if ( this.allowInput )
	{
		this.labels[this.selection].tint = 0x333333;

		this.selection += inc + this.labels.length; // Avoid negative modulo
		this.selection %= this.labels.length;

		this.labels[this.selection].tint = 0xffffff;

		for ( var i=0; i<4; i++ )
		{
			var corner = this.corners[i];
			corner.anchor.set( 0.5 );

			var y = this.labels[this.selection].y - corner.scale.y * 4;
			if ( corner.x == 0 && corner.y == 0 )
			{
				corner.x = this.startPosition.x - corner.scale.x * 30;
				corner.startX = corner.x;
				corner.y = y;
			}
			else
				Global.game.add.tween( corner ).to({ y: y }, 200, Phaser.Easing.Exponential.Out, true );
		}

		if ( inc != 0 && this.labels.length > 1 )
			Global.Audio.play( 'menu', 'select' );
	}
};

MenuManager.prototype.pickChoice = function ( inc=null )
{
	if ( this.allowInput )
	{
		if ( inc && this.choiceList[this.selection][2] )
			var newText = this.choiceList[this.selection][2]( inc );
		else if ( this.choiceList[this.selection][1] )
			var newText = this.choiceList[this.selection][1]();

		if ( newText )
		{
			this.labels[this.selection].text = newText;
		}

		Global.Audio.play( 'menu', 'click' );
	}
};
