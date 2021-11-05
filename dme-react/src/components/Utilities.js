import axios from 'axios'

export const registerRequest = newUser => {
    return axios
        .post("users/register", {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            password: newUser.password
        })
        .then(response => {
            return response
        })
        .catch(err => {
            return (err.response)
        })
}

export const loginRequest = user => {
    return axios
        .post("users/login", {
            email: user.email,
            password: user.password
        })
        .then(response => {
            // console.log("response: ", response);
            return response
        })
        .catch(err => {
            if (err.response.status === 403) {
                return (err.response)
            }
        })
}

export const wait = (delay) => {
    return new Promise(res => setTimeout(res, delay));
}