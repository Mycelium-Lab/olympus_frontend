import Dashboard from './views/Dashboard'
import GeneralAnalytics from './views/GeneralAnalytics'

import NavbarRoute from './routes/NavbarRoute'

import { BrowserRouter as Router, Switch } from 'react-router-dom'
import WalletAnalytics from './views/WalletAnalytics'
import Notifications from './views/Notifications/Notifications'
import Monitoring from './views/Monitoring/Monitoring'

import Messages from './components/messages/Messages'

function App() {
    return (
        <Router>
            <div>
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
                        <NavbarRoute
                            path={'/notifications'}
                            component={() => <Notifications />}
                        />
                        <NavbarRoute
                            path={'/monitoring'}
                            component={() => <Monitoring />}
                        />
                    </Switch>
                    <Messages />
                </div>
            </div>
        </Router>
    )
}

export default App
