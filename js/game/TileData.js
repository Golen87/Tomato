const TileTypes = {
	'None': 1,
	'Grass': 2,
	'Dirt': 3,
	'Water': 4,
	'Tree': 5,
	'Bush': 6,
	'Shrub': 7,
	'Crop': 8,
};

const Tiles = {
	'Grass': {
		'pos': [[0,0], [1,0], [2,0]]
	},
	'Dirt': {
		'pos': [[0,1], [1,1], [2,1]]
	},
	'Water': {
		'pos': [[0,2], [1,2], [2,2]]
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
		"ground": 3,
		"grass_edge": 6,
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
