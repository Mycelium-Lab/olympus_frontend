import React, { useEffect, useRef } from 'react'
import '../styles/dashboard.scss'
import TooltippedComponent from '../components/util/TooltippedComponent'

import twitter from '../images/twitter.png'

import useCharts from '../hooks/useCharts'
import Chart from '../components/charts/Chart'

export default function Dashboard() {
    const ref = useRef()

    const store = 'dashboard'
    const { refs, methods, ohlcs, key } = useCharts({
        store,
        shouldBindCrossHair: false,
    })

    useEffect(() => {
        const script = document.createElement('script')

        script.src = 'https://platform.twitter.com/widgets.js'
        script.async = ref.current.appendChild(script)

        return () => {
            ref.current.removeChild(script)
        }
    }, [])

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
                                    <Chart
                                        key={0}
                                        chartRef={refs[0]}
                                        index={0}
                                        ohlc={ohlcs[0]}
                                        method={methods[0]}
                                        {...{
                                            store,
                                        }}
                                    />
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
                                        height: '206px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Chart
                                        key={1}
                                        chartRef={refs[1]}
                                        index={1}
                                        ohlc={ohlcs[1]}
                                        method={methods[1]}
                                        {...{
                                            store,
                                        }}
                                    />
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
                                        height: '206px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Chart
                                        key={2}
                                        chartRef={refs[2]}
                                        index={2}
                                        ohlc={ohlcs[2]}
                                        method={methods[2]}
                                        {...{
                                            store,
                                        }}
                                    />
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
                                    <Chart
                                        key={5}
                                        chartRef={refs[5]}
                                        index={5}
                                        ohlc={ohlcs[5]}
                                        method={methods[5]}
                                        {...{
                                            store,
                                        }}
                                    />
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
                                        height: '206px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Chart
                                        key={3}
                                        chartRef={refs[3]}
                                        index={3}
                                        ohlc={ohlcs[3]}
                                        method={methods[3]}
                                        {...{
                                            store,
                                        }}
                                    />
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
                                        height: '206px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <Chart
                                        key={4}
                                        chartRef={refs[4]}
                                        index={4}
                                        ohlc={ohlcs[4]}
                                        method={methods[4]}
                                        {...{
                                            store,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
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

                <div className="row mb-3 mt-3"></div>

                <div className="row">
                    <div className="col-md-6">
                        <img
                            src={twitter}
                            style={{ margin: '0 auto 30px', display: 'block' }}
                        />
                        <div
                            ref={ref}
                            style={{
                                width: '100%',
                                height: '388px',
                                overflow: 'auto',
                            }}
                        >
                            <a
                                className="twitter-timeline"
                                href="https://twitter.com/OlympMonitoring/lists/1449359533021835272?ref_src=twsrc%5Etfw"
                            >
                                A Twitter List by OlympMonitoring
                            </a>{' '}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <span
                            style={{
                                display: 'block',
                                fontWeight: 600,
                                fontSize: '45px',
                                lineHeight: 0.8,
                                textAlign: 'center',
                                color: '#000000',
                                paddingBottom: '30px',
                            }}
                        >
                            snapshot
                        </span>
                        <div
                            style={{
                                width: '100%',
                                height: '388px',
                                overflow: 'hidden',
                            }}
                        >
                            <iframe
                                title="Snapshot"
                                src="https://snapshot.org/#/olympusdao.eth"
                                frameBorder="0"
                                style={{ width: '100%', height: '100%' }}
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
