import axios from 'axios'
import React, { Component } from 'react'

export default class LargeHolders extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            isLoading: false,
        }
    }
    componentDidMount() {
        const { startTime, days, min_amount } = this.props
        this.setState({
            ...this.state,
            isLoading: true,
        })
        axios({
            method: 'get',
            url: `http://62.84.119.83:8000/api/get_top_days/?start=${startTime}&days=${days}&amount=${min_amount}`,
        }).then((result) => {
            const data = result.data.data.map((e) => ({
                time: e.timestamp,
                value: e.balance,
            }))
            this.setState({
                data,
                isLoading: false,
            })
        })
    }

    render() {
        return this.props.render(this.state)
    }
}
