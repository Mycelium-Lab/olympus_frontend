import React from 'react'

import parse from 'html-react-parser'

import TooltippedComponent from '../util/TooltippedComponent'

import { methodPropsChartConfigs } from '../../util/config'

export default function ChartSelectSection({
    sectionName,
    isGlobalLoading,
    method,
    changeMethod,
}) {
    return (
        <div data-name={sectionName}>
            <span className="filter-name-span">{sectionName}:</span>
            {methodPropsChartConfigs[sectionName].map((e, idx) => (
                <div
                    key={idx}
                    className="custom-control custom-radio select-chart-data-holder mb-2"
                >
                    <input
                        disabled={isGlobalLoading}
                        type="radio"
                        value={idx}
                        checked={
                            method.type === sectionName &&
                            method.orderNumber === idx
                        }
                        onChange={(e) =>
                            changeMethod(
                                sectionName,
                                parseInt(e.currentTarget.value)
                            )
                        }
                        className="input-select-chart-data"
                        name="group2[]"
                    />
                    <TooltippedComponent info={e.info}>
                        <label className={e.info ? 'label-with-info' : ''}>
                            {parse(e.title)}
                        </label>
                    </TooltippedComponent>
                </div>
            ))}
        </div>
    )
}
