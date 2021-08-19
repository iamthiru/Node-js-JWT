import {Dimensions, Platform} from 'react-native';

const {width, height} = Dimensions.get('window');

export const FRONT_SIDE_BODY_PART_DATA = [
  {
    key: '01',
    part_name: 'Right Side ForeHead',
    value: 1,
    top: Boolean(height > 800)
      ? height * 0.03
      : height > 700
      ? height * 0.0
      : height * 0.03,
    left: Boolean(height > 800)
      ? width * 0.29
      : height > 700
      ? height * 0.15
      : width * 0.24,
  },
  {
    key: '02',
    part_name: 'Left Side ForeHead',
    value: 2,
    top: Boolean(height > 800)
      ? height * 0.03
      : height > 700
      ? height * 0.0
      : height * 0.03,
    left: Boolean(height > 800)
      ? width * 0.4
      : height > 700
      ? height * 0.2
      : width * 0.33,
  },
  {
    key: '03',
    part_name: 'Neck',
    value: 3,
    top: Boolean(height > 800 && Platform.OS === 'ios')
      ? height * 0.13
      : height > 800
      ? height * 0.12
      : height > 700
      ? height * 0.1
      : height * 0.13,
    left: Boolean(height > 800)
      ? width * 0.34
      : height > 700
      ? width * 0.35
      : width * 0.3,
  },
  {
    key: '04',
    part_name: 'Right Side Chest',
    value: 4,
    top: Boolean(height > 800)
      ? height * 0.17
      : height > 700
      ? height * 0.16
      : height * 0.17,
    left: Boolean(height > 800) ? width * 0.25 : width * 0.2,
  },
  {
    key: '05',
    part_name: 'Left Side Chest',
    value: 5,
    top: Boolean(height > 800)
      ? height * 0.17
      : height > 700
      ? height * 0.16
      : height * 0.17,
    left: Boolean(height > 800)
      ? width * 0.5
      : height > 700
      ? width * 0.5
      : width * 0.4,
  },
  {
    key: '06',
    part_name: 'Right Arm',
    value: 6,
    top: Boolean(height > 800)
      ? height * 0.25
      : height > 700
      ? height * 0.23
      : height * 0.25,
    left: Boolean(height > 800)
      ? width * 0.11
      : height > 700
      ? width * 0.13
      : width * 0.085,
  },
  {
    key: '07',
    part_name: 'Left Arm',
    value: 7,
    top: Boolean(height > 800)
      ? height * 0.25
      : height > 700
      ? height * 0.23
      : height * 0.25,
    left: Boolean(height > 800)
      ? width * 0.57
      : height > 700
      ? width * 0.59
      : width * 0.485,
  },
  {
    key: '08',
    part_name: 'Right Forearm',
    value: 8,
    top: Boolean(height > 800)
      ? height * 0.38
      : height > 700
      ? height * 0.35
      : height * 0.38,
    left: Boolean(height > 800)
      ? width * 0.09
      : height > 700
      ? width * 0.115
      : width * 0.06,
  },
  {
    key: '09',
    part_name: 'Left Forearm',
    value: 9,
    top: Boolean(height > 800)
      ? height * 0.38
      : height > 700
      ? height * 0.35
      : height * 0.38,
    left: Boolean(height > 800)
      ? width * 0.63
      : height > 700
      ? width * 0.625
      : width * 0.52,
  },
  {
    key: '10',
    part_name: 'Right Hand',
    value: 10,
    top: Boolean(height > 800)
      ? height * 0.46
      : height > 700
      ? height * 0.46
      : height * 0.46,
    left: Boolean(height > 800)
      ? width * 0.05
      : height > 700
      ? width * 0.065
      : width * 0.04,
  },
  {
    key: '11',
    part_name: 'Left Hand',
    value: 11,
    top: Boolean(height > 800)
      ? height * 0.46
      : height > 700
      ? height * 0.46
      : height * 0.46,
    left: Boolean(height > 800)
      ? width * 0.68
      : height > 700
      ? width * 0.68
      : width * 0.56,
  },
  {
    key: '12',
    part_name: 'Below Left Chest',
    value: 12,
    top: Boolean(height > 800)
      ? height * 0.25
      : height > 700
      ? height * 0.23
      : height * 0.24,
    left: Boolean(height > 800)
      ? width * 0.45
      : height > 700
      ? width * 0.48
      : width * 0.38,
  },
  {
    key: '13',
    part_name: 'Below Right Chest',
    value: 13,
    top: Boolean(height > 800)
      ? height * 0.25
      : height > 700
      ? height * 0.23
      : height * 0.24,
    left: Boolean(height > 800)
      ? width * 0.22
      : height > 700
      ? width * 0.25
      : width * 0.2,
  },
  {
    key: '14',
    part_name: 'Right to Navel',
    value: 14,
    top: Boolean(height > 800)
      ? height * 0.35
      : height > 700
      ? height * 0.35
      : height * 0.35,
    left: Boolean(height > 800)
      ? width * 0.26
      : height > 700
      ? width * 0.26
      : width * 0.2,
  },
  {
    key: '15',
    part_name: 'Left to Navel',
    value: 15,
    top: Boolean(height > 800)
      ? height * 0.35
      : height > 700
      ? height * 0.35
      : height * 0.35,
    left: Boolean(height > 800)
      ? width * 0.46
      : height > 700
      ? width * 0.45
      : width * 0.36,
  },
  {
    key: '16',
    part_name: 'penis/vagina',
    value: 16,
    top: Boolean(height > 800)
      ? height * 0.415
      : height > 700
      ? height * 0.42
      : height * 0.42,
    left: Boolean(height > 800)
      ? width * 0.345
      : height > 700
      ? width * 0.356
      : width * 0.28,
  },
  {
    key: '17',
    part_name: 'Right Thigh',
    value: 17,
    top: Boolean(height > 800)
      ? height * 0.5
      : height > 700
      ? height * 0.5
      : height * 0.5,
    left: Boolean(height > 800)
      ? width * 0.25
      : height > 700
      ? height * 0.13
      : width * 0.2,
  },
  {
    key: '18',
    part_name: 'Left Thigh',
    value: 18,
    top: Boolean(height > 800)
      ? height * 0.5
      : height > 700
      ? height * 0.5
      : height * 0.5,
    left: Boolean(height > 800)
      ? width * 0.45
      : height > 700
      ? width * 0.46
      : width * 0.37,
  },
  {
    key: '19',
    part_name: 'Right Leg',
    value: 19,
    top: Boolean(height > 800)
      ? height * 0.7
      : height > 700
      ? height * 0.7
      : height * 0.7,
    left: Boolean(height > 800)
      ? width * 0.26
      : height > 700
      ? width * 0.27
      : width * 0.21,
  },
  {
    key: '20',
    part_name: 'Left Leg',
    value: 20,
    top: Boolean(height > 800)
      ? height * 0.7
      : height > 700
      ? height * 0.7
      : height * 0.7,
    left: Boolean(height > 800)
      ? width * 0.435
      : height > 700
      ? width * 0.46
      : width * 0.375,
  },
  {
    key: '21',
    part_name: 'Right Foot',
    value: 21,
    top: Boolean(height > 800)
      ? height * 0.83
      : height > 700
      ? height * 0.855
      : height * 0.83,
    left: Boolean(height > 800)
      ? width * 0.25
      : height > 700
      ? width * 0.3
      : width * 0.2,
  },
  {
    key: '22',
    part_name: 'Left Foot',
    value: 22,
    top: Boolean(height > 800)
      ? height * 0.85
      : height > 700
      ? height * 0.86
      : height * 0.85,
    left: Boolean(height > 800)
      ? width * 0.47
      : height > 700
      ? width * 0.45
      : width * 0.4,
  },
];
export const BACK_SIDE_BODY_PARTS = [
  {
    key: '23',
    part_name: 'Head Left Side Back',
    value: 23,
    top: Boolean(height > 800)
      ? height * 0.02
      : height > 700
      ? height * 0.0
      : height * 0.035,
    left: Boolean(height > 800)
      ? width * 0.31
      : height > 700
      ? width * 0.34
      : width * 0.25,
  },
  {
    key: '24',
    part_name: 'Head Right Side Back',
    value: 24,
    top: Boolean(height > 800)
      ? height * 0.02
      : height > 700
      ? height * 0.0
      : height * 0.035,
    left: Boolean(height > 800)
      ? width * 0.41
      : height > 700
      ? width * 0.43
      : width * 0.35,
  },
  {
    key: '25',
    part_name: 'nape',
    value: 25,
    top: Boolean(height > 800 && Platform.OS === 'ios')
      ? height * 0.105
      : height > 800
      ? height * 0.08
      : height > 700
      ? height * 0.07
      : height * 0.11,
    left: Boolean(height > 800)
      ? width * 0.38
      : height > 700
      ? width * 0.4
      : width * 0.32,
  },
  {
    key: '26',
    part_name: 'Back Side Left Sholder',
    value: 26,
    top: Boolean(height > 800 && Platform.OS === 'ios')
      ? height * 0.155
      : height > 800
      ? height * 0.13
      : height > 700
      ? height * 0.125
      : height * 0.16,
    left: Boolean(height > 800)
      ? width * 0.23
      : height > 700
      ? width * 0.25
      : width * 0.2,
  },
  {
    key: '27',
    part_name: 'Back Side Right Sholder',
    value: 27,
    top: Boolean(height > 800 && Platform.OS === 'ios')
      ? height * 0.16
      : height > 800
      ? height * 0.14
      : height > 700
      ? height * 0.125
      : height * 0.16,
    left: Boolean(height > 800)
      ? width * 0.55
      : height > 700
      ? width * 0.55
      : width * 0.43,
  },
  {
    key: '28',
    part_name: 'Left Side Back',
    value: 28,
    top: Boolean(height > 800)
      ? height * 0.22
      : height > 700
      ? height * 0.21
      : height * 0.22,
    left: Boolean(height > 800)
      ? width * 0.27
      : height > 700
      ? width * 0.28
      : width * 0.2,
  },
  {
    key: '29',
    part_name: 'Right Side Back',
    value: 29,
    top: Boolean(height > 800)
      ? height * 0.22
      : height > 700
      ? height * 0.21
      : height * 0.22,
    left: Boolean(height > 800)
      ? width * 0.48
      : height > 700
      ? width * 0.48
      : width * 0.4,
  },
  {
    key: '30',
    part_name: 'Back Side Left Forearm',
    value: 30,
    top: Boolean(height > 800)
      ? height * 0.25
      : height > 700
      ? height * 0.22
      : height * 0.25,
    left: Boolean(height > 800)
      ? width * 0.135
      : height > 700
      ? width * 0.15
      : width * 0.11,
  },
  {
    key: '31',
    part_name: 'Back Side Right Forearm',
    value: 31,
    top: Boolean(height > 800)
      ? height * 0.25
      : height > 700
      ? height * 0.22
      : height * 0.25,
    left: Boolean(height > 800)
      ? width * 0.6
      : height > 700
      ? width * 0.63
      : width * 0.51,
  },
  {
    key: '32',
    part_name: 'Back Side Left Hand',
    value: 32,
    top: Boolean(height > 800)
      ? height * 0.38
      : height > 700
      ? height * 0.35
      : height * 0.38,
    left: Boolean(height > 800)
      ? width * 0.1
      : height > 700
      ? width * 0.115
      : width * 0.085,
  },
  {
    key: '33',
    part_name: 'Back Side Right Hand',
    value: 33,
    top: Boolean(height > 800)
      ? height * 0.38
      : height > 700
      ? height * 0.35
      : height * 0.38,
    left: Boolean(height > 800)
      ? width * 0.63
      : height > 700
      ? width * 0.65
      : width * 0.52,
  },
  {
    key: '34',
    part_name: 'Left BAck',
    value: 34,
    top: Boolean(height > 800)
      ? height * 0.46
      : height > 700
      ? height * 0.46
      : height * 0.46,
    left: Boolean(height > 800)
      ? width * 0.06
      : height > 700
      ? width * 0.07
      : width * 0.04,
  },
  {
    key: '35',
    part_name: 'Right Back',
    value: 35,
    top: Boolean(height > 800)
      ? height * 0.46
      : height > 700
      ? height * 0.46
      : height * 0.46,
    left: Boolean(height > 800)
      ? width * 0.68
      : height > 700
      ? width * 0.7
      : width * 0.56,
  },
  {
    key: '36',
    part_name: 'Left Hip',
    value: 36,
    top: Boolean(height > 800)
      ? height * 0.315
      : height > 700
      ? height * 0.305
      : height * 0.32,
    left: Boolean(height > 800)
      ? width * 0.3
      : height > 700
      ? width * 0.28
      : width * 0.25,
  },
  {
    key: '37',
    part_name: 'Right Hip',
    value: 37,
    top: Boolean(height > 800)
      ? height * 0.315
      : height > 700
      ? height * 0.305
      : height * 0.32,
    left: Boolean(height > 800)
      ? width * 0.46
      : height > 700
      ? width * 0.48
      : width * 0.4,
  },
  {
    key: '38',
    part_name: 'Left Buttok',
    value: 38,
    top: Boolean(height > 800)
      ? height * 0.41
      : height > 700
      ? height * 0.4
      : height * 0.4,
    left: Boolean(height > 800)
      ? width * 0.3
      : height > 700
      ? width * 0.28
      : width * 0.24,
  },
  {
    key: '39',
    part_name: 'Right Buttok',
    value: 39,
    top: Boolean(height > 800)
      ? height * 0.41
      : height > 700
      ? height * 0.4
      : height * 0.4,
    left: Boolean(height > 800)
      ? width * 0.5
      : height > 700
      ? width * 0.5
      : width * 0.42,
  },
  {
    key: '40',
    part_name: 'Back Side Left Thigh',
    value: 40,
    top: Boolean(height > 800)
      ? height * 0.5
      : height > 700
      ? height * 0.55
      : height * 0.5,
    left: Boolean(height > 800)
      ? width * 0.25
      : height > 700
      ? width * 0.28
      : width * 0.23,
  },
  {
    key: '41',
    part_name: 'Back Side Right Thigh',
    value: 41,
    top: Boolean(height > 800)
      ? height * 0.5
      : height > 700
      ? height * 0.55
      : height * 0.5,
    left: Boolean(height > 800)
      ? width * 0.48
      : height > 700
      ? width * 0.5
      : width * 0.4,
  },
  {
    key: '42',
    part_name: 'Back Side Left Leg',
    value: 42,
    top: Boolean(height > 800)
      ? height * 0.7
      : height > 700
      ? height * 0.73
      : height * 0.7,
    left: Boolean(height > 800)
      ? width * 0.28
      : height > 700
      ? width * 0.3
      : width * 0.23,
  },
  {
    key: '43',
    part_name: 'Back Side Right Leg',
    value: 43,
    top: Boolean(height > 800)
      ? height * 0.7
      : height > 700
      ? height * 0.73
      : height * 0.7,
    left: Boolean(height > 800)
      ? width * 0.48
      : height > 700
      ? width * 0.5
      : width * 0.4,
  },
  {
    key: '44',
    part_name: 'Back Side Left Feet',
    value: 44,
    top: Boolean(height > 800)
      ? height * 0.84
      : height > 700
      ? height * 0.86
      : height * 0.82,
    left: Boolean(height > 800)
      ? width * 0.3
      : height > 700
      ? width * 0.3
      : width * 0.25,
  },
  {
    key: '45',
    part_name: 'Back Side Right Feet',
    value: 45,
    top: Boolean(height > 800)
      ? height * 0.83
      : height > 700
      ? height * 0.87
      : height * 0.82,
    left: Boolean(height > 800)
      ? width * 0.48
      : height > 700
      ? width * 0.49
      : width * 0.41,
  },
];
