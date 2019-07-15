/* 
  contains my previous UI development work using JavaScript
  verifies user information then shows the dashboard
*/
import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";
import { connect } from "react-redux";
import { Snackbar } from "react-redux-snackbar";

import * as reducers from "../../store/reducers";

import HeaderContainer from "../HeaderContainer/HeaderContainer";
import AssetDetailsContainer from "../AssetDetailsContainer/AssetDetailsContainer";
import AssetsContainer from "../AssetsContainer/AssetsContainer";
import PersonnelDetailsContainer from "../PersonnelDetailsContainer/PersonnelDetailsContainer";
import PersonnelContainer from "../PersonnelContainer/PersonnelContainer";
import WorkOrderDetailsContainer from "../WorkOrderDetailsContainer/WorkOrderDetailsContainer";
import WorkOrdersContainer from "../WorkOrdersContainer/WorkOrdersContainer";
import HelpContainer from "../HelpContainer/HelpContainer";
import SettingsContainer from "../SettingsContainer/SettingsContainer";
import Footer from "../../components/Footer/Footer";


class DashboardContainer extends Component {
  constructor() {
    super();
    this.state = {
      notAuthenticated: false
    };
  }

  componentDidMount() {
    this.checkLogin();
  }

  checkLogin = () => {
    axios({
      method: "get",
      url: `${global.base_url}account`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      withCredentials: true
    })
      .then(res => {
        console.log(res);
        if (res.data.success === 1) {
          this.props.onStoreAccountInfo(res.data.message);
        } else {
          this.setState({
            notAuthenticated: true
          });
        }
      })
      .catch(error => {
        console.log("Error fetching and parsing data", error);
        this.setState({
          notAuthenticated: true
        });
      });
  };

  render() {
    if (this.state.notAuthenticated) {
      return <Redirect to="/" />;
    }
    return (
      <main>
        <HeaderContainer
          account={this.props.accountInfo}
          resetStore={this.props.resetStore}
        />
        <Switch>
          <Route
            exact
            path={"/dashboard/assets/:assetID"}
            name="Asset Details Container"
            component={AssetDetailsContainer}
          />
          <Route
            exact
            path={"/dashboard/assets"}
            name="Assets Container"
            component={AssetsContainer}
          />
          <Route
            exact
            path={"/dashboard/personnel/:personnelID"}
            name="Personnel Details Container"
            component={PersonnelDetailsContainer}
          />
          <Route
            exact
            path={"/dashboard/personnel"}
            name="Personnel Container"
            component={PersonnelContainer}
          />
          <Route
            exact
            path={"/dashboard/orders/:orderID"}
            name="Work Order Details Container"
            component={WorkOrderDetailsContainer}
          />
          <Route
            exact
            path={"/dashboard/orders"}
            name="Work Orders Container"
            component={WorkOrdersContainer}
          />
          <Route
            exact
            path={"/dashboard/help"}
            name="Help Container"
            component={HelpContainer}
          />
          <Route
            exact
            path={"/dashboard/settings"}
            name="Settings Container"
            render={props => (
              <SettingsContainer account={this.props.accountInfo} />
            )}
          />
          <Redirect from="/dashboard" to="/dashboard/assets" />
        </Switch>
        <Snackbar />
        <Footer />
      </main>
    );
  }
}

const mapStateToProps = state => {
  return {
    accountInfo: reducers.refreshAccountInfo(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onStoreAccountInfo: info =>
      dispatch({ type: "ACCOUNT_INFO_STORE", payload: info }),
    resetStore: () => dispatch({ type: "LOG_OUT" })
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardContainer);
