import React from 'react'
import tab1 from '../../../images/tab1.jpg'
import AddListModal from './AddListModal'

export default function ImportantWalletsPane() {
    return (
        <>
            <div className="tab-pane" role="tabpanel">
                <div className="row">
                    <div className="col-md-9">
                        <div className="card card-body">
                            <img src={tab1} />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card card-filter card-wallets-lists-analytics">
                            <div className="card-body">
                                <div className="custom-control custom-radio mb-2 name-wallet">
                                    <input
                                        type="radio"
                                        className="custom-control-input"
                                        id="imp-wallet"
                                        name="imp-wallet"
                                        defaultChecked
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="imp-wallet"
                                        data-toggle="modal"
                                        data-target=".bs-example-modal-center"
                                    >
                                        Important Wallets
                                    </label>
                                </div>
                                <button className="btn btn-primary change-button edit-button">
                                    Edit
                                </button>
                            </div>
                        </div>
                        <div className="card card-filter card-wallets-lists-analytics">
                            <div className="card-body">
                                <div className="custom-control custom-radio mb-2 name-wallet">
                                    <input
                                        type="radio"
                                        className="custom-control-input"
                                        id="imp-wallet2"
                                        name="imp-wallet"
                                    />
                                    <label
                                        className="custom-control-label"
                                        htmlFor="imp-wallet2"
                                        data-toggle="modal"
                                        data-target=".bs-example-modal-center"
                                    >
                                        Important Wallets
                                    </label>
                                </div>
                                <button className="btn btn-primary change-button edit-button">
                                    Edit
                                </button>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn btn-primary change-button"
                            data-toggle="modal"
                            data-target=".bs-example-modal-center"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
            <AddListModal />
        </>
    )
}
