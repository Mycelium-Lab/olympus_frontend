import axios from 'axios'
import { Component } from 'react'

export default class FirstNWallets extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            isLoading: false,
        }
        this.fetchWallets = this.fetchWallets.bind(this)
    }

    fetchWallets = () => {
        const { startTime, days, n_wallets } = this.props
        this.setState({
            ...this.state,
            isLoading: true,
        })
        axios({
            method: 'get',
            url: `http://62.84.119.83:8000/api/get_first_n/?start=${startTime}&days=${days}&count=${n_wallets}`,
        }).then((result) => {
            const data = result.data.data.map((e) => ({
                time: e.timestamp,
                value: Number(e.balance),
            }))
            this.setState({
                data,
                isLoading: false,
            })
        })
    }

    componentDidMount() {
        this.fetchWallets()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.n_wallets !== this.props.n_wallets) {
            this.fetchWallets()
        }
    }

    render() {
        return this.props.render(this.state)
    }
}
