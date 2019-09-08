import React from 'react';
import Svg, { Path } from 'react-native-svg';

// Similar to
// https://github.com/Templarian/MaterialDesign-React
const SvgIcon = ({ path, color, pointerEvents, style, ...rest }) => {
  style = Object.assign({}, style, rest);
  style.width = style.width || 24;
  style.height = style.height || 24;
  return (
    <Svg viewBox="0 0 24 24" style={style} pointerEvents={pointerEvents}>
      <Path d={path} fill={color} />
    </Svg>
  );
};

export default SvgIcon;
