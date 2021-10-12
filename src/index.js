import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import Home from './components/Home';
import UserList from './components/UserList';
import UserAdd from './components/UserAdd';

import { KeepAliveProvider, withKeepAlive } from './keepalive-react-component';

const App = () => {
  return (
    <Router>
      <KeepAliveProvider>
        <ul>
          <li>
            <Link to="/">首页</Link>
          </li>
          <li>
            <Link to="/list">用户列表</Link>
          </li>
          <li>
            <Link to="/add">添加用户</Link>
          </li>
        </ul>
        <Switch>
          <Route
            path={'/'}
            component={withKeepAlive(Home, { cacheId: 'Home' })}
            exact
          />
          <Route
            path={'/list'}
            component={withKeepAlive(UserList, {
              cacheId: 'UserList',
              scroll: true,
            })}
          />
          <Route
            path={'/add'}
            component={withKeepAlive(UserAdd, { cacheId: 'UserAdd' })}
          />
        </Switch>
      </KeepAliveProvider>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
