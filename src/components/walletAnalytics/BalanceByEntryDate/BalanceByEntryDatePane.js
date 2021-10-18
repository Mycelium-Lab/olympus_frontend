import React from 'react'
import tab1 from '../../../images/tab1.jpg'

import $ from 'jquery'
import IonRangeSlider from 'react-ion-slider'

var lang = 'en-US'
var year = 2021

function dateToTS(date) {
    return date.valueOf()
}

function tsToDate(ts) {
    var d = new Date(ts)

    return d.toLocaleDateString(lang, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    })
}

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
                                <IonRangeSlider
                                    skin={'round'}
                                    type={'double'}
                                    min={dateToTS(new Date(year, 2, 22))}
                                    max={new Date(
                                        Date.now() + 1000 * 3600
                                    ).valueOf()}
                                    from={dateToTS(new Date(year, 4, 8))}
                                    to={dateToTS(new Date(year, 7, 23))}
                                    prettify={tsToDate}
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
