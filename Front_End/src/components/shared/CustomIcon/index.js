import React from 'react'
import { createIconSetFromIcoMoon } from 'react-native-vector-icons'
import iconConfig from '../../../../selection.json'


const CustomIcon = createIconSetFromIcoMoon(iconConfig, 'icomoon', 'icomoon.ttf')

export default CustomIcon