import axios from 'axios'
import { Component } from 'react'

import { connect } from 'react-redux'
import { setMessage } from '../../../redux/actions/messageActions'
import { basicMessages } from '../../../util/messages'

class FirstNWallets extends Component {
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
            url: `${process.env.REACT_APP_API_URL}/api/get_first_n/?start=${startTime}&days=${days}&count=${n_wallets}`,
        })
            .then((result) => {
                const data = result.data.data.map((e) => ({
                    time: e.timestamp,
                    value: Number(e.balance),
                }))

                this.setState({
                    ...this.state,
                    data,
                })
            })
            .catch(() => {
                this.props.setMessage(basicMessages.requestError)
            })
            .finally(() => {
                this.setState({
                    ...this.state,
                    isLoading: false,
                })
            })
    }

    componentDidMount() {
        this.fetchWallets()
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.n_wallets !== this.props.n_wallets) {
            this.fetchWallets()
        }

        if (prevState.isLoading !== this.state.isLoading) {
            this.props.setIsLoading(this.state.isLoading)
        }
    }

    render() {
        return this.props.render(this.state)
    }
}

export default connect(null, { setMessage })(FirstNWallets)
