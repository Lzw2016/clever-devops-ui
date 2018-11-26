import React, { Component } from 'react';
import { connect } from 'dva';
// import { Link } from 'dva/router';
import { Checkbox, Alert } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    const { type, autoLogin } = this.state;
    const { dispatch } = this.props;
    if (!err) {
      dispatch({ type: 'login/login', payload: { ...values, type, autoLogin } });
    }
  };

  changeAutoLogin = e => {
    this.setState({ autoLogin: e.target.checked });
  };

  renderMessage = content => {
    return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
  };

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
          <Tab key="account" tab="账户密码登录">
            {login.status === 'error' && login.type === 'account' && !submitting && this.renderMessage('账户或密码错误')}
            <UserName name="userName" placeholder="用户名" rules={[{ required: true, whitespace: true, message: '请输入用户名!' }]} />
            <Password name="password" placeholder="密码" rules={[{ required: true, message: '请输入密码!' }]} />
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              忘记密码
            </a>
          </div>
          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}
