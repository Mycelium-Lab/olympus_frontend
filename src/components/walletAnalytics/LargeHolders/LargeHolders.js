import axios from 'axios'
import { Component } from 'react'

export default class LargeHolders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            isLoading: false,
        }
    }

    fetchWallets = () => {
        const { startTime, days, min_amount } = this.props
        this.setState({
            ...this.state,
            isLoading: true,
        })
        axios({
            method: 'get',
            url: `${process.env.REACT_APP_API_URL}/api/get_top_days/?start=${startTime}&days=${days}&amount=${min_amount}`,
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
        if (prevProps.min_amount !== this.props.min_amount) {
            this.fetchWallets()
        }
    }

    render() {
        return this.props.render(this.state)
    }
}
