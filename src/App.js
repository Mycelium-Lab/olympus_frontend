import Dashboard from './views/Dashboard'
import GeneralAnalytics from './views/GeneralAnalytics'

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
                        <NavbarRoute
                            exact
                            path="/general_analytics"
                            component={() => <GeneralAnalytics />}
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
