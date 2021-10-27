import React, { useEffect, useRef } from 'react'
import '../styles/dashboard.scss'

import twitter from '../images/twitter.png'

export default function Dashboard() {
    const ref = useRef()

    useEffect(() => {
        const script = document.createElement('script')

        script.src = 'https://platform.twitter.com/widgets.js'
        script.async = ref.current.appendChild(script)

        return () => {
            ref.current.removeChild(script)
        }
    }, [])

    return (
        <div className="main-content dashboard-view">
            <div className="page-content">
                <div className="row"></div>
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-flex align-items-center justify-content-between">
                            <h5 className="page-title mb-0 font-size-18">
                                Charts
                            </h5>
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
                    <div className="col-md-3 ml-auto">
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
                                        title="Current Index"
                                        src="https://dune.xyz/embeds/30413/61311/a7789484-a119-44c4-931b-bbc52db36b9f"
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
                    <div className="col-md-3 ml-auto">
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
                    <div className="col-md-3 ml-auto">
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
                                        title="Circ/Total Supply"
                                        src="https://dune.xyz/embeds/28599/57711/78cf4ed3-80dd-4a72-be8b-25add7fd18b7"
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
                </div>
                <div className="row">
                    <div className="col-md-2">
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
                    <div className="col-md-3 ml-auto">
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
                                        title="DAO Market Value"
                                        src="https://dune.xyz/embeds/30395/61276/a2b3294c-1f07-4532-9791-a3815210c1ad"
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
                    <div className="col-md-3 ml-auto">
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
                                        title="TVL Staking"
                                        src="https://dune.xyz/embeds/30178/60856/44e344f2-9fb3-43b8-b546-8b5f22417e91"
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
                    <div className="col-md-4 ml-auto">
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
                                        title="APY over Time"
                                        src="https://dune.xyz/embeds/34202/69216/0e5e8b30-a6c9-4ec0-845a-d68f21afbd5e"
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
                </div>

                <div className="row">
                    <div className="col-md-6">
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
                    <div className="col-md-6">
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
                                    <iframe
                                        title="Treasury Market Value"
                                        src="https://dune.xyz/embeds/199006/371572/6303e9df-7815-40f7-98ee-12395a08afe1"
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
                                    <iframe
                                        title="RFV of Treasury Assets"
                                        src="https://dune.xyz/embeds/29153/58862/b16ae296-c2a8-4ebd-aa58-68141848ca72"
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
                                    <iframe
                                        title="Market Value of Treasury Assets"
                                        src="https://dune.xyz/embeds/29778/60051/394cdb35-a8b8-4f10-806d-63eb8c0057e9"
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
