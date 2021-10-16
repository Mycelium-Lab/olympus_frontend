import React from 'react'
import tab1 from '../../../images/tab1.jpg'

export default function ImportantWalletsPane() {
    return (
        <div className="tab-pane" role="tabpanel">
            <div className="row">
                <div className="col-md-9">
                    <div className="card card-body">
                        <img src={tab1} />
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card card-filter">
                        <div className="card-body">
                            <h4 className="card-title">Important wallets</h4>

                            <div className="table-responsive">
                                <table className="table mb-0">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Wallet</th>
                                            <th>Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th scope="row">1</th>
                                            <td>0xE8D562606F35CB14d...</td>
                                            <td>
                                                <button className="btn btn-primary bx bx bx-minus remove-wallet"></button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">2</th>
                                            <td>0xE8D562606F35CB14d...</td>
                                            <td>
                                                <button className="btn btn-primary bx bx bx-minus remove-wallet"></button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th scope="row">3</th>
                                            <td>0xE8D562606F35CB14d...</td>
                                            <td>
                                                <button className="btn btn-primary bx bx bx-minus remove-wallet"></button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <button className="btn btn-primary change-button">
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
