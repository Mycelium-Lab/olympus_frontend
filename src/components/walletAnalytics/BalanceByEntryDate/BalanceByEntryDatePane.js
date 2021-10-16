import React from 'react'
import tab1 from '../../../images/tab1.jpg'

export default function BalanceByEntryDatePane() {
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
                            <h4 className="card-title border-bottom pb-3">
                                Filter
                            </h4>
                            <div className="filter-name mt-3 mb-3">
                                By first balance date
                            </div>

                            <form>
                                <input
                                    type="text"
                                    id="range_date"
                                    className="irs-hidden-input"
                                    tabIndex="-1"
                                    readOnly=""
                                    style={{
                                        color: 'transparent',
                                        border: 'none',
                                        height: '0px',
                                        padding: 0,
                                        margin: 0,
                                    }}
                                />
                            </form>
                            <button className="btn btn-success change-button save-button">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
