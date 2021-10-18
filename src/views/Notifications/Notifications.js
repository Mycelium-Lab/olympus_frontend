import React from 'react'
import { Route, Switch, useRouteMatch, Redirect } from 'react-router-dom'

import NotificationList from './NotificationList'
import NotificationControls from './NotificationControls'

export default function Notifications() {
    let { path } = useRouteMatch()
    return (
        <Switch>
            <Route exact path={path}>
                <Redirect to={`${path}/controls`} />
            </Route>
            <Route path={`${path}/controls`} component={NotificationControls} />
            <Route path={`${path}/list`} component={NotificationList} />
        </Switch>
    )
}
