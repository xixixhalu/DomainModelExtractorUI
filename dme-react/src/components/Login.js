import React, { Component } from 'react'
import { loginRequest } from './Utilities'
import Landing from './Landing'
import { withRouter } from 'react-router-dom'

class LoginWrapper extends Component {
    constructor() {
        super()
        this.state = {
            email: '',
            password: ''
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }


    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit(e) {
        e.preventDefault()
        const user = {
            email: this.state.email,
            password: this.state.password
        }

        loginRequest(user).then(response => {
            if (response.status === 200) {
                localStorage.setItem('usertoken', response.data.token)
                this.props.history.push(`/DME`)
                return response.data.token
            } else if (response.status === 401) {
                console.error("Login Error");
                alert("User does not exist or invaild combination!");

            }

        })
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        <form noValidate onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input type="email"
                                    className="form-control"
                                    name="email"
                                    placeholder="Enter Email"
                                    value={this.state.email}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password </label>
                                <input type="password"
                                    className="form-control"
                                    name="password"
                                    placeholder="Enter Password"
                                    value={this.state.password}
                                    onChange={this.onChange} />
                            </div>
                            <br/>
                            <button type="submit" className="btn btn-lg btn-primary btn-block" disabled={!this.state.email || !this.state.password}>
                                Sign in
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

const Login = () => {
    LoginWrapper = withRouter(LoginWrapper)

    return (
        <>
            {localStorage.usertoken ? <Landing /> : <LoginWrapper />}
        </>
    )
}

export default withRouter(Login)