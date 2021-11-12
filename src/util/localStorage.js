async function getStorageItem(key) {
    try {
        const serializedData = await localStorage.getItem(key)
        if (serializedData === null) {
            return undefined
        }

        return JSON.parse(serializedData)
    } catch (_) {
        return undefined
    }
}

async function setStorageItem(key, value) {
    try {
        const serializedData = JSON.stringify(value)
        await localStorage.setItem(key, serializedData)
    } catch (err) {
        console.warn(err)
    }
}

async function removeStorageItem(key) {
    try {
        await localStorage.removeItem(key)
    } catch (err) {
        console.warn(err)
    }
}
export { getStorageItem, setStorageItem, removeStorageItem }
