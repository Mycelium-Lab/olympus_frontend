import React from 'react'

export default function AddListModal() {
    return (
        <div
            className="modal fade bs-example-modal-center modal-imp-wallets"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="mySmallModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-imp-wallets-title">
                        <h4 className="card-title">
                            <input
                                type="text"
                                className="change-wallet-name"
                                defaultValue="Important wallets"
                            />
                        </h4>
                        <button className="btn btn-success change-button save-button">
                            Save
                        </button>
                    </div>
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
                                        <button className="btn btn-primary bx bx bx-minus remove-wallet" />
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>0xE8D562606F35CB14d...</td>
                                    <td>
                                        <button className="btn btn-primary bx bx bx-minus remove-wallet" />
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>0xE8D562606F35CB14d...</td>
                                    <td>
                                        <button className="btn btn-primary bx bx bx-minus remove-wallet" />
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
    )
}
