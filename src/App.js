import Main from './components/Main'
import WalletAnalyticsChart from './components/WalletAnalyticsChart'
import FirstNWallets from './components/walletAnalytics/FirstNWallets'
import Dashboard from './views/Dashboard'

import NavbarRoute from './routes/NavbarRoute'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import LargeHolders from './components/walletAnalytics/LargeHolders'

function App() {
    return (
        <Router>
            <div className="container-fluid">
                <div id="layout-wrapper">
                    <Switch>
                        <Route
                            exact
                            path="/wallet_analytics"
                            component={() => (
                                <>
                                    <FirstNWallets
                                        startTime={1617291702}
                                        days={250}
                                        n_wallets={10}
                                        render={(state) => (
                                            <WalletAnalyticsChart {...state} />
                                        )}
                                    />
                                    <LargeHolders
                                        startTime={1617291702}
                                        days={250}
                                        min_amount={10000}
                                        render={(state) => (
                                            <WalletAnalyticsChart {...state} />
                                        )}
                                    />
                                </>
                            )}
                        />
                        <Route
                            exact
                            path="/general_analytics"
                            component={() => <Main />}
                        />
                        <NavbarRoute
                            exact
                            path={['/', '/dashboard']}
                            component={() => <Dashboard />}
                        />
                    </Switch>
                </div>
            </div>
        </Router>
    )
}

export default App
