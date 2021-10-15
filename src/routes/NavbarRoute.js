import React from 'react'
import Navbar from '../components/Navbar'

import { Route } from 'react-router-dom'

export default function ({ exact, path, component: Component }) {
    return (
        <Route
            exact={exact}
            path={path}
            render={(props) => (
                <>
                    <Navbar />
                    <Component {...props} />
                </>
            )}
        />
    )
}
