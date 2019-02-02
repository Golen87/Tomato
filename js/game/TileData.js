const TileTypes = {
	'None': 1,
	'Grass': 2,
	'Dirt': 3,
	'Tree': 4,
	'Bush': 5,
	'Crop': 6,
};

const Tiles = {
	'Grass': {
		'pos': [[0,0], [1,0], [2,0]]
	},
	'Dirt': {
		'pos': [[0,1], [1,1], [2,1]]
		/*'pos': [
			[1+3,0+3], [1+0,0+3], [1+3,0+0], [1+0,0+0],
			[1+2,0+3], [1+1,0+3], [1+2,0+0], [1+1,0+0],
			[1+3,0+2], [1+0,0+2], [1+3,0+1], [1+0,0+1],
			[1+2,0+2], [1+1,0+2], [1+2,0+1], [1+1,0+1],
		]*/
	},

	'Bush': {
		'pos': [[0,0], [0,1], [0,2]]
	},
	'Tomato': {
		'pos': [[0,0], [0,1], [0,2]]
	},
};


function posToIndex( tileset, pos )
{
	var tilesetWidth = {
		"ground": 3
	}[tileset];
	return pos[0] + pos[1] * tilesetWidth;
}

Array.prototype.toIndex = function( tileset ) {
	var res = []
	for (var i = 0; i < this.length; i++) {
		res.push(posToIndex( tileset, this[i] ));
	}
	return res;
};
