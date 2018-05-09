import React, { PureComponent } from 'react';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import classNames from 'classnames';
// import styles from './ImageConfigDetail.less'

export default class ImageConfigDetail extends PureComponent {

  // 数据初始化
  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    console.log(params);
  }

  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          ImageConfigDetail
        </Card>
      </PageHeaderLayout>
    );
  }
}
