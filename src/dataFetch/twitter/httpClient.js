import axios from 'axios'

const baseURL = 'https://535b-62-84-117-55.ngrok.io'

const httpClient = axios.create({
    baseURL,
    headers: {
        Authorization:
            'Bearer AAAAAAAAAAAAAAAAAAAAAAMBVQEAAAAAM53SnmlTm5qvzqacgc2W0aPuyUQ%3D4VjOnXdLv99M3Jx3r6WZn3UtWoTr3CMLGQecA3Irt8sLlpGIkn',
    },
})

export function get(url, data) {
    return httpClient({
        method: 'get',
        url,
        params: data,
    })
}

export function post(url, data) {
    return httpClient({
        method: 'post',
        url,
        data,
    })
}
