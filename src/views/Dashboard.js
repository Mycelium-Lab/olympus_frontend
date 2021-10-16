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
        <div className="main-content">
            <div className="page-content">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-flex align-items-center justify-content-between">
                            <h5 className="page-title mb-0 font-size-18">
                                Last notifications
                            </h5>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="card notification-card not-work">
                            <div className="card-body">
                                <div className="float-right">
                                    <div className="notification notification-warning">
                                        Warning
                                    </div>
                                </div>
                                <h5 className="card-title">
                                    Мониторинг баланса Treasury
                                </h5>
                                <span className="notification-time">
                                    07.10.2021 19:52
                                </span>
                                <hr className="notification-hr" />
                                <p className="notification-text">
                                    Cовершен вывод из Treasury 123 000 ETH (tx
                                    id)
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card notification-card not-work">
                            <div className="card-body">
                                <div className="float-right">
                                    <div className="notification notification-info">
                                        Info
                                    </div>
                                </div>
                                <h5 className="card-title">Card title</h5>
                                <span className="notification-time">
                                    07.10.2021 19:52
                                </span>
                                <hr className="notification-hr" />
                                <p className="notification-text">
                                    С кошелька 0xE8D562606... на кошелек
                                    0xE0B14d3E8... совершен трансфер на сумму 50
                                    000 OHM
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

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
                    <div className="col-md-4">
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
                    <div className="col-md-4 ml-auto">
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
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <div
                                    style={{
                                        width: '100%',
                                        height: '414px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <iframe
                                        src="https://dune.xyz/embeds/28707/57953/ade096a4-613f-4950-8d39-d68526a368aa"
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
                                        height: '414px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <iframe
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
                    <div className="col-md-5">
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
                    <div className="col-md-5">
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
                </div>

                <div className="row">
                    <div className="col-12">
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

                <div className="row">
                    <div className="col-md-5">
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
                    <div className="col-md-7">
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
                                        src="https://dune.xyz/embeds/199006/371574/b387e448-cfd2-4c61-84de-139b59e57dc9"
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
                                class="twitter-timeline"
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
