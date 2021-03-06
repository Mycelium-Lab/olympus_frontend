import React from 'react'
import '../styles/dashboard.scss'
import TooltippedComponent from '../components/util/TooltippedComponent'

import useCharts from '../hooks/useCharts'
import Chart from '../components/charts/Chart'
import { methodPropsChartConfigs } from '../util/config'

export default function Dashboard() {
    const store = 'dashboard'
    const { refs, methods, ohlcs, key } = useCharts({
        store,
        shouldBindCrossHair: false,
    })

    return (
        <div key={key} className="main-content dashboard-view">
            <div className="page-content">
                <div className="row pt-4">
                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-body">
                                <div
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <iframe
                                        title="Market Cap"
                                        src="https://dune.xyz/embeds/28707/57953/2b4d24fd-6f9f-4100-9df3-2743a452d388"
                                        frameBorder="0"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 ml-auto">
                        <div className="card">
                            <div className="card-body">
                                <div
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <iframe
                                        title="Price"
                                        src="https://dune.xyz/embeds/28168/57095/40ae3282-c0ae-4f61-9a1f-3fea4f2c88e4"
                                        frameBorder="0"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="card">
                            <div className="card-body">
                                <div
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <iframe
                                        title="Ohmies over Time"
                                        src="https://dune.xyz/embeds/27661/57966/1fb96685-071d-4971-96b2-2ca1c220cff5"
                                        frameBorder="0"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-body">
                                <div
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <TooltippedComponent info="Supply without DAO Contract OHM holdings and OHM to be Claimed in Bond Contracts / Total Supply">
                                        <iframe
                                            title="Circ/Total Supply"
                                            src="https://dune.xyz/embeds/28599/57711/78cf4ed3-80dd-4a72-be8b-25add7fd18b7"
                                            frameBorder="0"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                            }}
                                        ></iframe>
                                    </TooltippedComponent>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="card">
                            <div className="card-body">
                                <div
                                    style={{
                                        width: '100%',
                                        height: '200px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <TooltippedComponent info="Valuation of OHMs Locked in DAO Contract">
                                        <iframe
                                            title="DAO Market Value"
                                            src="https://dune.xyz/embeds/30395/61276/a2b3294c-1f07-4532-9791-a3815210c1ad"
                                            frameBorder="0"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                            }}
                                        ></iframe>
                                    </TooltippedComponent>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-body">
                                <div
                                    style={{
                                        width: '100%',
                                        height: '206px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <iframe
                                        title="New sOHM Holders"
                                        src="https://dune.xyz/embeds/213705/401405/361868f3-86d8-492f-9481-1a59b78a2076"
                                        frameBorder="0"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                    {[0, 1, 2].map((idx) => (
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-body">
                                    <TooltippedComponent
                                        info={
                                            methodPropsChartConfigs[
                                                methods[idx].type
                                            ][methods[idx].orderNumber].info
                                        }
                                    >
                                        <div
                                            style={{
                                                width: '100%',
                                                height: '206px',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Chart
                                                key={idx}
                                                chartRef={refs[idx]}
                                                index={idx}
                                                ohlc={ohlcs[idx]}
                                                method={methods[idx]}
                                                {...{
                                                    store,
                                                }}
                                            />
                                        </div>
                                    </TooltippedComponent>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row">
                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-body">
                                <div
                                    style={{
                                        width: '100%',
                                        height: '206px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <iframe
                                        title="% OHM Staked/Not Staked"
                                        src="https://dune.xyz/embeds/28756/58813/ee5cfcd0-d811-4e66-bbea-755907408c05"
                                        frameBorder="0"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                    {[5, 3, 4].map((idx) => (
                        <div className="col-md-3">
                            <div className="card">
                                <div className="card-body">
                                    <TooltippedComponent
                                        info={
                                            methodPropsChartConfigs[
                                                methods[idx].type
                                            ][methods[idx].orderNumber].info
                                        }
                                    >
                                        <div
                                            style={{
                                                width: '100%',
                                                height: '206px',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            <Chart
                                                key={idx}
                                                chartRef={refs[idx]}
                                                index={idx}
                                                ohlc={ohlcs[idx]}
                                                method={methods[idx]}
                                                {...{
                                                    store,
                                                }}
                                            />
                                        </div>
                                    </TooltippedComponent>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="row">
                    <div className="col-md-2">
                        <div className="card">
                            <div className="card-body">
                                <div
                                    style={{
                                        width: '100%',
                                        height: '260px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <TooltippedComponent info="Valuation of All Tokens in Treasury Contract">
                                        <iframe
                                            title="Treasury Market Value"
                                            src="https://dune.xyz/embeds/29778/60056/ab4e0454-98ea-4b48-b92b-43f6cd5dec9c"
                                            frameBorder="0"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                            }}
                                        ></iframe>
                                    </TooltippedComponent>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5 ml-auto">
                        <div className="card">
                            <div className="card-body">
                                <div
                                    style={{
                                        width: '100%',
                                        height: '260px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <TooltippedComponent info="Valuation of All Tokens in Treasury Contract">
                                        <iframe
                                            title="Market Value of Treasury Assets"
                                            src="https://dune.xyz/embeds/29778/60051/394cdb35-a8b8-4f10-806d-63eb8c0057e9"
                                            frameBorder="0"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                            }}
                                        ></iframe>
                                    </TooltippedComponent>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5 ml-auto">
                        <div className="card">
                            <div className="card-body">
                                <div
                                    style={{
                                        width: '100%',
                                        height: '260px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <TooltippedComponent info="Amount of Stablecoin Treasury Assets (Reserve Tokens), Including Their Share in Corresponding -OHM LP Tokens">
                                        <iframe
                                            title="RFV of Treasury Assets"
                                            src="https://dune.xyz/embeds/29153/58862/b16ae296-c2a8-4ebd-aa58-68141848ca72"
                                            frameBorder="0"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                            }}
                                        ></iframe>
                                    </TooltippedComponent>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
