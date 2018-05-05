import React from 'react';
import './index.less'

const BizIcon = (props) => {
  const { type } = props;
  return <i className={`iconfont icon-${type}`} />;
};
export default BizIcon;
