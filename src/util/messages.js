export const basicMessages = {
    requestError: {
        severity: 3,
        text: 'Could not process your request. Please try again later.',
    },
    refreshRequestError: (refreshRateSeconds) => ({
        severity: 3,
        text: `Refresh request failed, trying again in ${refreshRateSeconds} seconds.`,
    }),
}
