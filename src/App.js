import Main from './components/Main'
import Dashboard from './views/Dashboard'

import NavbarRoute from './routes/NavbarRoute'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import WalletAnalytics from './views/WalletAnalytics'

function App() {
    return (
        <Router>
            <div className="container-fluid">
                <div id="layout-wrapper">
                    <Switch>
                        <NavbarRoute
                            path="/wallet_analytics"
                            component={() => <WalletAnalytics />}
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
