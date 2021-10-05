import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'

import './NavBar.scss'

class Navbar extends Component {
    logOut(e) {
        e.preventDefault()
        localStorage.removeItem('usertoken')
        this.props.history.push(`/`)
    }

    render() {
        const loginRegLink = (
            <ul className="navbar-nav navbar-light">
                <li className="nav-item">
                    <Link to="/login" className="nav-link">
                        Login
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/register" className="nav-link">
                        Register
                    </Link>
                </li>
            </ul>
        )

        const userProfile = (
            <ul className="navbar-nav navbar-light">
                <li className="nav-item">
                    <Link to="/profile" className="nav-link">
                        Profile
                    </Link>
                </li>

            </ul>
        )
        const DME = (
            <ul className="navbar-nav navbar-light">
                <li className="nav-item">
                    <Link to="/DME" className="nav-link">
                        DME
                    </Link>
                </li>
            </ul>
        )

        const LogoutMenu = (
            <ul className="navbar-nav navbar-light">
                <li className="nav-item">
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <a href="#" onClick={this.logOut.bind(this)} className="nav-link">
                        Logout
                    </a>
                </li>
            </ul>
        )


        return (
            <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                <div className="container-fluid">

                    <a className="navbar-brand" href="/">Domain Model Extractor <span className="fw-lighter version">beta</span></a>
                </div>
                <button className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#main-navbar"
                    aria-controls="main-navbar"
                    aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse justify-content-md-center"
                    id="main-navbar">

                    <ul className="navbar-nav navbar-light">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                Home
                            </Link>
                        </li>
                    </ul>
                    {localStorage.usertoken ? <> {DME} {userProfile} {LogoutMenu}</> : loginRegLink}

                </div>
                &nbsp;&nbsp;
            </nav>
        )
    }
}

export default withRouter(Navbar)
