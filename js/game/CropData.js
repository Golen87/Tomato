const GrowthType = {
	'None': 0,
	'Normal': 1,
	'NeedsWater': 2,
	'WaterBoost': 3,
	'WaterOrWither': 4,
};

const CropTypes = {
	'Tomato': {
		'texture': 'tomato',
		'start': 'seeds',
		'stages': {
			'seeds': {
				'frame': 0,
				'time': [10,20],
				'type': GrowthType.NeedsWater,
				'next': 'sprout_1',
			},
			'sprout_1': {
				'frame': 1,
				'time': [10,20],
				'type': GrowthType.WaterBoost,
				'next': 'sprout_2',
			},
			'sprout_2': {
				'frame': 2,
				'time': [10,20],
				'type': GrowthType.WaterBoost,
				'next': 'sprout_3',
			},
			'sprout_3': {
				'frame': 3,
				'time': [10,20],
				'type': GrowthType.WaterBoost,
				'next': 'sprout_4',
			},
			'sprout_4': {
				'frame': 4,
				'time': [10,20],
				'type': GrowthType.WaterBoost,
				'next': 'fruit',
			},
			'fruit': {
				'frame': 5,
				'time': [40,60],
				'type': GrowthType.Normal,
				'next': 'harvested',
			},
			'harvested': {
				'frame': 6,
				'time': [10,20],
				'type': GrowthType.WaterOrWither,
				'next': 'withered_1',
			},
			'withered_1': {
				'frame': 7,
				'time': [10,20],
				'type': GrowthType.WaterOrWither,
				'next': 'withered_1',
			},
			'withered_2': {
				'frame': 8,
				'type': GrowthType.None,
			},
		},
	},
	'Weed': {
		'texture': 'weed',
		'stages': {
			'weed_1': {
				'time': [10,20],
				'type': GrowthType.Normal,
				'next': 'weed_2',
			},
			'weed_2': {
				'type': GrowthType.None,
			},
		}
	},
};