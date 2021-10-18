import React from 'react'
import { Route, Switch, useRouteMatch, Redirect } from 'react-router-dom'

import TwitterMonitoring from './TwitterMonitoring'
import DaoMonitoring from './DaoMonitoring'

export default function Monitoring() {
    let { path } = useRouteMatch()
    return (
        <Switch>
            <Route exact path={path}>
                <Redirect to={`${path}/twitter`} />
            </Route>
            <Route path={`${path}/twitter`} component={TwitterMonitoring} />
            <Route path={`${path}/dao`} component={DaoMonitoring} />
        </Switch>
    )
}
