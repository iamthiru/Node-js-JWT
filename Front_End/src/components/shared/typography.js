import React from 'react'
import { Text, Platform } from 'react-native'

export const typography = () => {
  const oldTextRender = Text.render
  Text.render = function (...args) {
    const origin = oldTextRender.call(this, ...args)
    let fontFamily = Platform.OS === "ios" ? 'Lato-Regular' : 'Lato-Regular'
    if (origin.props.style && origin.props.style.fontWeight) {
      switch (origin.props.style.fontWeight) {
        case 'normal': break
        case '300':
          fontFamily = Platform.OS === "ios" ? 'Lato-Light' : 'Lato-Light';
          break
        case '400':
          fontFamily = Platform.OS === "ios" ? 'Lato-Regular' : 'Lato-Regular';
          break
        case '700': {
          fontFamily = Platform.OS === "ios" ? 'Lato-Bold' : 'Lato-Bold';
          break
        }
      }
    } else if (origin.props.style && Array.isArray(origin.props.style)) {
      for (let i = origin.props.style.length - 1; i >= 0; i--) {
        if (!origin.props.style[i]) {
          continue
        }
        switch (origin.props.style[i].fontWeight) {
          case 'normal': break
          case '300':
            fontFamily = Platform.OS === "ios" ? 'Lato-Light' : 'Lato-Light'
            break
          case '400':
            fontFamily = Platform.OS === "ios" ? 'Lato-Regular' : 'Lato-Regular'
            break
          case '700': {
            fontFamily = Platform.OS === "ios" ? 'Lato-Bold' : 'Lato-Bold'
            break
          }
        }
        if (fontFamily !== (Platform.OS === "ios" ? 'Lato-Regular' : 'Lato-Regular')) {
          break
        }
      }
    }
    return React.cloneElement(origin, {
      style: [{ fontFamily: fontFamily }, origin.props.style],
    })
  }
}