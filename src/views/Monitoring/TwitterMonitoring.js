import React, { useRef, useEffect } from 'react'

import '../../styles/monitoring.scss'

export default function TwitterMonitoring() {
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
        <div className="monitoring-twitter">
            <div className="page-content">
                <div className="row">
                    <div className="col-12">
                        <div className="page-title-box d-flex align-items-center justify-content-between">
                            <h4 className="page-title mb-0 font-size-18">
                                &nbsp;
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-8 ml-auto mr-auto">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div
                                        className="twitter-mon"
                                        ref={ref}
                                        style={{ height: 600 }}
                                    >
                                        <a
                                            class="twitter-timeline"
                                            href="https://twitter.com/OlympMonitoring/lists/1449359533021835272?ref_src=twsrc%5Etfw"
                                        >
                                            A Twitter List by OlympMonitoring
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
