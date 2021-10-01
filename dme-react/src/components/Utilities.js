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
            console.log("Registered")
        })
}

export const loginRequest = user => {
    return axios
        .post("users/login", {
            email: user.email,
            password: user.password
        })
        .then(response => {
            console.log("response: ", response);
            return response
        })
        .catch(err => {
            if (err.response.status === 401) {
                return (err.response)
            }
        })
}