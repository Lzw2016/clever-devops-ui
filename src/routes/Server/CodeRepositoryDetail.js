import React, { PureComponent } from 'react';
import { Card } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
// import classNames from 'classnames';
// import styles from './CodeRepositoryDetail.less'

export default class CodeRepositoryDetail extends PureComponent {

  // 数据初始化
  componentDidMount() {
    const { dispatch, match: { params } } = this.props;
    console.log(params);
  }

  render() {
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          CodeRepositoryDetail
        </Card>
      </PageHeaderLayout>
    );
  }
}
