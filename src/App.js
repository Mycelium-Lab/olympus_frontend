import Main from './components/Main'
import WalletAnalyticsChart from './components/WalletAnalyticsChart'
import Dashboard from './views/Dashboard'

import NavbarRoute from './routes/NavbarRoute'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

function App() {
    return (
        <Router>
            <div class="container-fluid">
                <div id="layout-wrapper">
                    <Switch>
                        <Route
                            exact
                            path="/wallet_analytics"
                            component={() => <WalletAnalyticsChart />}
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
