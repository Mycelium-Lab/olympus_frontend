import React from 'react'

import FirstNWalletsPane from '../components/walletAnalytics/FirstNWallets/FirstNWalletsPane'
import LargeHoldersPane from '../components/walletAnalytics/LargeHolders/LargeHoldersPane'
import BalanceByEntryDatePane from '../components/walletAnalytics/BalanceByEntryDate/BalanceByEntryDatePane'
import BalanceAgeMappingPane from '../components/walletAnalytics/BalanceAgeMapping/BalanceAgeMappingPane'
import ImportantWalletsPane from '../components/walletAnalytics/ImportantWallets/ImportantWalletsPane'

import '../styles/walletAnalytics.scss'
import {
    Redirect,
    NavLink,
    Route,
    Switch,
    useRouteMatch,
} from 'react-router-dom'

export default function WalletAnalytics() {
    let { path, url } = useRouteMatch()
    return (
        <div className="main-content">
            <div className="page-content">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-flex align-items-center justify-content-between">
                            <h5 className="page-title mb-0 font-size-18">
                                Wallet Analytics
                            </h5>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-body">
                                <ul
                                    className="nav nav-tabs nav-tabs-custom nav-justified"
                                    role="tablist"
                                >
                                    <li className="nav-item">
                                        <NavLink
                                            activeClassName="active"
                                            to={`${url}/first_n_wallets`}
                                            className="nav-link"
                                            data-toggle="tab"
                                            role="tab"
                                        >
                                            <span className="d-block d-sm-none"></span>
                                            <span className="d-none d-sm-block">
                                                First wallets analytics
                                            </span>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            to={`${url}/large_holders`}
                                            className="nav-link"
                                            data-toggle="tab"
                                            role="tab"
                                        >
                                            <span className="d-block d-sm-none"></span>
                                            <span className="d-none d-sm-block">
                                                Large holders analytics
                                            </span>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            activeClassName="active"
                                            to={`${url}/balance_by_entry_date`}
                                            className="nav-link"
                                            data-toggle="tab"
                                            role="tab"
                                        >
                                            <span className="d-block d-sm-none"></span>
                                            <span className="d-none d-sm-block">
                                                Wallet analytics by first
                                                balance date
                                            </span>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            activeClassName="active"
                                            to={`${url}/balance_age_mapping`}
                                            className="nav-link"
                                            data-toggle="tab"
                                            role="tab"
                                        >
                                            <span className="d-block d-sm-none"></span>
                                            <span className="d-none d-sm-block">
                                                Wallet Balances vs Wallet Age
                                            </span>
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            activeClassName="active"
                                            to={`${url}/important_wallets`}
                                            className="nav-link"
                                            data-toggle="tab"
                                            role="tab"
                                        >
                                            <span className="d-block d-sm-none"></span>
                                            <span className="d-none d-sm-block">
                                                Wallets lists analytics
                                            </span>
                                        </NavLink>
                                    </li>
                                </ul>

                                <div className="p-3">
                                    <Switch>
                                        <Route exact path={path}>
                                            <Redirect
                                                to={`${path}/first_n_wallets`}
                                            />
                                        </Route>
                                        <Route
                                            path={`${path}/first_n_wallets`}
                                            component={FirstNWalletsPane}
                                        />
                                        <Route
                                            path={`${path}/large_holders`}
                                            component={LargeHoldersPane}
                                        />
                                        <Route
                                            path={`${path}/balance_by_entry_date`}
                                            component={BalanceByEntryDatePane}
                                        />
                                        <Route
                                            path={`${path}/balance_age_mapping`}
                                            component={BalanceAgeMappingPane}
                                        />
                                        <Route
                                            path={`${path}/important_wallets`}
                                            component={ImportantWalletsPane}
                                        />
                                    </Switch>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
