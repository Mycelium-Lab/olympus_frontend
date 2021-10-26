export const validateNumericalInputValues = (values, ltThreshold = 0) => {
    let valid = true
    values.forEach((value) => {
        const pv = parseInt(value)
        if (isNaN(pv) || ltThreshold < 0) {
            valid = false
            return
        }
    })
    return valid
}

export const validateNumericalInputValue = (value, ltThreshold = 0) => {
    let valid = true
    const pv = parseInt(value)
    if (isNaN(pv) || pv < ltThreshold) {
        valid = false
    }
    return valid
}
