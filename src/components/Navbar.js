import React from 'react'
import logo from '../images/logo.png'
import avatar from '../images/avatar.jpg'

import '../styles/navbar.scss'

export default function Navbar() {
    return (
        <header id="page-topbar">
            <div className="navbar-header">
                <div className="d-flex">
                    <div className="navbar-brand-box">
                        <a href="/" className="logo logo-light">
                            <span className="logo-sm">
                                <img src={logo} alt="" height="30" />
                            </span>
                            <span className="logo-lg">
                                <img src={logo} alt="" height="30" />
                            </span>
                        </a>
                    </div>

                    <button
                        type="button"
                        className="btn btn-sm px-3 font-size-16 d-lg-none header-item waves-effect waves-light"
                        data-toggle="collapse"
                        data-target="#topnav-menu-content"
                    >
                        <i className="fa fa-fw fa-bars"></i>
                    </button>

                    <div className="topnav">
                        <nav className="navbar navbar-light navbar-expand-lg topnav-menu">
                            <div
                                className="collapse navbar-collapse"
                                id="topnav-menu-content"
                            >
                                <ul className="navbar-nav">
                                    <li className="nav-item ">
                                        <a
                                            className={`nav-link ${
                                                window.location.pathname ===
                                                    '/' ||
                                                window.location.pathname ===
                                                    '/dashboard'
                                                    ? 'active-collapse'
                                                    : ''
                                            }`}
                                            href="/dashboard"
                                        >
                                            Dashboard
                                        </a>
                                    </li>

                                    <li className="nav-item ">
                                        <a
                                            className={`nav-link ${
                                                window.location.pathname ===
                                                '/general_analytics'
                                                    ? 'active-collapse'
                                                    : ''
                                            }`}
                                            href="/general_analytics"
                                        >
                                            General Analytics
                                        </a>
                                    </li>

                                    <li className="nav-item">
                                        <a
                                            className={`nav-link ${
                                                window.location.pathname.includes(
                                                    '/wallet_analytics'
                                                )
                                                    ? 'active-collapse'
                                                    : ''
                                            }`}
                                            href="/wallet_analytics"
                                        >
                                            Wallet Analytics
                                        </a>
                                    </li>

                                    <li className="nav-item dropdown">
                                        <a
                                            className={`nav-link dropdown-toggle arrow-none ${
                                                window.location.pathname.includes(
                                                    '/notifications'
                                                )
                                                    ? 'active-collapse'
                                                    : ''
                                            }`}
                                            href="/notifications"
                                            role="button"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            Notifications{' '}
                                            <div className="arrow-down"></div>
                                        </a>
                                        <div
                                            className="dropdown-menu"
                                            aria-labelledby="topnav-notifications"
                                        >
                                            <a
                                                href="/notifications/controls"
                                                className="dropdown-item"
                                            >
                                                Notification Controls
                                            </a>
                                            <a
                                                href="/notifications/list"
                                                className="dropdown-item"
                                            >
                                                Notification List
                                            </a>
                                        </div>
                                    </li>

                                    <li className="nav-item dropdown">
                                        <a
                                            className={`nav-link dropdown-toggle arrow-none ${
                                                window.location.pathname.includes(
                                                    '/monitoring'
                                                )
                                                    ? 'active-collapse'
                                                    : ''
                                            }`}
                                            href="/monitoring"
                                            role="button"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                        >
                                            Monitoring{' '}
                                            <div className="arrow-down"></div>
                                        </a>
                                        <div
                                            className="dropdown-menu"
                                            aria-labelledby="topnav-monitoring"
                                        >
                                            <a
                                                href="/monitoring/twitter"
                                                className="dropdown-item"
                                            >
                                                Twitter Monitoring
                                            </a>
                                            <a
                                                href="/monitoring/dao"
                                                className="dropdown-item"
                                            >
                                                DAO Monitoring
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                </div>

                <div className="d-flex">
                    <div className="dropdown d-inline-block">
                        <button
                            type="button"
                            className="btn header-item waves-effect"
                            id="page-header-user-dropdown"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                        >
                            <img
                                className="rounded-circle header-profile-user"
                                src={avatar}
                                alt="Header Avatar"
                            />
                            <span className="d-none d-xl-inline-block ml-1">
                                Patrick
                            </span>
                            <i className="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
                        </button>

                        <div className="dropdown-menu dropdown-menu-right">
                            <a className="dropdown-item" href="#">
                                <i className="bx bx-user font-size-16 align-middle mr-1"></i>{' '}
                                Profile
                            </a>
                            <a className="dropdown-item text-danger" href="#">
                                <i className="bx bx-power-off font-size-16 align-middle mr-1 text-danger"></i>{' '}
                                Logout
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
