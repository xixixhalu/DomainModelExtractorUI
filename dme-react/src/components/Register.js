import React, { Component } from 'react'
import { registerRequest } from './Utilities'

class Register extends Component {
    constructor() {
        super()
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            errors: {},
            isRegistered: false
        }

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value })
    }


    formValidation = () => {
        const { email, password } = this.state;
        let isValid = true;
        const errors = {};

        // Check Email
        const emailPattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailPattern.test(email)) {
            errors.invalidEmail = "Please input a valied email address!";
            isValid = false;
        }

        // Check Password
        if (/^(?=.*\s)/.test(password)) {
            isValid = false;
            errors.passwordSpace = "Password cannot contain space!";
        }
        if (!/^.{6,16}$/.test(password)) {
            isValid = false;
            errors.passwordLength = "Password must be between 6 and 16 characters!";
        }
        if (isValid) {
            this.setState({ isRegistered: true });
        }

        this.setState({ errors });
        return isValid;
    }


    onSubmit(e) {
        e.preventDefault()
        const isValid = this.formValidation()

        if (isValid) {
            const newUser = {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                password: this.state.password
            }

            registerRequest(newUser).then(res => {
                if (res.status === 200) {
                    alert("Register Success!");
                    this.props.history.push(`/login`)
                } else if (res.status === 409) {
                    alert("Register error! This Email has been used!");
                }
            })
        }

    }

    render() {
        const { errors } = this.state;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mt-5 mx-auto">
                        {Object.keys(errors).map((key) =>
                            <div className="alert alert-danger" role="alert" key={key}>
                                {errors[key]}
                            </div>
                        )}
                        <form noValidate onSubmit={this.onSubmit}>
                            <h1 className="h3 mb-3 font-weight-normal">Register</h1>
                            <div className="form-group">
                                <label htmlFor="first_name">First Name</label>
                                <input type="text"
                                    className="form-control"
                                    name="first_name"
                                    placeholder="Enter First Name"
                                    value={this.state.first_name}
                                    onChange={this.onChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="last_name">Last Name</label>
                                <input type="text"
                                    className="form-control"
                                    name="last_name"
                                    placeholder="Enter Last Name"
                                    value={this.state.last_name}
                                    onChange={this.onChange} />
                            </div>
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
                            <br />
                            <button type="submit" className="btn btn-lg btn-primary btn-block" disabled={!this.state.first_name || !this.state.last_name || !this.state.email || !this.state.password}>
                                Register
                            </button>
                        </form>
                    </div>
                </div>
            </div >
        )
    }
}

export default Register