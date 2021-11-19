import React from 'react'

import parse from 'html-react-parser'

import TooltippedComponent from '../util/TooltippedComponent'

import { methodPropsChartConfigs } from '../../util/config'

import { useSelector, useDispatch } from 'react-redux'
import { setMessage } from '../../redux/actions/messageActions'
import { setMethods } from '../../redux/actions/gaActions'

export default function ChartSelectSection({
    sectionName,
    isGlobalLoading,
    methods,
    store,
}) {
    const { maxMethodsPerSection } = useSelector((state) => state[store])
    const dispatch = useDispatch()
    const checkIsMethodChecked = (sectionName, index) => {
        let isChecked = false
        for (let i = 0; i < methods.length; i++) {
            if (
                methods[i].type === sectionName &&
                methods[i].orderNumber === index
            ) {
                isChecked = true
                break
            }
        }
        return isChecked
    }

    const changeMethods = (sectionName, index) => {
        let method
        let currentSelectedCount = 0

        methods.forEach((m) => {
            if (m.type === sectionName) {
                currentSelectedCount++
                if (m.orderNumber === index) {
                    // this can only happen once max
                    method = m
                }
            }
        })

        if (currentSelectedCount === maxMethodsPerSection && !method) {
            dispatch(
                setMessage({
                    severity: 2,
                    text: `You cannot select more than ${maxMethodsPerSection} items per section`,
                })
            )
            return
        }

        if (!method) {
            dispatch(
                setMethods({
                    type: sectionName,
                    orderNumber: index,
                })
            )
        } else dispatch(setMethods(method))
    }

    return (
        <div data-name={sectionName}>
            <span className="filter-name-span">{sectionName}:</span>
            {methodPropsChartConfigs[sectionName].map((e, idx) => (
                <div
                    key={idx}
                    className="custom-control custom-checkbox select-chart-data-holder mb-2"
                >
                    <input
                        disabled={isGlobalLoading}
                        type="checkbox"
                        checked={checkIsMethodChecked(sectionName, idx)}
                        onChange={() => changeMethods(sectionName, idx)}
                        className="input-select-chart-data"
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
