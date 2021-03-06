import axios from 'axios'
import { TVValueTimeObject } from '../util/tvSeries'

/**
 * @dev : Get deposits (N days)
 * @param startTimestamp - Start timestamp for query
 * @param endTime - End timestamp for query
 * @param days - Number of days
 */
export async function getBondsInfoDays(startTimestamp, endTime, days) {
    let depositQuery = `
    {
        depositYearDaiEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"DAI"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
            
            id
            amount
            timestamp
            depositCount
            redeemCount
            payout
            initBCV
            newBCV
            adjustment

          }
        }
        depositYearETHEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"WETH"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
                id
                amount
                timestamp
                depositCount
                redeemCount
                payout
                initBCV
                newBCV
                adjustment

            }
          }
          depositYearFraxEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"FRAX"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
                id
                amount
                timestamp
                depositCount
                redeemCount
                payout
                initBCV
                newBCV
                adjustment

            }
          }
          depositYearLusdEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"LUSD"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
                id
                amount
                timestamp
                depositCount
                redeemCount
                payout
                initBCV
                newBCV
                adjustment

            }
          }
          depositYearOHMDAIEntities:depositYearEntities(first: 100 orderBy:timestamp where:{token:"OHM-DAI"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
                id
                amount
                timestamp
                depositCount
                redeemCount
                payout
                initBCV
                newBCV
                adjustment

            }
          }
          depositYearOHMFRAXEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"OHM-FRAX"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
                id
                amount
                timestamp
                depositCount
                redeemCount
                payout
                initBCV
                newBCV
                adjustment

            }
          }
          depositYearOHMLUSDEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"OHM-LUSD"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
                id
                amount
                timestamp
                depositCount
                redeemCount
                payout
                initBCV
                newBCV
                adjustment

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
        const ohmLusdDeposits = depositData.data.data.depositYearOHMLUSDEntities
        let data = []

        let daiArray = []
        let ethArray = []
        let fraxArray = []
        let lusdArray = []
        let ohmDaiArray = []
        let ohmFraxArray = []
        let ohmLusdArray = []

        if (daiDeposits.length != 0) {
            for (let c = 0; c < daiDeposits.length; ++c) {
                for (let i = 0; i < daiDeposits[0].dayDeposit.length; ++i) {
                    let obj = {}
                    obj.adjustment = daiDeposits[c].dayDeposit[i].adjustment
                    obj.initBCV = daiDeposits[c].dayDeposit[i].initBCV
                    obj.newBCV = daiDeposits[c].dayDeposit[i].newBCV
                    obj.amountDai = daiDeposits[c].dayDeposit[i].amount
                    obj.payoutDai = daiDeposits[c].dayDeposit[i].payout
                    obj.depositCountDai =
                        daiDeposits[c].dayDeposit[i].depositCount
                    obj.redeemCountDai =
                        daiDeposits[c].dayDeposit[i].redeemCount
                    obj.timestamp = daiDeposits[c].dayDeposit[i].timestamp
                    daiArray.push(obj)
                }
            }
        }

        if (ethDeposits.length != 0) {
            for (let c = 0; c < ethDeposits.length; ++c) {
                for (let i = 0; i < ethDeposits[c].dayDeposit.length; ++i) {
                    let obj = {}
                    obj.adjustment = ethDeposits[c].dayDeposit[i].adjustment
                    obj.initBCV = ethDeposits[c].dayDeposit[i].initBCV
                    obj.newBCV = ethDeposits[c].dayDeposit[i].newBCV

                    obj.amountEth = ethDeposits[c].dayDeposit[i].amount
                    obj.payoutEth = ethDeposits[c].dayDeposit[i].payout
                    obj.depositCountEth =
                        ethDeposits[c].dayDeposit[i].depositCount
                    obj.redeemCountEth =
                        ethDeposits[c].dayDeposit[i].redeemCount
                    obj.timestamp = ethDeposits[c].dayDeposit[i].timestamp
                    ethArray.push(obj)
                }
            }
        }

        if (fraxDeposits.length != 0) {
            for (let c = 0; c < fraxDeposits.length; ++c) {
                for (let i = 0; i < fraxDeposits[c].dayDeposit.length; ++i) {
                    let obj = {}
                    obj.adjustment = fraxDeposits[c].dayDeposit[i].adjustment
                    obj.initBCV = fraxDeposits[c].dayDeposit[i].initBCV
                    obj.newBCV = fraxDeposits[c].dayDeposit[i].newBCV
                    obj.amountFrax = fraxDeposits[c].dayDeposit[i].amount
                    obj.payoutFrax = fraxDeposits[c].dayDeposit[i].payout
                    obj.depositCountFrax =
                        fraxDeposits[c].dayDeposit[i].depositCount
                    obj.redeemCountFrax =
                        fraxDeposits[c].dayDeposit[i].redeemCount
                    obj.timestamp = fraxDeposits[c].dayDeposit[i].timestamp
                    fraxArray.push(obj)
                }
            }
        }

        if (lusdDeposits.length != 0) {
            for (let c = 0; c < lusdDeposits.length; ++c) {
                for (let i = 0; i < lusdDeposits[c].dayDeposit.length; ++i) {
                    let obj = {}
                    obj.adjustment = lusdDeposits[c].dayDeposit[i].adjustment
                    obj.initBCV = lusdDeposits[c].dayDeposit[i].initBCV
                    obj.newBCV = lusdDeposits[c].dayDeposit[i].newBCV
                    obj.amountLusd = lusdDeposits[c].dayDeposit[i].amount
                    obj.payoutLusd = lusdDeposits[c].dayDeposit[i].payout
                    obj.depositCountLusd =
                        lusdDeposits[c].dayDeposit[i].depositCount
                    obj.redeemCountLusd =
                        lusdDeposits[c].dayDeposit[i].redeemCount
                    obj.timestamp = lusdDeposits[c].dayDeposit[i].timestamp
                    lusdArray.push(obj)
                }
            }
        }

        if (ohmFraxDeposits.length != 0) {
            for (let c = 0; c < ohmDaiDeposits.length; ++c) {
                for (let i = 0; i < ohmDaiDeposits[c].dayDeposit.length; ++i) {
                    let obj = {}
                    obj.adjustment = ohmDaiDeposits[c].dayDeposit[i].adjustment
                    obj.initBCV = ohmDaiDeposits[c].dayDeposit[i].initBCV
                    obj.newBCV = ohmDaiDeposits[c].dayDeposit[i].newBCV
                    obj.amountOhmDai = ohmDaiDeposits[c].dayDeposit[i].amount
                    obj.payoutOhmDai = ohmDaiDeposits[c].dayDeposit[i].payout
                    obj.depositCountOhmDai =
                        ohmDaiDeposits[c].dayDeposit[i].depositCount
                    obj.redeemCountOhmDai =
                        ohmDaiDeposits[c].dayDeposit[i].redeemCount
                    obj.timestamp = ohmDaiDeposits[c].dayDeposit[i].timestamp
                    ohmDaiArray.push(obj)
                }
            }
        }

        if (ohmFraxDeposits.length != 0) {
            for (let c = 0; c < ohmFraxDeposits.length; ++c) {
                for (let i = 0; i < ohmFraxDeposits[c].dayDeposit.length; ++i) {
                    let obj = {}
                    obj.adjustment = ohmFraxDeposits[c].dayDeposit[i].adjustment
                    obj.initBCV = ohmFraxDeposits[c].dayDeposit[i].initBCV
                    obj.newBCV = ohmFraxDeposits[c].dayDeposit[i].newBCV
                    obj.amountOhmFrax = ohmFraxDeposits[c].dayDeposit[i].amount
                    obj.payoutOhmFrax = ohmFraxDeposits[c].dayDeposit[i].payout
                    obj.depositCountOhmFrax =
                        ohmFraxDeposits[c].dayDeposit[i].depositCount
                    obj.redeemCountOhmFrax =
                        ohmFraxDeposits[c].dayDeposit[i].redeemCount
                    obj.timestamp = ohmFraxDeposits[c].dayDeposit[i].timestamp
                    ohmFraxArray.push(obj)
                }
            }
        }

        if (ohmLusdDeposits.length != 0) {
            for (let c = 0; c < ohmLusdDeposits.length; ++c) {
                for (let i = 0; i < ohmLusdDeposits[c].dayDeposit.length; ++i) {
                    let obj = {}
                    obj.adjustment = ohmLusdDeposits[c].dayDeposit[i].adjustment
                    obj.initBCV = ohmLusdDeposits[c].dayDeposit[i].initBCV
                    obj.newBCV = ohmLusdDeposits[c].dayDeposit[i].newBCV
                    obj.amountOhmLusd = ohmLusdDeposits[c].dayDeposit[i].amount
                    obj.payoutOhmLusd = ohmLusdDeposits[c].dayDeposit[i].payout
                    obj.depositCountOhmLusd =
                        ohmLusdDeposits[c].dayDeposit[i].depositCount
                    obj.redeemCountOhmLusd =
                        ohmLusdDeposits[c].dayDeposit[i].redeemCount
                    obj.timestamp = ohmLusdDeposits[c].dayDeposit[i].timestamp
                    ohmLusdArray.push(obj)
                }
            }
        }

        for (
            let beginTimestamp = startTimestamp,
                endTimestamp = startTimestamp + days * 86400;
            beginTimestamp < endTime;
            beginTimestamp += days * 86400, endTimestamp += days * 86400
        ) {
            let obj = {
                amountDai: 0,
                amountEth: 0,
                amountFrax: 0,
                amountLusd: 0,
                amountOhmDai: 0,
                amountOhmFrax: 0,
                amountOhmLusd: 0,
                amountDaiAvg: 0,
                amountEthAvg: 0,
                amountLusdAvg: 0,
                amountFraxAvg: 0,
                amountOhmDaiAvg: 0,
                amountOhmFraxAvg: 0,
                amountOhmLusdAvg: 0,
                payoutDai: 0,
                payoutEth: 0,
                payoutFrax: 0,
                payoutLusd: 0,
                payoutOhmDai: 0,
                payoutOhmFrax: 0,
                payoutOhmLusd: 0,
                depositCountDai: 0,
                depositCountEth: 0,
                depositCountLusd: 0,
                depositCountFrax: 0,
                depositCountOhmDai: 0,
                depositCountOhmFrax: 0,
                depositCountOhmLusd: 0,
                redeemCountDai: 0,
                redeemCountLusd: 0,
                redeemCountEth: 0,
                redeemCountFrax: 0,
                redeemCountOhmDai: 0,
                redeemCountOhmFrax: 0,
                redeemCountOhmLusd: 0,
                initBCVDai: 0,
                newBCVDai: 0,
                adjustmentDai: 0,
                initBCVEth: 0,
                newBCVEth: 0,
                adjustmentEth: 0,
                initBCVFrax: 0,
                newBCVFrax: 0,
                adjustmentFrax: 0,
                initBCVLusd: 0,
                newBCVLusd: 0,
                adjustmentLusd: 0,
                initBCVOhmDai: 0,
                newBCVOhmDai: 0,
                adjustmentOhmDai: 0,
                initBCVOhmFrax: 0,
                newBCVOhmFrax: 0,
                adjustmentOhmFrax: 0,
                initBCVOhmLusd: 0,
                newBCVOhmLusd: 0,
                adjustmentOhmLusd: 0,
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp,
            }
            for (let j = 0; j < daiArray.length; ++j) {
                if (
                    beginTimestamp <= daiArray[j].timestamp &&
                    daiArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVDai = daiArray[j].initBCV
                    obj.newBCVDai = daiArray[j].newBCV
                    obj.adjustmentDai = daiArray[j].adjustment
                    obj.amountDai += Number(daiArray[j].amountDai)
                    obj.depositCountDai += Number(daiArray[j].depositCountDai)
                    obj.redeemCountDai += Number(daiArray[j].redeemCountDai)
                    obj.payoutDai += Number(daiArray[j].payoutDai)
                    if (obj.depositCountDai != 0) {
                        obj.amountDaiAvg = obj.amountDai / obj.depositCountDai
                    }
                }
            }
            for (let j = 0; j < ethArray.length; ++j) {
                if (
                    beginTimestamp <= ethArray[j].timestamp &&
                    ethArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVEth = ethArray[j].initBCV
                    obj.newBCVEth = ethArray[j].newBCV
                    obj.adjustmentEth = ethArray[j].adjustment

                    obj.amountEth += Number(ethArray[j].amountEth)
                    obj.depositCountEth += Number(ethArray[j].depositCountEth)
                    obj.redeemCountEth += Number(ethArray[j].redeemCountEth)
                    obj.payoutEth += Number(ethArray[j].payoutEth)
                    if (obj.depositCountEth != 0) {
                        obj.amountEthAvg = obj.amountEth / obj.depositCountEth
                    }
                }
            }
            for (let j = 0; j < fraxArray.length; ++j) {
                if (
                    beginTimestamp <= fraxArray[j].timestamp &&
                    fraxArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVFrax = fraxArray[j].initBCV
                    obj.newBCVFrax = fraxArray[j].newBCV
                    obj.adjustmentFrax = fraxArray[j].adjustment

                    obj.amountFrax += Number(fraxArray[j].amountFrax)
                    obj.depositCountFrax += Number(
                        fraxArray[j].depositCountFrax
                    )
                    obj.redeemCountFrax += Number(fraxArray[j].redeemCountFrax)
                    obj.payoutFrax += Number(fraxArray[j].payoutFrax)
                    if (obj.depositCountFrax != 0) {
                        obj.amountFraxAvg =
                            obj.amountFrax / obj.depositCountFrax
                    }
                }
            }
            for (let j = 0; j < lusdArray.length; ++j) {
                if (
                    beginTimestamp <= lusdArray[j].timestamp &&
                    lusdArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVLusd = lusdArray[j].initBCV
                    obj.newBCVLusd = lusdArray[j].newBCV
                    obj.adjustmentLusd = lusdArray[j].adjustment

                    obj.amountLusd += Number(lusdArray[j].amountLusd)
                    obj.depositCountLusd += Number(
                        lusdArray[j].depositCountLusd
                    )
                    obj.redeemCountLusd += Number(lusdArray[j].redeemCountLusd)
                    obj.payoutLusd += Number(lusdArray[j].payoutLusd)
                    if (obj.depositCountLusd != 0) {
                        obj.amountLusdAvg =
                            obj.amountLusd / obj.depositCountLusd
                    }
                }
            }
            for (let j = 0; j < ohmDaiArray.length; ++j) {
                if (
                    beginTimestamp <= ohmDaiArray[j].timestamp &&
                    ohmDaiArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVOhmDai = ohmDaiArray[j].initBCV
                    obj.newBCVOhmDai = ohmDaiArray[j].newBCV
                    obj.adjustmentOhmDai = ohmDaiArray[j].adjustment

                    obj.amountOhmDai += Number(ohmDaiArray[j].amountOhmDai)
                    obj.depositCountOhmDai += Number(
                        ohmDaiArray[j].depositCountOhmDai
                    )
                    obj.redeemCountOhmDai += Number(
                        ohmDaiArray[j].redeemCountOhmDai
                    )
                    obj.payoutOhmDai += Number(ohmDaiArray[j].payoutOhmDai)
                    if (obj.depositCountOhmDai != 0) {
                        obj.amountOhmDaiAvg =
                            obj.amountOhmDai / obj.depositCountOhmDai
                    }
                }
            }
            for (let j = 0; j < ohmFraxArray.length; ++j) {
                if (
                    beginTimestamp <= ohmFraxArray[j].timestamp &&
                    ohmFraxArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVOhmFrax = ohmFraxArray[j].initBCV
                    obj.newBCVOhmFrax = ohmFraxArray[j].newBCV
                    obj.adjustmentOhmFrax = ohmFraxArray[j].adjustment

                    obj.amountOhmFrax += Number(ohmFraxArray[j].amountOhmFrax)
                    obj.depositCountOhmFrax += Number(
                        ohmFraxArray[j].depositCountOhmFrax
                    )
                    obj.redeemCountOhmFrax += Number(
                        ohmFraxArray[j].redeemCountOhmFrax
                    )
                    obj.payoutOhmFrax += Number(ohmFraxArray[j].payoutOhmFrax)
                    if (obj.depositCountOhmFrax != 0) {
                        obj.amountOhmFraxAvg =
                            obj.amountOhmFrax / obj.depositCountOhmFrax
                    }
                }
            }
            for (let j = 0; j < ohmLusdArray.length; ++j) {
                if (
                    beginTimestamp <= ohmLusdArray[j].timestamp &&
                    ohmLusdArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVOhmLusd = ohmLusdArray[j].initBCV
                    obj.newBCVOhmLusd = ohmLusdArray[j].newBCV
                    obj.adjustmentOhmLusd = ohmLusdArray[j].adjustment

                    obj.amountOhmLusd += Number(ohmLusdArray[j].amountOhmLusd)
                    obj.depositCountOhmLusd += Number(
                        ohmLusdArray[j].depositCountOhmLusd
                    )
                    obj.redeemCountOhmLusd += Number(
                        ohmLusdArray[j].redeemCountOhmLusd
                    )
                    obj.payoutOhmLusd += Number(ohmLusdArray[j].payoutOhmLusd)
                    if (obj.depositCountOhmLusd != 0) {
                        obj.amountOhmLusdAvg =
                            obj.amountOhmLusd / obj.depositCountOhmLusd
                    }
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

    * @dev : Get deposits (N hours)
    * @param startTimestamp - Start timestamp for query 
    * @param endTime - End timestamp for query
    * @param hours - Number of hours
*/
export async function getBondsInfoNHours(startTimestamp, endTime, hours) {
    let depositQuery = `
    {
        depositYearDaiEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"DAI"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
              id
                  amount
                  timestamp
                  depositCount
                  redeemCount
                  payout
                  initBCV
                  newBCV
                  adjustment
      
            }
          }
        }
        depositYearETHEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"WETH"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
              }
            }
          }
          depositYearFraxEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"FRAX"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
              }
            }
          }
          depositYearLusdEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"LUSD"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
              }
            }
          }
          depositYearOHMDAIEntities:depositYearEntities(first: 100 orderBy:timestamp where:{token:"OHM-DAI"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
              }
            }
          }
          depositYearOHMFRAXEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"OHM-FRAX"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
              }
            }
          }
          depositYearOHMLUSDEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"OHM-LUSD"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
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
        const ohmLusdDeposits = depositData.data.data.depositYearOHMLUSDEntities
        let data = []

        let daiArray = []
        let ethArray = []
        let fraxArray = []
        let lusdArray = []
        let ohmDaiArray = []
        let ohmFraxArray = []
        let ohmLusdArray = []

        if (daiDeposits.length != 0) {
            for (let c = 0; c < daiDeposits.length; ++c) {
                for (let i = 0; i < daiDeposits[0].dayDeposit.length; ++i) {
                    for (
                        let k = 0;
                        k < daiDeposits[0].dayDeposit[i].hourDeposit.length;
                        ++k
                    ) {
                        let obj = {}
                        obj.adjustment =
                            daiDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].adjustment
                        obj.initBCV =
                            daiDeposits[c].dayDeposit[i].hourDeposit[k].initBCV
                        obj.newBCV =
                            daiDeposits[c].dayDeposit[i].hourDeposit[k].newBCV
                        obj.amountDai =
                            daiDeposits[c].dayDeposit[i].hourDeposit[k].amount
                        obj.payoutDai =
                            daiDeposits[c].dayDeposit[i].hourDeposit[k].payout
                        obj.depositCountDai =
                            daiDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].depositCount
                        obj.redeemCountDai =
                            daiDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].redeemCount
                        obj.timestamp =
                            daiDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].timestamp
                        daiArray.push(obj)
                    }
                }
            }
        }

        if (ethDeposits.length != 0) {
            for (let c = 0; c < ethDeposits.length; ++c) {
                for (let i = 0; i < ethDeposits[c].dayDeposit.length; ++i) {
                    for (
                        let k = 0;
                        k < ethDeposits[c].dayDeposit[i].hourDeposit.length;
                        ++k
                    ) {
                        let obj = {}
                        obj.adjustment =
                            ethDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].adjustment
                        obj.initBCV =
                            ethDeposits[c].dayDeposit[i].hourDeposit[k].initBCV
                        obj.newBCV =
                            ethDeposits[c].dayDeposit[i].hourDeposit[k].newBCV

                        obj.amountEth =
                            ethDeposits[c].dayDeposit[i].hourDeposit[k].amount
                        obj.payoutEth =
                            ethDeposits[c].dayDeposit[i].hourDeposit[k].payout
                        obj.depositCountEth =
                            ethDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].depositCount
                        obj.redeemCountEth =
                            ethDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].redeemCount
                        obj.timestamp =
                            ethDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].timestamp
                        ethArray.push(obj)
                    }
                }
            }
        }

        if (fraxDeposits.length != 0) {
            for (let c = 0; c < fraxDeposits.length; ++c) {
                for (let i = 0; i < fraxDeposits[c].dayDeposit.length; ++i) {
                    for (
                        let k = 0;
                        k < fraxDeposits[c].dayDeposit[i].hourDeposit.length;
                        ++k
                    ) {
                        let obj = {}
                        obj.adjustment =
                            fraxDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].adjustment
                        obj.initBCV =
                            fraxDeposits[c].dayDeposit[i].hourDeposit[k].initBCV
                        obj.newBCV =
                            fraxDeposits[c].dayDeposit[i].hourDeposit[k].newBCV

                        obj.amountFrax =
                            fraxDeposits[c].dayDeposit[i].hourDeposit[k].amount
                        obj.payoutFrax =
                            fraxDeposits[c].dayDeposit[i].hourDeposit[k].payout
                        obj.depositCountFrax =
                            fraxDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].depositCount
                        obj.redeemCountFrax =
                            fraxDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].redeemCount
                        obj.timestamp =
                            fraxDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].timestamp
                        fraxArray.push(obj)
                    }
                }
            }
        }

        if (lusdDeposits.length != 0) {
            for (let c = 0; c < lusdDeposits.length; ++c) {
                for (let i = 0; i < lusdDeposits[c].dayDeposit.length; ++i) {
                    for (
                        let k = 0;
                        k < lusdDeposits[c].dayDeposit[i].hourDeposit.length;
                        ++k
                    ) {
                        let obj = {}
                        obj.adjustment =
                            lusdDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].adjustment
                        obj.initBCV =
                            lusdDeposits[c].dayDeposit[i].hourDeposit[k].initBCV
                        obj.newBCV =
                            lusdDeposits[c].dayDeposit[i].hourDeposit[k].newBCV

                        obj.amountLusd =
                            lusdDeposits[c].dayDeposit[i].hourDeposit[k].amount
                        obj.payoutLusd =
                            lusdDeposits[c].dayDeposit[i].hourDeposit[k].payout
                        obj.depositCountLusd =
                            lusdDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].depositCount
                        obj.redeemCountLusd =
                            lusdDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].redeemCount
                        obj.timestamp =
                            lusdDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].timestamp
                        lusdArray.push(obj)
                    }
                }
            }
        }

        if (ohmFraxDeposits.length != 0) {
            for (let c = 0; c < ohmDaiDeposits.length; ++c) {
                for (let i = 0; i < ohmDaiDeposits[c].dayDeposit.length; ++i) {
                    for (
                        let k = 0;
                        k < ohmDaiDeposits[c].dayDeposit[i].hourDeposit.length;
                        ++k
                    ) {
                        let obj = {}
                        obj.adjustment =
                            ohmDaiDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].adjustment
                        obj.initBCV =
                            ohmDaiDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].initBCV
                        obj.newBCV =
                            ohmDaiDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].newBCV

                        obj.amountOhmDai =
                            ohmDaiDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].amount
                        obj.payoutOhmDai =
                            ohmDaiDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].payout
                        obj.depositCountOhmDai =
                            ohmDaiDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].depositCount
                        obj.redeemCountOhmDai =
                            ohmDaiDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].redeemCount
                        obj.timestamp =
                            ohmDaiDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].timestamp
                        ohmDaiArray.push(obj)
                    }
                }
            }
        }

        if (ohmFraxDeposits.length != 0) {
            for (let c = 0; c < ohmFraxDeposits.length; ++c) {
                for (let i = 0; i < ohmFraxDeposits[c].dayDeposit.length; ++i) {
                    for (
                        let k = 0;
                        k < ohmFraxDeposits[c].dayDeposit[i].hourDeposit.length;
                        ++k
                    ) {
                        let obj = {}
                        obj.adjustment =
                            ohmFraxDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].adjustment
                        obj.initBCV =
                            ohmFraxDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].initBCV
                        obj.newBCV =
                            ohmFraxDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].newBCV

                        obj.amountOhmFrax =
                            ohmFraxDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].amount
                        obj.payoutOhmFrax =
                            ohmFraxDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].payout
                        obj.depositCountOhmFrax =
                            ohmFraxDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].depositCount
                        obj.redeemCountOhmFrax =
                            ohmFraxDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].redeemCount
                        obj.timestamp =
                            ohmFraxDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].timestamp
                        ohmFraxArray.push(obj)
                    }
                }
            }
        }

        if (ohmLusdDeposits.length != 0) {
            for (let c = 0; c < ohmLusdDeposits.length; ++c) {
                for (let i = 0; i < ohmLusdDeposits[c].dayDeposit.length; ++i) {
                    for (
                        let k = 0;
                        k < ohmLusdDeposits[c].dayDeposit[i].hourDeposit.length;
                        ++k
                    ) {
                        let obj = {}
                        obj.adjustment =
                            ohmLusdDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].adjustment
                        obj.initBCV =
                            ohmLusdDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].initBCV
                        obj.newBCV =
                            ohmLusdDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].newBCV

                        obj.amountOhmLusd =
                            ohmLusdDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].amount
                        obj.payoutOhmLusd =
                            ohmLusdDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].payout
                        obj.depositCountOhmLusd =
                            ohmLusdDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].depositCount
                        obj.redeemCountOhmLusd =
                            ohmLusdDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].redeemCount
                        obj.timestamp =
                            ohmLusdDeposits[c].dayDeposit[i].hourDeposit[
                                k
                            ].timestamp
                        ohmLusdArray.push(obj)
                    }
                }
            }
        }

        for (
            let beginTimestamp = startTimestamp,
                endTimestamp = startTimestamp + hours * 3600;
            beginTimestamp < endTime;
            beginTimestamp += hours * 3600, endTimestamp += hours * 3600
        ) {
            let obj = {
                amountDai: 0,
                amountEth: 0,
                amountFrax: 0,
                amountLusd: 0,
                amountOhmDai: 0,
                amountOhmFrax: 0,
                amountOhmLusd: 0,
                amountDaiAvg: 0,
                amountEthAvg: 0,
                amountLusdAvg: 0,
                amountFraxAvg: 0,
                amountOhmDaiAvg: 0,
                amountOhmFraxAvg: 0,
                amountOhmLusdAvg: 0,
                payoutDai: 0,
                payoutEth: 0,
                payoutFrax: 0,
                payoutLusd: 0,
                payoutOhmDai: 0,
                payoutOhmFrax: 0,
                payoutOhmLusd: 0,
                depositCountDai: 0,
                depositCountEth: 0,
                depositCountLusd: 0,
                depositCountFrax: 0,
                depositCountOhmDai: 0,
                depositCountOhmFrax: 0,
                depositCountOhmLusd: 0,
                redeemCountDai: 0,
                redeemCountLusd: 0,
                redeemCountEth: 0,
                redeemCountFrax: 0,
                redeemCountOhmDai: 0,
                redeemCountOhmFrax: 0,
                redeemCountOhmLusd: 0,
                initBCVDai: 0,
                newBCVDai: 0,
                adjustmentDai: 0,
                initBCVEth: 0,
                newBCVEth: 0,
                adjustmentEth: 0,
                initBCVFrax: 0,
                newBCVFrax: 0,
                adjustmentFrax: 0,
                initBCVLusd: 0,
                newBCVLusd: 0,
                adjustmentLusd: 0,
                initBCVOhmDai: 0,
                newBCVOhmDai: 0,
                adjustmentOhmDai: 0,
                initBCVOhmFrax: 0,
                newBCVOhmFrax: 0,
                adjustmentOhmFrax: 0,
                initBCVOhmLusd: 0,
                newBCVOhmLusd: 0,
                adjustmentOhmLusd: 0,
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp,
            }
            for (let j = 0; j < daiArray.length; ++j) {
                if (
                    beginTimestamp <= daiArray[j].timestamp &&
                    daiArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVDai = daiArray[j].initBCV
                    obj.newBCVDai = daiArray[j].newBCV
                    obj.adjustmentDai = daiArray[j].adjustment
                    obj.amountDai += Number(daiArray[j].amountDai)
                    obj.depositCountDai += Number(daiArray[j].depositCountDai)
                    obj.redeemCountDai += Number(daiArray[j].redeemCountDai)
                    obj.payoutDai += Number(daiArray[j].payoutDai)
                    if (obj.depositCountDai != 0) {
                        obj.amountDaiAvg = obj.amountDai / obj.depositCountDai
                    }
                }
            }
            for (let j = 0; j < ethArray.length; ++j) {
                if (
                    beginTimestamp <= ethArray[j].timestamp &&
                    ethArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVEth = ethArray[j].initBCV
                    obj.newBCVEth = ethArray[j].newBCV
                    obj.adjustmentEth = ethArray[j].adjustment

                    obj.amountEth += Number(ethArray[j].amountEth)
                    obj.depositCountEth += Number(ethArray[j].depositCountEth)
                    obj.redeemCountEth += Number(ethArray[j].redeemCountEth)
                    obj.payoutEth += Number(ethArray[j].payoutEth)
                    if (obj.depositCountEth != 0) {
                        obj.amountEthAvg = obj.amountEth / obj.depositCountEth
                    }
                }
            }
            for (let j = 0; j < fraxArray.length; ++j) {
                if (
                    beginTimestamp <= fraxArray[j].timestamp &&
                    fraxArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVFrax = fraxArray[j].initBCV
                    obj.newBCVFrax = fraxArray[j].newBCV
                    obj.adjustmentFrax = fraxArray[j].adjustment

                    obj.amountFrax += Number(fraxArray[j].amountFrax)
                    obj.depositCountFrax += Number(
                        fraxArray[j].depositCountFrax
                    )
                    obj.redeemCountFrax += Number(fraxArray[j].redeemCountFrax)
                    obj.payoutFrax += Number(fraxArray[j].payoutFrax)
                    if (obj.depositCountFrax != 0) {
                        obj.amountFraxAvg =
                            obj.amountFrax / obj.depositCountFrax
                    }
                }
            }
            for (let j = 0; j < lusdArray.length; ++j) {
                if (
                    beginTimestamp <= lusdArray[j].timestamp &&
                    lusdArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVLusd = lusdArray[j].initBCV
                    obj.newBCVLusd = lusdArray[j].newBCV
                    obj.adjustmentLusd = lusdArray[j].adjustment

                    obj.amountLusd += Number(lusdArray[j].amountLusd)
                    obj.depositCountLusd += Number(
                        lusdArray[j].depositCountLusd
                    )
                    obj.redeemCountLusd += Number(lusdArray[j].redeemCountLusd)
                    obj.payoutLusd += Number(lusdArray[j].payoutLusd)
                    if (obj.depositCountLusd != 0) {
                        obj.amountLusdAvg =
                            obj.amountLusd / obj.depositCountLusd
                    }
                }
            }
            for (let j = 0; j < ohmDaiArray.length; ++j) {
                if (
                    beginTimestamp <= ohmDaiArray[j].timestamp &&
                    ohmDaiArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVOhmDai = ohmDaiArray[j].initBCV
                    obj.newBCVOhmDai = ohmDaiArray[j].newBCV
                    obj.adjustmentOhmDai = ohmDaiArray[j].adjustment

                    obj.amountOhmDai += Number(ohmDaiArray[j].amountOhmDai)
                    obj.depositCountOhmDai += Number(
                        ohmDaiArray[j].depositCountOhmDai
                    )
                    obj.redeemCountOhmDai += Number(
                        ohmDaiArray[j].redeemCountOhmDai
                    )
                    obj.payoutOhmDai += Number(ohmDaiArray[j].payoutOhmDai)
                    if (obj.depositCountOhmDai != 0) {
                        obj.amountOhmDaiAvg =
                            obj.amountOhmDai / obj.depositCountOhmDai
                    }
                }
            }
            for (let j = 0; j < ohmFraxArray.length; ++j) {
                if (
                    beginTimestamp <= ohmFraxArray[j].timestamp &&
                    ohmFraxArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVOhmFrax = ohmFraxArray[j].initBCV
                    obj.newBCVOhmFrax = ohmFraxArray[j].newBCV
                    obj.adjustmentOhmFrax = ohmFraxArray[j].adjustment

                    obj.amountOhmFrax += Number(ohmFraxArray[j].amountOhmFrax)
                    obj.depositCountOhmFrax += Number(
                        ohmFraxArray[j].depositCountOhmFrax
                    )
                    obj.redeemCountOhmFrax += Number(
                        ohmFraxArray[j].redeemCountOhmFrax
                    )
                    obj.payoutOhmFrax += Number(ohmFraxArray[j].payoutOhmFrax)
                    if (obj.depositCountOhmFrax != 0) {
                        obj.amountOhmFraxAvg =
                            obj.amountOhmFrax / obj.depositCountOhmFrax
                    }
                }
            }
            for (let j = 0; j < ohmLusdArray.length; ++j) {
                if (
                    beginTimestamp <= ohmLusdArray[j].timestamp &&
                    ohmLusdArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVOhmLusd = ohmLusdArray[j].initBCV
                    obj.newBCVOhmLusd = ohmLusdArray[j].newBCV
                    obj.adjustmentOhmLusd = ohmLusdArray[j].adjustment

                    obj.amountOhmLusd += Number(ohmLusdArray[j].amountOhmLusd)
                    obj.depositCountOhmLusd += Number(
                        ohmLusdArray[j].depositCountOhmLusd
                    )
                    obj.redeemCountOhmLusd += Number(
                        ohmLusdArray[j].redeemCountOhmLusd
                    )
                    obj.payoutOhmLusd += Number(ohmLusdArray[j].payoutOhmLusd)
                    if (obj.depositCountOhmLusd != 0) {
                        obj.amountOhmLusdAvg =
                            obj.amountOhmLusd / obj.depositCountOhmLusd
                    }
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
    * @param startTimestamp - Start timestamp for query 
    * @param endTime - End timestamp for query

*/
export async function getBondsInfoNMinutes(startTimestamp, endTime, minutes) {
    let depositQueryDai = `
    {
        depositYearDaiEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"DAI"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
                }
              
            }
          }
        }
      }
    
    `
    let depositQueryEth = `
    {
        depositYearETHEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"WETH"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
                }
              
            }
          }
        }
      }
    
    `
    let depositQueryFrax = `
    {
        depositYearFraxEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"FRAX"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
                }
              
            }
          }
        }
      }
    `
    let depositQueryLusd = `
    {
        depositYearLusdEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"LUSD"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
                }
              
            }
          }
        }
      }
    `

    let depositQueryOhmDai = `
    {
        depositYearOHMDAIEntities:depositYearEntities(first: 100 orderBy:timestamp where:{token:"OHM-DAI"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
                }
              
            }
          }
        }
      }
    `

    let depositQueryOhmFrax = `
    {
        depositYearOHMFRAXEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"OHM-FRAX"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
                }
              
            }
          }
        }
      }
    `

    let depositQueryOhmLusd = `
    {
        depositYearOHMLUSDEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"OHM-LUSD"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
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
        const depositDataOhmLusd = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
                query: depositQueryOhmLusd,
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
        const ohmLusdDeposits =
            depositDataOhmLusd.data.data.depositYearOHMLUSDEntities
        let data = []

        let daiArray = []
        let ethArray = []
        let fraxArray = []
        let lusdArray = []
        let ohmDaiArray = []
        let ohmFraxArray = []
        let ohmLusdArray = []
        if (daiDeposits.length != 0) {
            for (let c = 0; c < daiDeposits.length; ++c) {
                for (let i = 0; i < daiDeposits[c].dayDeposit.length; ++i) {
                    for (
                        let j = 0;
                        j < daiDeposits[c].dayDeposit[i].hourDeposit.length;
                        ++j
                    ) {
                        for (
                            let k = 0;
                            k <
                            daiDeposits[c].dayDeposit[i].hourDeposit[j]
                                .minuteDeposit.length;
                            ++k
                        ) {
                            let obj = {}
                            obj.initBCV =
                                daiDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].initBCV
                            obj.newBCV =
                                daiDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].newBCV
                            obj.adjustment =
                                daiDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].adjustment
                            obj.amountDai =
                                daiDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].amount
                            obj.depositCountDai =
                                daiDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].depositCount
                            obj.redeemCountDai =
                                daiDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].redeemCount
                            obj.payoutDai =
                                daiDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].payout
                            obj.timestamp =
                                daiDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].timestamp
                            daiArray.push(obj)
                        }
                    }
                }
            }
        }

        if (ethDeposits.length != 0) {
            for (let c = 0; c < ethDeposits.length; ++c) {
                for (let i = 0; i < ethDeposits[c].dayDeposit.length; ++i) {
                    for (
                        let j = 0;
                        j < ethDeposits[c].dayDeposit[i].hourDeposit.length;
                        ++j
                    ) {
                        for (
                            let k = 0;
                            k <
                            ethDeposits[c].dayDeposit[i].hourDeposit[j]
                                .minuteDeposit.length;
                            ++k
                        ) {
                            let obj = {}
                            obj.initBCV =
                                ethDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].initBCV
                            obj.newBCV =
                                ethDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].newBCV
                            obj.adjustment =
                                ethDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].adjustment

                            obj.amountEth =
                                ethDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].amount
                            obj.depositCountEth =
                                ethDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].depositCount
                            obj.redeemCountEth =
                                ethDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].redeemCount
                            obj.payoutEth =
                                ethDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].payout
                            obj.timestamp =
                                ethDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].timestamp
                            ethArray.push(obj)
                        }
                    }
                }
            }
        }

        if (fraxDeposits.length != 0) {
            for (let c = 0; c < fraxDeposits.length; ++c) {
                for (let i = 0; i < fraxDeposits[c].dayDeposit.length; ++i) {
                    for (
                        let j = 0;
                        j < fraxDeposits[c].dayDeposit[i].hourDeposit.length;
                        ++j
                    ) {
                        for (
                            let k = 0;
                            k <
                            fraxDeposits[c].dayDeposit[i].hourDeposit[j]
                                .minuteDeposit.length;
                            ++k
                        ) {
                            let obj = {}
                            obj.initBCV =
                                fraxDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].initBCV
                            obj.newBCV =
                                fraxDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].newBCV
                            obj.adjustment =
                                fraxDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].adjustment

                            obj.amountFrax =
                                fraxDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].amount
                            obj.depositCountFrax =
                                fraxDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].depositCount
                            obj.redeemCountFrax =
                                fraxDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].redeemCount
                            obj.payoutFrax =
                                fraxDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].payout
                            obj.timestamp =
                                fraxDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].timestamp
                            fraxArray.push(obj)
                        }
                    }
                }
            }
        }

        if (lusdDeposits.length != 0) {
            for (let c = 0; c < lusdDeposits.length; ++c) {
                for (let i = 0; i < lusdDeposits[c].dayDeposit.length; ++i) {
                    for (
                        let j = 0;
                        j < lusdDeposits[c].dayDeposit[i].hourDeposit.length;
                        ++j
                    ) {
                        for (
                            let k = 0;
                            k <
                            lusdDeposits[c].dayDeposit[i].hourDeposit[j]
                                .minuteDeposit.length;
                            ++k
                        ) {
                            let obj = {}
                            obj.initBCV =
                                lusdDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].initBCV
                            obj.newBCV =
                                lusdDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].newBCV
                            obj.adjustment =
                                lusdDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].adjustment

                            obj.amountLusd =
                                lusdDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].amount
                            obj.depositCountLusd =
                                lusdDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].depositCount
                            obj.redeemCountLusd =
                                lusdDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].redeemCount
                            obj.payoutLusd =
                                lusdDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].payout
                            obj.timestamp =
                                lusdDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].timestamp
                            lusdArray.push(obj)
                        }
                    }
                }
            }
        }

        if (ohmDaiDeposits.length != 0) {
            for (let c = 0; c < ohmDaiDeposits.length; ++c) {
                for (let i = 0; i < ohmDaiDeposits[c].dayDeposit.length; ++i) {
                    for (
                        let j = 0;
                        j < ohmDaiDeposits[c].dayDeposit[i].hourDeposit.length;
                        ++j
                    ) {
                        for (
                            let k = 0;
                            k <
                            ohmDaiDeposits[c].dayDeposit[i].hourDeposit[j]
                                .minuteDeposit.length;
                            ++k
                        ) {
                            let obj = {}
                            obj.initBCV =
                                ohmDaiDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].initBCV
                            obj.newBCV =
                                ohmDaiDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].newBCV
                            obj.adjustment =
                                ohmDaiDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].adjustment

                            obj.amountOhmDai =
                                ohmDaiDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].amount
                            obj.depositCountOhmDai =
                                ohmDaiDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].depositCount
                            obj.redeemCountOhmDai =
                                ohmDaiDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].redeemCount
                            obj.payoutOhmDai =
                                ohmDaiDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].payout
                            obj.timestamp =
                                ohmDaiDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].timestamp
                            ohmDaiArray.push(obj)
                        }
                    }
                }
            }
        }

        if (ohmFraxDeposits.length != 0) {
            for (let c = 0; c < ohmFraxDeposits.length; ++c) {
                for (let i = 0; i < ohmFraxDeposits[c].dayDeposit.length; ++i) {
                    for (
                        let j = 0;
                        j < ohmFraxDeposits[c].dayDeposit[i].hourDeposit.length;
                        ++j
                    ) {
                        for (
                            let k = 0;
                            k <
                            ohmFraxDeposits[c].dayDeposit[i].hourDeposit[j]
                                .minuteDeposit.length;
                            ++k
                        ) {
                            let obj = {}
                            obj.initBCV =
                                ohmFraxDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].initBCV
                            obj.newBCV =
                                ohmFraxDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].newBCV
                            obj.adjustment =
                                ohmFraxDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].adjustment

                            obj.amountOhmFrax =
                                ohmFraxDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].amount
                            obj.depositCountOhmFrax =
                                ohmFraxDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].depositCount
                            obj.redeemCountOhmFrax =
                                ohmFraxDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].redeemCount
                            obj.payoutOhmFrax =
                                ohmFraxDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].payout
                            obj.timestamp =
                                ohmFraxDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].timestamp
                            ohmFraxArray.push(obj)
                        }
                    }
                }
            }
        }
        if (ohmLusdDeposits.length != 0) {
            for (let c = 0; c < ohmLusdDeposits.length; ++c) {
                for (let i = 0; i < ohmLusdDeposits[c].dayDeposit.length; ++i) {
                    for (
                        let j = 0;
                        j < ohmLusdDeposits[c].dayDeposit[i].hourDeposit.length;
                        ++j
                    ) {
                        for (
                            let k = 0;
                            k <
                            ohmLusdDeposits[c].dayDeposit[i].hourDeposit[j]
                                .minuteDeposit.length;
                            ++k
                        ) {
                            let obj = {}
                            obj.initBCV =
                                ohmLusdDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].initBCV
                            obj.newBCV =
                                ohmLusdDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].newBCV
                            obj.adjustment =
                                ohmLusdDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].adjustment

                            obj.amountOhmLusd =
                                ohmLusdDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].amount
                            obj.depositCountOhmLusd =
                                ohmLusdDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].depositCount
                            obj.redeemCountOhmLusd =
                                ohmLusdDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].redeemCount
                            obj.payoutOhmLusd =
                                ohmLusdDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].payout
                            obj.timestamp =
                                ohmLusdDeposits[c].dayDeposit[i].hourDeposit[
                                    j
                                ].minuteDeposit[k].timestamp
                            ohmLusdArray.push(obj)
                        }
                    }
                }
            }
        }
        // let beginTimestamp = startTimestamp
        // let endTimestamp = startTimestamp + 60

        for (
            let beginTimestamp = startTimestamp,
                endTimestamp = startTimestamp + minutes * 60;
            beginTimestamp < endTime;
            beginTimestamp += minutes * 60, endTimestamp += minutes * 60
        ) {
            let obj = {
                amountDai: 0,
                amountEth: 0,
                amountFrax: 0,
                amountLusd: 0,
                amountOhmDai: 0,
                amountOhmFrax: 0,
                amountOhmLusd: 0,
                amountDaiAvg: 0,
                amountEthAvg: 0,
                amountLusdAvg: 0,
                amountFraxAvg: 0,
                amountOhmDaiAvg: 0,
                amountOhmFraxAvg: 0,
                amountOhmLusdAvg: 0,
                payoutDai: 0,
                payoutEth: 0,
                payoutFrax: 0,
                payoutLusd: 0,
                payoutOhmDai: 0,
                payoutOhmFrax: 0,
                payoutOhmLusd: 0,
                depositCountDai: 0,
                depositCountEth: 0,
                depositCountLusd: 0,
                depositCountFrax: 0,
                depositCountOhmDai: 0,
                depositCountOhmFrax: 0,
                depositCountOhmLusd: 0,
                redeemCountDai: 0,
                redeemCountLusd: 0,
                redeemCountEth: 0,
                redeemCountFrax: 0,
                redeemCountOhmDai: 0,
                redeemCountOhmFrax: 0,
                redeemCountOhmLusd: 0,
                initBCVDai: 0,
                newBCVDai: 0,
                adjustmentDai: 0,
                initBCVEth: 0,
                newBCVEth: 0,
                adjustmentEth: 0,
                initBCVFrax: 0,
                newBCVFrax: 0,
                adjustmentFrax: 0,
                initBCVLusd: 0,
                newBCVLusd: 0,
                adjustmentLusd: 0,
                initBCVOhmDai: 0,
                newBCVOhmDai: 0,
                adjustmentOhmDai: 0,
                initBCVOhmFrax: 0,
                newBCVOhmFrax: 0,
                adjustmentOhmFrax: 0,
                initBCVOhmLusd: 0,
                newBCVOhmLusd: 0,
                adjustmentOhmLusd: 0,
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp,
            }
            for (let j = 0; j < daiArray.length; ++j) {
                if (
                    beginTimestamp <= daiArray[j].timestamp &&
                    daiArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVDai = daiArray[j].initBCV
                    obj.newBCVDai = daiArray[j].newBCV
                    obj.adjustmentDai = daiArray[j].adjustment
                    obj.amountDai += Number(daiArray[j].amountDai)
                    obj.depositCountDai += Number(daiArray[j].depositCountDai)
                    obj.redeemCountDai += Number(daiArray[j].redeemCountDai)
                    obj.payoutDai += Number(daiArray[j].payoutDai)
                    if (obj.depositCountDai != 0) {
                        obj.amountDaiAvg = obj.amountDai / obj.depositCountDai
                    }
                }
            }
            for (let j = 0; j < ethArray.length; ++j) {
                if (
                    beginTimestamp <= ethArray[j].timestamp &&
                    ethArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVEth = ethArray[j].initBCV
                    obj.newBCVEth = ethArray[j].newBCV
                    obj.adjustmentEth = ethArray[j].adjustment

                    obj.amountEth += Number(ethArray[j].amountEth)
                    obj.depositCountEth += Number(ethArray[j].depositCountEth)
                    obj.redeemCountEth += Number(ethArray[j].redeemCountEth)
                    obj.payoutEth += Number(ethArray[j].payoutEth)
                    if (obj.depositCountEth != 0) {
                        obj.amountEthAvg = obj.amountEth / obj.depositCountEth
                    }
                }
            }
            for (let j = 0; j < fraxArray.length; ++j) {
                if (
                    beginTimestamp <= fraxArray[j].timestamp &&
                    fraxArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVFrax = fraxArray[j].initBCV
                    obj.newBCVFrax = fraxArray[j].newBCV
                    obj.adjustmentFrax = fraxArray[j].adjustment

                    obj.amountFrax += Number(fraxArray[j].amountFrax)
                    obj.depositCountFrax += Number(
                        fraxArray[j].depositCountFrax
                    )
                    obj.redeemCountFrax += Number(fraxArray[j].redeemCountFrax)
                    obj.payoutFrax += Number(fraxArray[j].payoutFrax)
                    if (obj.depositCountFrax != 0) {
                        obj.amountFraxAvg =
                            obj.amountFrax / obj.depositCountFrax
                    }
                }
            }
            for (let j = 0; j < lusdArray.length; ++j) {
                if (
                    beginTimestamp <= lusdArray[j].timestamp &&
                    lusdArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVLusd = lusdArray[j].initBCV
                    obj.newBCVLusd = lusdArray[j].newBCV
                    obj.adjustmentLusd = lusdArray[j].adjustment

                    obj.amountLusd += Number(lusdArray[j].amountLusd)
                    obj.depositCountLusd += Number(
                        lusdArray[j].depositCountLusd
                    )
                    obj.redeemCountLusd += Number(lusdArray[j].redeemCountLusd)
                    obj.payoutLusd += Number(lusdArray[j].payoutLusd)
                    if (obj.depositCountLusd != 0) {
                        obj.amountLusdAvg =
                            obj.amountLusd / obj.depositCountLusd
                    }
                }
            }
            for (let j = 0; j < ohmDaiArray.length; ++j) {
                if (
                    beginTimestamp <= ohmDaiArray[j].timestamp &&
                    ohmDaiArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVOhmDai = ohmDaiArray[j].initBCV
                    obj.newBCVOhmDai = ohmDaiArray[j].newBCV
                    obj.adjustmentOhmDai = ohmDaiArray[j].adjustment

                    obj.amountOhmDai += Number(ohmDaiArray[j].amountOhmDai)
                    obj.depositCountOhmDai += Number(
                        ohmDaiArray[j].depositCountOhmDai
                    )
                    obj.redeemCountOhmDai += Number(
                        ohmDaiArray[j].redeemCountOhmDai
                    )
                    obj.payoutOhmDai += Number(ohmDaiArray[j].payoutOhmDai)
                    if (obj.depositCountOhmDai != 0) {
                        obj.amountOhmDaiAvg =
                            obj.amountOhmDai / obj.depositCountOhmDai
                    }
                }
            }
            for (let j = 0; j < ohmFraxArray.length; ++j) {
                if (
                    beginTimestamp <= ohmFraxArray[j].timestamp &&
                    ohmFraxArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVOhmFrax = ohmFraxArray[j].initBCV
                    obj.newBCVOhmFrax = ohmFraxArray[j].newBCV
                    obj.adjustmentOhmFrax = ohmFraxArray[j].adjustment

                    obj.amountOhmFrax += Number(ohmFraxArray[j].amountOhmFrax)
                    obj.depositCountOhmFrax += Number(
                        ohmFraxArray[j].depositCountOhmFrax
                    )
                    obj.redeemCountOhmFrax += Number(
                        ohmFraxArray[j].redeemCountOhmFrax
                    )
                    obj.payoutOhmFrax += Number(ohmFraxArray[j].payoutOhmFrax)
                    if (obj.depositCountOhmFrax != 0) {
                        obj.amountOhmFraxAvg =
                            obj.amountOhmFrax / obj.depositCountOhmFrax
                    }
                }
            }
            for (let j = 0; j < ohmLusdArray.length; ++j) {
                if (
                    beginTimestamp <= ohmLusdArray[j].timestamp &&
                    ohmLusdArray[j].timestamp < endTimestamp
                ) {
                    obj.initBCVOhmLusd = ohmLusdArray[j].initBCV
                    obj.newBCVOhmLusd = ohmLusdArray[j].newBCV
                    obj.adjustmentOhmLusd = ohmLusdArray[j].adjustment

                    obj.amountOhmLusd += Number(ohmLusdArray[j].amountOhmLusd)
                    obj.depositCountOhmLusd += Number(
                        ohmLusdArray[j].depositCountOhmLusd
                    )
                    obj.redeemCountOhmLusd += Number(
                        ohmLusdArray[j].redeemCountOhmLusd
                    )
                    obj.payoutOhmLusd += Number(ohmLusdArray[j].payoutOhmLusd)
                    if (obj.depositCountOhmLusd != 0) {
                        obj.amountOhmLusdAvg =
                            obj.amountOhmLusd / obj.depositCountOhmLusd
                    }
                }
            }
            data.push(obj)
        }
        return data
    } catch (err) {
        console.log(err)
    }
}

export function mapBonds(bonds) {
    return bonds.reduce(
        (acc, e) => {
            const time = parseInt(e.beginTimestamp)

            // amounts
            acc.amountDai.push(new TVValueTimeObject(Number(e.amountDai), time))
            acc.amountEth.push(new TVValueTimeObject(Number(e.amountEth), time))
            acc.amountFrax.push(
                new TVValueTimeObject(Number(e.amountFrax), time)
            )
            acc.amountLusd.push(
                new TVValueTimeObject(Number(e.amountLusd), time)
            )
            acc.amountOhmDai.push(
                new TVValueTimeObject(Number(e.amountOhmDai), time)
            )
            acc.amountOhmFrax.push(
                new TVValueTimeObject(Number(e.amountOhmFrax), time)
            )
            acc.amountOhmLusd.push(
                new TVValueTimeObject(Number(e.amountOhmLusd), time)
            )

            // count
            acc.depositCountDai.push(
                new TVValueTimeObject(Number(e.depositCountDai), time)
            )
            acc.depositCountEth.push(
                new TVValueTimeObject(Number(e.depositCountEth), time)
            )
            acc.depositCountFrax.push(
                new TVValueTimeObject(Number(e.depositCountFrax), time)
            )
            acc.depositCountLusd.push(
                new TVValueTimeObject(Number(e.depositCountLusd), time)
            )
            acc.depositCountOhmDai.push(
                new TVValueTimeObject(Number(e.depositCountOhmDai), time)
            )
            acc.depositCountOhmFrax.push(
                new TVValueTimeObject(Number(e.depositCountOhmFrax), time)
            )
            acc.depositCountOhmLusd.push(
                new TVValueTimeObject(Number(e.depositCountOhmLusd), time)
            )

            // bcv
            acc.newBCVDai.push(
                new TVValueTimeObject(Number(e.newBCVDai) * 10 ** 7, time)
            )
            acc.newBCVEth.push(
                new TVValueTimeObject(Number(e.newBCVEth) * 10 ** 7, time)
            )
            acc.newBCVFrax.push(
                new TVValueTimeObject(Number(e.newBCVFrax) * 10 ** 7, time)
            )
            acc.newBCVLusd.push(
                new TVValueTimeObject(Number(e.newBCVLusd) * 10 ** 7, time)
            )
            acc.newBCVOhmDai.push(
                new TVValueTimeObject(Number(e.newBCVOhmDai) * 10 ** 7, time)
            )
            acc.newBCVOhmFrax.push(
                new TVValueTimeObject(Number(e.newBCVOhmFrax) * 10 ** 7, time)
            )
            acc.newBCVOhmLusd.push(
                new TVValueTimeObject(Number(e.newBCVOhmLusd) * 10 ** 7, time)
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
            amountOhmLusd: [],
            depositCountDai: [],
            depositCountEth: [],
            depositCountFrax: [],
            depositCountLusd: [],
            depositCountOhmDai: [],
            depositCountOhmFrax: [],
            depositCountOhmLusd: [],
            newBCVDai: [],
            newBCVEth: [],
            newBCVFrax: [],
            newBCVLusd: [],
            newBCVOhmDai: [],
            newBCVOhmFrax: [],
            newBCVOhmLusd: [],
        }
    )
}

export function getBondsInfoFunction(timeframe) {
    switch (timeframe) {
        case 0:
            return (...rest) => getBondsInfoDays(...rest, 7)
        case 1:
            return (...rest) => getBondsInfoDays(...rest, 1)
        case 2:
            return (...rest) => getBondsInfoNHours(...rest, 8)
        case 3:
            return (...rest) => getBondsInfoNHours(...rest, 4)
        case 4:
            return (...rest) => getBondsInfoNHours(...rest, 1)
        case 5:
            return (...rest) => getBondsInfoNMinutes(...rest, 15)
        case 6:
            return (...rest) => getBondsInfoNMinutes(...rest, 5)
        case 7:
            return (...rest) => getBondsInfoNMinutes(...rest, 1)
        default:
            return
    }
}
