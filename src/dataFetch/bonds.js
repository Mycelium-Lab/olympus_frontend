import axios from 'axios'
/**
 * @dev : Get deposits (days)
 */
export async function getDepositsInfoDays(startTimestamp, days) {
    let depositQuery = `
    {
        depositYearDaiEntities(first: 100 orderBy:timestamp) {
          
          dayDeposit(first: 365 orderBy:timestamp) {
            
            id
            amount
            depositCount
            timestamp
          }
        }
        depositYearETHEntities(first: 100 orderBy:timestamp) {
          
          dayDeposit(first: 365 orderBy:timestamp) {
            
            id
            amount
            depositCount
            timestamp
          }
        }
        depositYearFraxEntities(first: 100 orderBy:timestamp) {
          
          dayDeposit(first: 365 orderBy:timestamp) {
            
            id
                  amount
                  depositCount
                  timestamp
          }
        }
        
        depositYearLusdEntities(first: 100 orderBy:timestamp) {
          
          dayDeposit(first: 365 orderBy:timestamp) {
            
            id
                  amount
                  depositCount
                  timestamp
          }
        }
        
        depositYearOHMDAIEntities(first: 100 orderBy:timestamp) {
          
          dayDeposit(first: 365 orderBy:timestamp) {
            
            id
                  amount
                  depositCount
                  timestamp
          }
        }
        
        depositYearOHMFRAXEntities(first: 100 orderBy:timestamp) {
          
          dayDeposit(first: 365 orderBy:timestamp) {
            
            id
                  amount
                  depositCount
                  timestamp
          }
        }
      }
    `

    try {
        const depositData = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
                query: depositQuery,
            },
        })
        const daiDeposits = depositData.data.data.depositYearDaiEntities
        const ethDeposits = depositData.data.data.depositYearETHEntities
        const fraxDeposits = depositData.data.data.depositYearFraxEntities
        const lusdDeposits = depositData.data.data.depositYearLusdEntities
        const ohmDaiDeposits = depositData.data.data.depositYearOHMDAIEntities
        const ohmFraxDeposits = depositData.data.data.depositYearOHMFRAXEntities
        let data = []
        for (let i = 0; i < days - 1; ++i) {
            let beginTimestamp = startTimestamp + i * 86400
            let endTimestamp = startTimestamp + (i + 1) * 86400
            let obj = {
                amountDai: 0,
                amountEth: 0,
                amountFrax: 0,
                amountLusd: 0,
                amountOhmDai: 0,
                amountOhmFrax: 0,
                depositCountDai: 0,
                depositCountEth: 0,
                depositCountFrax: 0,
                depositCountLusd: 0,
                depositCountOhmDai: 0,
                depositCountOhmFrax: 0,
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp,
            }
            for (let j = 0; j < daiDeposits[0].dayDeposit.length; ++j) {
                if (
                    beginTimestamp <= daiDeposits[0].dayDeposit[j].timestamp &&
                    daiDeposits[0].dayDeposit[j].timestamp < endTimestamp
                ) {
                    obj.amountDai = daiDeposits[0].dayDeposit[j].amount
                    obj.depositCountDai =
                        daiDeposits[0].dayDeposit[j].depositCount
                }
            }

            for (let j = 0; j < ethDeposits[0].dayDeposit.length; ++j) {
                if (
                    beginTimestamp <= ethDeposits[0].dayDeposit[j].timestamp &&
                    ethDeposits[0].dayDeposit[j].timestamp < endTimestamp
                ) {
                    obj.amountEth = ethDeposits[0].dayDeposit[j].amount
                    obj.depositCountEth =
                        ethDeposits[0].dayDeposit[j].depositCount
                }
            }

            for (let j = 0; j < fraxDeposits[0].dayDeposit.length; ++j) {
                if (
                    beginTimestamp <= fraxDeposits[0].dayDeposit[j].timestamp &&
                    fraxDeposits[0].dayDeposit[j].timestamp < endTimestamp
                ) {
                    obj.amountFrax = fraxDeposits[0].dayDeposit[j].amount
                    obj.depositCountFrax =
                        fraxDeposits[0].dayDeposit[j].depositCount
                }
            }

            for (let j = 0; j < lusdDeposits[0].dayDeposit.length; ++j) {
                if (
                    beginTimestamp <= lusdDeposits[0].dayDeposit[j].timestamp &&
                    lusdDeposits[0].dayDeposit[j].timestamp < endTimestamp
                ) {
                    obj.amountLusd = lusdDeposits[0].dayDeposit[j].amount
                    obj.depositCountLusd =
                        lusdDeposits[0].dayDeposit[j].depositCount
                }
            }

            for (let j = 0; j < ohmDaiDeposits[0].dayDeposit.length; ++j) {
                if (
                    beginTimestamp <=
                        ohmDaiDeposits[0].dayDeposit[j].timestamp &&
                    ohmDaiDeposits[0].dayDeposit[j].timestamp < endTimestamp
                ) {
                    obj.amountOhmDai = ohmDaiDeposits[0].dayDeposit[j].amount
                    obj.depositCountOhmDai =
                        ohmDaiDeposits[0].dayDeposit[j].depositCount
                }
            }
            for (let j = 0; j < ohmFraxDeposits[0].dayDeposit.length; ++j) {
                if (
                    beginTimestamp <=
                        ohmFraxDeposits[0].dayDeposit[j].timestamp &&
                    ohmFraxDeposits[0].dayDeposit[j].timestamp < endTimestamp
                ) {
                    obj.amountOhmFrax = ohmFraxDeposits[0].dayDeposit[j].amount
                    obj.depositCountOhmFrax =
                        ohmFraxDeposits[0].dayDeposit[j].depositCount
                }
            }

            data.push(obj)
        }
        return data
    } catch (err) {
        console.log(err)
    }
}
/**
 * @dev : Get deposits (hours)
 */
export async function getDepositsInfoHours(startTimestamp, days) {
    let depositQuery = `
    {
        depositYearDaiEntities(first: 100 orderBy:timestamp) {
          
          dayDeposit(first: 365 orderBy:timestamp) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
              id
                  amount
                  timestamp
                  depositCount
              
            }
          }
        }
        depositYearETHEntities(first: 100 orderBy:timestamp) {
          
            dayDeposit(first: 365 orderBy:timestamp) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                
              }
            }
          }
          depositYearFraxEntities(first: 100 orderBy:timestamp) {
          
            dayDeposit(first: 365 orderBy:timestamp) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                
              }
            }
          }
          depositYearLusdEntities(first: 100 orderBy:timestamp) {
          
            dayDeposit(first: 365 orderBy:timestamp) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                
              }
            }
          }
          depositYearOHMDAIEntities(first: 100 orderBy:timestamp) {
          
            dayDeposit(first: 365 orderBy:timestamp) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                
              }
            }
          }
          depositYearOHMFRAXEntities(first: 100 orderBy:timestamp) {
          
            dayDeposit(first: 365 orderBy:timestamp) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                
              }
            }
          }
      }
    
    `
    try {
        const depositData = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
                query: depositQuery,
            },
        })
        const daiDeposits = depositData.data.data.depositYearDaiEntities
        const ethDeposits = depositData.data.data.depositYearETHEntities
        const fraxDeposits = depositData.data.data.depositYearFraxEntities
        const lusdDeposits = depositData.data.data.depositYearLusdEntities
        const ohmDaiDeposits = depositData.data.data.depositYearOHMDAIEntities
        const ohmFraxDeposits = depositData.data.data.depositYearOHMFRAXEntities
        let data = []

        let daiArray = []
        let ethArray = []
        let fraxArray = []
        let lusdArray = []
        let ohmDaiArray = []
        let ohmFraxArray = []
        for (let i = 0; i < daiDeposits[0].dayDeposit.length; ++i) {
            for (
                let k = 0;
                k < daiDeposits[0].dayDeposit[i].hourDeposit.length;
                ++k
            ) {
                let obj = {}
                obj.amountDai =
                    daiDeposits[0].dayDeposit[i].hourDeposit[k].amount
                obj.depositCountDai =
                    daiDeposits[0].dayDeposit[i].hourDeposit[k].depositCount
                obj.timestamp =
                    daiDeposits[0].dayDeposit[i].hourDeposit[k].timestamp
                daiArray.push(obj)
            }
        }
        for (let i = 0; i < ethDeposits[0].dayDeposit.length; ++i) {
            for (
                let k = 0;
                k < ethDeposits[0].dayDeposit[i].hourDeposit.length;
                ++k
            ) {
                let obj = {}
                obj.amountEth =
                    ethDeposits[0].dayDeposit[i].hourDeposit[k].amount
                obj.depositCountEth =
                    ethDeposits[0].dayDeposit[i].hourDeposit[k].depositCount
                obj.timestamp =
                    ethDeposits[0].dayDeposit[i].hourDeposit[k].timestamp
                ethArray.push(obj)
            }
        }

        for (let i = 0; i < fraxDeposits[0].dayDeposit.length; ++i) {
            for (
                let k = 0;
                k < fraxDeposits[0].dayDeposit[i].hourDeposit.length;
                ++k
            ) {
                let obj = {}
                obj.amountFrax =
                    fraxDeposits[0].dayDeposit[i].hourDeposit[k].amount
                obj.depositCountFrax =
                    fraxDeposits[0].dayDeposit[i].hourDeposit[k].depositCount
                obj.timestamp =
                    fraxDeposits[0].dayDeposit[i].hourDeposit[k].timestamp
                fraxArray.push(obj)
            }
        }

        for (let i = 0; i < lusdDeposits[0].dayDeposit.length; ++i) {
            for (
                let k = 0;
                k < lusdDeposits[0].dayDeposit[i].hourDeposit.length;
                ++k
            ) {
                let obj = {}
                obj.amountLusd =
                    lusdDeposits[0].dayDeposit[i].hourDeposit[k].amount
                obj.depositCountLusd =
                    lusdDeposits[0].dayDeposit[i].hourDeposit[k].depositCount
                obj.timestamp =
                    lusdDeposits[0].dayDeposit[i].hourDeposit[k].timestamp
                lusdArray.push(obj)
            }
        }
        for (let i = 0; i < ohmDaiDeposits[0].dayDeposit.length; ++i) {
            for (
                let k = 0;
                k < ohmDaiDeposits[0].dayDeposit[i].hourDeposit.length;
                ++k
            ) {
                let obj = {}
                obj.amountOhmDai =
                    ohmDaiDeposits[0].dayDeposit[i].hourDeposit[k].amount
                obj.depositCountOhmDai =
                    ohmDaiDeposits[0].dayDeposit[i].hourDeposit[k].depositCount
                obj.timestamp =
                    ohmDaiDeposits[0].dayDeposit[i].hourDeposit[k].timestamp
                ohmDaiArray.push(obj)
            }
        }
        for (let i = 0; i < ohmFraxDeposits[0].dayDeposit.length; ++i) {
            for (
                let k = 0;
                k < ohmFraxDeposits[0].dayDeposit[i].hourDeposit.length;
                ++k
            ) {
                let obj = {}
                obj.amountOhmFrax =
                    ohmFraxDeposits[0].dayDeposit[i].hourDeposit[k].amount
                obj.depositCountOhmFrax =
                    ohmFraxDeposits[0].dayDeposit[i].hourDeposit[k].depositCount
                obj.timestamp =
                    ohmFraxDeposits[0].dayDeposit[i].hourDeposit[k].timestamp
                ohmFraxArray.push(obj)
            }
        }

        for (let i = 0; i < 24 * days; ++i) {
            let beginTimestamp = startTimestamp + i * 3600
            let endTimestamp = startTimestamp + (i + 1) * 3600
            let obj = {
                amountDai: 0,
                amountEth: 0,
                amountFrax: 0,
                amountLusd: 0,
                amountOhmDai: 0,
                amountOhmFrax: 0,
                depositCountDai: 0,
                depositCountEth: 0,
                depositCountFrax: 0,
                depositCountOhmDai: 0,
                depositCountOhmFrax: 0,
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp,
            }
            for (let j = 0; j < daiArray.length; ++j) {
                if (
                    beginTimestamp <= daiArray[j].timestamp &&
                    daiArray[j].timestamp < endTimestamp
                ) {
                    obj.amountDai = daiArray[j].amountDai
                    obj.depositCountDai = daiArray[j].depositCountDai
                }
            }
            for (let j = 0; j < ethArray.length; ++j) {
                if (
                    beginTimestamp <= ethArray[j].timestamp &&
                    ethArray[j].timestamp < endTimestamp
                ) {
                    obj.amountEth = ethArray[j].amountEth
                    obj.depositCountEth = ethArray[j].depositCountEth
                }
            }
            for (let j = 0; j < fraxArray.length; ++j) {
                if (
                    beginTimestamp <= fraxArray[j].timestamp &&
                    fraxArray[j].timestamp < endTimestamp
                ) {
                    obj.amountFrax = fraxArray[j].amountFrax
                    obj.depositCountFrax = fraxArray[j].depositCountFrax
                }
            }
            for (let j = 0; j < lusdArray.length; ++j) {
                if (
                    beginTimestamp <= lusdArray[j].timestamp &&
                    lusdArray[j].timestamp < endTimestamp
                ) {
                    obj.amountLusd = lusdArray[j].amountLusd
                    obj.depositCountLusd = lusdArray[j].depositCountLusd
                }
            }
            for (let j = 0; j < ohmDaiArray.length; ++j) {
                if (
                    beginTimestamp <= ohmDaiArray[j].timestamp &&
                    ohmDaiArray[j].timestamp < endTimestamp
                ) {
                    obj.amountOhmDai = ohmDaiArray[j].amountOhmDai
                    obj.depositCountOhmDai = ohmDaiArray[j].depositCountOhmDai
                }
            }
            for (let j = 0; j < ohmFraxArray.length; ++j) {
                if (
                    beginTimestamp <= ohmFraxArray[j].timestamp &&
                    ohmFraxArray[j].timestamp < endTimestamp
                ) {
                    obj.amountOhmFrax = ohmFraxArray[j].amountOhmFrax
                    obj.depositCountOhmFrax =
                        ohmFraxArray[j].depositCountOhmFrax
                }
            }
            data.push(obj)
        }
        return data
    } catch (err) {
        console.log(err)
    }
}
/**
 * @dev : Get deposits (minutes)
 */
export async function getDepositsInfoMinutes(startTimestamp, days) {
    let depositQueryDai = `
    {
        depositYearDaiEntities(first: 100 orderBy:timestamp) {
          
          dayDeposit(first: 365 orderBy:timestamp) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                }
              
            }
          }
        }
      }
    
    `
    let depositQueryEth = `
    {
        depositYearETHEntities(first: 100 orderBy:timestamp) {
          
          dayDeposit(first: 365 orderBy:timestamp) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                }
              
            }
          }
        }
      }
    
    `
    let depositQueryFrax = `
    {
        depositYearFraxEntities(first: 100 orderBy:timestamp) {
          
          dayDeposit(first: 365 orderBy:timestamp) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                }
              
            }
          }
        }
      }
    `
    let depositQueryLusd = `
    {
        depositYearLusdEntities(first: 100 orderBy:timestamp) {
          
          dayDeposit(first: 365 orderBy:timestamp) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                }
              
            }
          }
        }
      }
    `

    let depositQueryOhmDai = `
    {
        depositYearOHMDAIEntities(first: 100 orderBy:timestamp) {
          
          dayDeposit(first: 365 orderBy:timestamp) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                }
              
            }
          }
        }
      }
    `

    let depositQueryOhmFrax = `
    {
        depositYearOHMFRAXEntities(first: 100 orderBy:timestamp) {
          
          dayDeposit(first: 365 orderBy:timestamp) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                }
              
            }
          }
        }
      }
    `

    try {
        const depositDataDai = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
                query: depositQueryDai,
            },
        })
        const depositDataEth = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
                query: depositQueryEth,
            },
        })
        const depositDataFrax = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
                query: depositQueryFrax,
            },
        })

        const depositDataLusd = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
                query: depositQueryLusd,
            },
        })
        const depositDataOhmDai = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
                query: depositQueryOhmDai,
            },
        })
        const depositDataOhmFrax = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
                query: depositQueryOhmFrax,
            },
        })
        const daiDeposits = depositDataDai.data.data.depositYearDaiEntities
        const ethDeposits = depositDataEth.data.data.depositYearETHEntities
        const fraxDeposits = depositDataFrax.data.data.depositYearFraxEntities
        const lusdDeposits = depositDataLusd.data.data.depositYearLusdEntities
        const ohmDaiDeposits =
            depositDataOhmDai.data.data.depositYearOHMDAIEntities
        const ohmFraxDeposits =
            depositDataOhmFrax.data.data.depositYearOHMFRAXEntities
        let data = []

        let daiArray = []
        let ethArray = []
        let fraxArray = []
        let lusdArray = []
        let ohmDaiArray = []
        let ohmFraxArray = []

        for (let i = 0; i < daiDeposits[0].dayDeposit.length; ++i) {
            for (
                let j = 0;
                j < daiDeposits[0].dayDeposit[i].hourDeposit.length;
                ++j
            ) {
                for (
                    let k = 0;
                    k <
                    daiDeposits[0].dayDeposit[i].hourDeposit[j].minuteDeposit
                        .length;
                    ++k
                ) {
                    let obj = {}
                    obj.amountDaiMinute =
                        daiDeposits[0].dayDeposit[i].hourDeposit[
                            j
                        ].minuteDeposit[k].amount
                    obj.depositCountDai =
                        daiDeposits[0].dayDeposit[i].hourDeposit[
                            j
                        ].minuteDeposit[k].depositCount
                    obj.timestamp =
                        daiDeposits[0].dayDeposit[i].hourDeposit[
                            j
                        ].minuteDeposit[k].timestamp
                    daiArray.push(obj)
                }
            }
        }

        for (let i = 0; i < ethDeposits[0].dayDeposit.length; ++i) {
            for (
                let j = 0;
                j < ethDeposits[0].dayDeposit[i].hourDeposit.length;
                ++j
            ) {
                for (
                    let k = 0;
                    k <
                    ethDeposits[0].dayDeposit[i].hourDeposit[j].minuteDeposit
                        .length;
                    ++k
                ) {
                    let obj = {}
                    obj.amountEthMinute =
                        ethDeposits[0].dayDeposit[i].hourDeposit[
                            j
                        ].minuteDeposit[k].amount
                    obj.depositCountEth =
                        ethDeposits[0].dayDeposit[i].hourDeposit[
                            j
                        ].minuteDeposit[k].depositCount
                    obj.timestamp =
                        ethDeposits[0].dayDeposit[i].hourDeposit[
                            j
                        ].minuteDeposit[k].timestamp
                    ethArray.push(obj)
                }
            }
        }

        for (let i = 0; i < fraxDeposits[0].dayDeposit.length; ++i) {
            for (
                let j = 0;
                j < fraxDeposits[0].dayDeposit[i].hourDeposit.length;
                ++j
            ) {
                for (
                    let k = 0;
                    k <
                    fraxDeposits[0].dayDeposit[i].hourDeposit[j].minuteDeposit
                        .length;
                    ++k
                ) {
                    let obj = {}
                    obj.amountFraxMinute =
                        fraxDeposits[0].dayDeposit[i].hourDeposit[
                            j
                        ].minuteDeposit[k].amount
                    obj.depositCountFrax =
                        fraxDeposits[0].dayDeposit[i].hourDeposit[
                            j
                        ].minuteDeposit[k].depositCount
                    obj.timestamp =
                        fraxDeposits[0].dayDeposit[i].hourDeposit[
                            j
                        ].minuteDeposit[k].timestamp
                    fraxArray.push(obj)
                }
            }
        }
        for (let i = 0; i < lusdDeposits[0].dayDeposit.length; ++i) {
            for (
                let j = 0;
                j < lusdDeposits[0].dayDeposit[i].hourDeposit.length;
                ++j
            ) {
                for (
                    let k = 0;
                    k <
                    lusdDeposits[0].dayDeposit[i].hourDeposit[j].minuteDeposit
                        .length;
                    ++k
                ) {
                    let obj = {}
                    obj.amountLusdMinute =
                        lusdDeposits[0].dayDeposit[i].hourDeposit[
                            j
                        ].minuteDeposit[k].amount
                    obj.depositCountLusd =
                        lusdDeposits[0].dayDeposit[i].hourDeposit[
                            j
                        ].minuteDeposit[k].depositCount
                    obj.timestamp =
                        lusdDeposits[0].dayDeposit[i].hourDeposit[
                            j
                        ].minuteDeposit[k].timestamp
                    lusdArray.push(obj)
                }
            }
        }
        for (let i = 0; i < ohmDaiDeposits[0].dayDeposit.length; ++i) {
            for (
                let j = 0;
                j < ohmDaiDeposits[0].dayDeposit[i].hourDeposit.length;
                ++j
            ) {
                for (
                    let k = 0;
                    k <
                    ohmDaiDeposits[0].dayDeposit[i].hourDeposit[j].minuteDeposit
                        .length;
                    ++k
                ) {
                    let obj = {}
                    obj.amountOhmDaiMinute =
                        ohmDaiDeposits[0].dayDeposit[i].hourDeposit[
                            j
                        ].minuteDeposit[k].amount
                    obj.depositCountOhmDai =
                        ohmDaiDeposits[0].dayDeposit[i].hourDeposit[
                            j
                        ].minuteDeposit[k].depositCount
                    obj.timestamp =
                        ohmDaiDeposits[0].dayDeposit[i].hourDeposit[
                            j
                        ].minuteDeposit[k].timestamp
                    ohmDaiArray.push(obj)
                }
            }
        }
        for (let i = 0; i < ohmFraxDeposits[0].dayDeposit.length; ++i) {
            for (
                let j = 0;
                j < ohmFraxDeposits[0].dayDeposit[i].hourDeposit.length;
                ++j
            ) {
                for (
                    let k = 0;
                    k <
                    ohmFraxDeposits[0].dayDeposit[i].hourDeposit[j]
                        .minuteDeposit.length;
                    ++k
                ) {
                    let obj = {}
                    obj.amountOhmFraxMinute =
                        ohmFraxDeposits[0].dayDeposit[i].hourDeposit[
                            j
                        ].minuteDeposit[k].amount
                    obj.depositCountOhmFrax =
                        ohmFraxDeposits[0].dayDeposit[i].hourDeposit[
                            j
                        ].minuteDeposit[k].depositCount
                    obj.timestamp =
                        ohmFraxDeposits[0].dayDeposit[i].hourDeposit[
                            j
                        ].minuteDeposit[k].timestamp
                    ohmFraxArray.push(obj)
                }
            }
        }
        for (let i = 0; i < 60 * 24 * days; ++i) {
            let beginTimestamp = startTimestamp + i * 60
            let endTimestamp = startTimestamp + (i + 1) * 60
            let obj = {
                amountDaiHour: 0,
                amountEthHour: 0,
                amountFraxHour: 0,
                amountLusdHour: 0,
                amountOhmDaiHour: 0,
                amountOhmFraxHour: 0,
                depositCountDai: 0,
                depositCountEth: 0,
                depositCountFrax: 0,
                depositCountOhmDai: 0,
                depositCountOhmFrax: 0,
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp,
            }
            for (let j = 0; j < daiArray.length; ++j) {
                if (
                    beginTimestamp <= daiArray[j].timestamp &&
                    daiArray[j].timestamp < endTimestamp
                ) {
                    obj.amountDaiMinute = daiArray[j].amountDaiMinute
                    obj.depositCountDai = daiArray[j].depositCountDai
                }
            }
            for (let j = 0; j < ethArray.length; ++j) {
                if (
                    beginTimestamp <= ethArray[j].timestamp &&
                    ethArray[j].timestamp < endTimestamp
                ) {
                    obj.amountEthMinute = ethArray[j].amountEthMinute
                    obj.depositCountEth = ethArray[j].depositCountEth
                }
            }
            for (let j = 0; j < fraxArray.length; ++j) {
                if (
                    beginTimestamp <= fraxArray[j].timestamp &&
                    fraxArray[j].timestamp < endTimestamp
                ) {
                    obj.amountFraxMinute = fraxArray[j].amountFraxMinute
                    obj.depositCountFrax = fraxArray[j].depositCountFrax
                }
            }
            for (let j = 0; j < lusdArray.length; ++j) {
                if (
                    beginTimestamp <= lusdArray[j].timestamp &&
                    lusdArray[j].timestamp < endTimestamp
                ) {
                    obj.amountLusdMinute = lusdArray[j].amountLusdMinute
                    obj.depositCountLusd = lusdArray[j].depositCountLusd
                }
            }
            for (let j = 0; j < ohmDaiArray.length; ++j) {
                if (
                    beginTimestamp <= ohmDaiArray[j].timestamp &&
                    ohmDaiArray[j].timestamp < endTimestamp
                ) {
                    obj.amountOhmDaiMinute = ohmDaiArray[j].amountOhmDaiMinute
                    obj.depositCountOhmDai = ohmDaiArray[j].depositCountOhmDai
                }
            }
            for (let j = 0; j < ohmFraxArray.length; ++j) {
                if (
                    beginTimestamp <= ohmFraxArray[j].timestamp &&
                    ohmFraxArray[j].timestamp < endTimestamp
                ) {
                    obj.amountOhmFraxMinute =
                        ohmFraxArray[j].amountOhmFraxMinute
                    obj.depositCountOhmFrax =
                        ohmFraxArray[j].depositCountOhmFrax
                }
            }
            data.push(obj)
        }

        return data
    } catch (err) {
        console.log(err)
    }
}

class TVTimeValueObject {
    constructor(value, time) {
        this.time = time
        this.value = value
    }
}

export function mapBonds(bonds) {
    return bonds.reduce(
        (acc, e) => {
            const time = parseInt(e.beginTimestamp)

            // amounts
            acc.amountDai.push(new TVTimeValueObject(Number(e.amountDai), time))
            acc.amountEth.push(new TVTimeValueObject(Number(e.amountEth), time))
            acc.amountFrax.push(
                new TVTimeValueObject(Number(e.amountFrax), time)
            )
            acc.amountLusd.push(
                new TVTimeValueObject(Number(e.amountLusd), time)
            )
            acc.amountOhmDai.push(
                new TVTimeValueObject(Number(e.amountOhmDai), time)
            )
            acc.amountOhmFrax.push(
                new TVTimeValueObject(Number(e.amountOhmFrax), time)
            )

            // count
            acc.depositCountDai.push(
                new TVTimeValueObject(Number(e.depositCountDai), time)
            )
            acc.depositCountEth.push(
                new TVTimeValueObject(Number(e.depositCountEth), time)
            )
            acc.depositCountFrax.push(
                new TVTimeValueObject(Number(e.depositCountFrax), time)
            )
            acc.depositCountLusd.push(
                new TVTimeValueObject(Number(e.depositCountLusd), time)
            )
            acc.depositCountOhmDai.push(
                new TVTimeValueObject(Number(e.depositCountOhmDai), time)
            )
            acc.depositCountOhmFrax.push(
                new TVTimeValueObject(Number(e.depositCountOhmFrax), time)
            )
            return acc
        },
        {
            amountDai: [],
            amountEth: [],
            amountFrax: [],
            amountLusd: [],
            amountOhmDai: [],
            amountOhmFrax: [],
            depositCountDai: [],
            depositCountEth: [],
            depositCountFrax: [],
            depositCountLusd: [],
            depositCountOhmDai: [],
            depositCountOhmFrax: [],
        }
    )
}
