const CropType = {
	'Soil': 0,
	'Seed': 1,
	'Sprout': 2,
	'Fruit': 3,
	'Weed': 4,
};

const Crops = {
	'Tomato': {
		'texture': 'tomato',
		'start': 'seeds',
		'stages': {
			'seeds': {
				'type': CropType.Seed,
				'frame': 0,
				'time': [20,40],
				'next': 'sprout_1',
			},
			'sprout_1': {
				'type': CropType.Sprout,
				'frame': 1,
				'time': [20,40],
				'next': 'sprout_2',
				'wither': null,
			},
			'sprout_2': {
				'type': CropType.Sprout,
				'frame': 2,
				'time': [30,50],
				'next': 'sprout_3',
				'wither': null,
			},
			'sprout_3': {
				'type': CropType.Sprout,
				'frame': 3,
				'time': [30,50],
				'next': 'sprout_4',
				'wither': 'withered_1',
			},
			'sprout_4': {
				'type': CropType.Sprout,
				'frame': 4,
				'time': [30,50],
				'next': 'fruit',
				'wither': 'withered_1',
			},
			'fruit': {
				'type': CropType.Fruit,
				'frame': 5,
				'harvest': {
					'next': 'harvested',
					'item': Items.Tomato,
					'quantity': 3,
				},
				'wither': 'withered_1',
			},
			'harvested': {
				'type': CropType.Sprout,
				'frame': 6,
				'time': [200,600],
				'next': 'fruit',
				'wither': 'withered_1',
			},
			'withered_1': {
				'type': CropType.Weed,
				'frame': 7,
				'time': [100,1000],
				'next': 'withered_2',
			},
			'withered_2': {
				'type': CropType.Weed,
				'frame': 8,
			},
		},
	},
};

const Soils = {
	'texture': 'soil',

	'Watered': {
		'type': CropType.Soil,
		'frame': 0,
		'time': [60,180],
		'next': 'Wet',
		'fertility': 1,
	},
	'Wet': {
		'type': CropType.Soil,
		'frame': 1,
		'time': [120,240],
		'next': 'Dry',
		'fertility': 1/2,
	},
	'Dry': {
		'type': CropType.Soil,
		'frame': 2,
		'time': [180,600],
		'next': 'Weed_1',
		'fertility': 1/8,
	},

	'Weed_1': {
		'type': CropType.Weed,
		'frame': 3,
		'time': [180,600],
		'next': 'Weed_2',
	},
	'Weed_2': {
		'type': CropType.Weed,
		'frame': 4,
		'time': [180,600],
		'next': 'Weed_3',
	},
	'Weed_3': {
		'type': CropType.Weed,
		'frame': 5,
	},

	'Bush_1': {
		'type': CropType.Weed,
		'frame': 6,
		'time': [180,600],
		'next': 'Bush_2',
	},
	'Bush_2': {
		'type': CropType.Weed,
		'frame': 7,
		'time': [180,600],
		'next': 'Bush_3',
	},
	'Bush_3': {
		'type': CropType.Weed,
		'frame': 8,
	},
};
