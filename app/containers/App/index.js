/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

// vendor
import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';

// app
import LoginPage from 'containers/LoginPage/Loadable';
import SignupPage from 'containers/SignupPage/Loadable';
// import NotFoundPage from 'containers/NotFoundPage/Loadable';
// import DashboardPage from 'containers/DashboardPage/Loadable';
import auth from '../../appApi/auth';
// import Header from 'components/Header';
// import Footer from 'components/Footer';
import AppContainer from './Loadable';

const AppWrapper = styled.div`
  margin: 0 auto;
  min-height: 100%;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;

const RoutesUnAuth = () => (
  <Switch>
    <Route exact path="/" component={LoginPage} />
    <Route exact path="/signup" component={SignupPage} />
    <Route path="" component={LoginPage} />
  </Switch>
);

// const RoutesAuth = () => (
//   <div >
//     <Header />
//     <Switch>
//       <Route exact path="/" component={DashboardPage} />
//       <Route exact path="/dashboard" component={DashboardPage} />
//       <Route path="" component={NotFoundPage} />
//     </Switch>
//     <Footer />
//   </div>
// );

export default function App() {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s - rabinesite"
        defaultTitle="rabinesite"
      >
        <meta name="description" content="A rabine site" />
      </Helmet>
      { auth.loggedIn() ? <AppContainer /> : <RoutesUnAuth />}
    </AppWrapper>
  );
}
