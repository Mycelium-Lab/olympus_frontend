import axios from 'axios'
import moment from 'moment'

export async function getStakesInfoDays(startTimestamp, days) {
    let stakeQuery = `

    {
        stakeYears(first: 100 orderBy:timestamp) {
      
          dayStake(first: 365 orderBy:timestamp) {
      
            id
            amountStaked
            amountUnstaked
            currentStaked
            timestamp
            stakeCount
            unstakeCount
          }
        }
      }
    `

    try {
        const stakeData = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
                query: stakeQuery,
            },
        })
        const stakesData = stakeData.data.data.stakeYears
        let data = []
        let stakes = []
        for (let i = 0; i < stakesData[0].dayStake.length; ++i) {
            let obj = {}
            obj.stakeCount = stakesData[0].dayStake[i].stakeCount
            obj.unstakeCount = stakesData[0].dayStake[i].unstakeCount
            obj.amountStaked = stakesData[0].dayStake[i].amountStaked
            obj.amountUnstaked = stakesData[0].dayStake[i].amountUnstaked
            obj.timestamp = stakesData[0].dayStake[i].timestamp
            obj.currentStaked = stakesData[0].dayStake[i].currentStaked
            stakes.push(obj)
        }
        for (let i = 0; i < days - 1; ++i) {
            let beginTimestamp = startTimestamp + i * 86400
            let endTimestamp = startTimestamp + (i + 1) * 86400

            let obj = {
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp,
                stakeCount: 0,
                unstakeCount: 0,
                amountStaked: 0,
                amountUnstaked: 0,
                currentStaked: 0,
                unstakedToStakedPercent: 0,
                unstakedToTotalStakedPercent: 0,
            }
            for (let j = 0; j < stakes.length; ++j) {
                if (
                    beginTimestamp <= stakes[j].timestamp &&
                    stakes[j].timestamp < endTimestamp
                ) {
                    obj.stakeCount = stakes[j].stakeCount
                    obj.unstakeCount = stakes[j].unstakeCount
                    obj.amountStaked = stakes[j].amountStaked
                    obj.amountUnstaked = stakes[j].amountUnstaked
                    obj.currentStaked = stakes[j].currentStaked
                    obj.unstakedToStakedPercent =
                        100 *
                        (stakes[j].amountUnstaked / stakes[j].amountStaked)
                    obj.unstakedToTotalStakedPercent =
                        100 *
                        (stakes[j].amountUnstaked / stakes[j].currentStaked)
                }
            }
            data.push(obj)
        }
        return data
    } catch (err) {
        console.log(err)
    }
}

export async function getStakesInfoHour(startTimestamp, days) {
    let stakeQuery = `

  {
      stakeYears(first: 100 orderBy:timestamp) {
    
        dayStake(first: 365 orderBy:timestamp) {
          hourStake(first: 24, orderBy:timestamp)
          {
            id
            amountStaked
            amountUnstaked
            currentStaked
            timestamp
            stakeCount
            unstakeCount
          }
          
        }
      }
    }
  `

    try {
        const stakeData = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
                query: stakeQuery,
            },
        })
        const stakesData = stakeData.data.data.stakeYears
        let data = []
        let stakes = []
        for (let i = 0; i < stakesData[0].dayStake.length; ++i) {
            for (
                let j = 0;
                j < stakesData[0].dayStake[i].hourStake.length;
                ++j
            ) {
                let obj = {}
                obj.stakeCount =
                    stakesData[0].dayStake[i].hourStake[j].stakeCount
                obj.unstakeCount =
                    stakesData[0].dayStake[i].hourStake[j].unstakeCount
                obj.amountStaked =
                    stakesData[0].dayStake[i].hourStake[j].amountStaked
                obj.amountUnstaked =
                    stakesData[0].dayStake[i].hourStake[j].amountUnstaked
                obj.timestamp = stakesData[0].dayStake[i].hourStake[j].timestamp
                obj.currentStaked =
                    stakesData[0].dayStake[i].hourStake[j].currentStaked
                stakes.push(obj)
            }
        }
        for (let i = 0; i < 24 * days; ++i) {
            let beginTimestamp = startTimestamp + i * 3600
            let endTimestamp = startTimestamp + (i + 1) * 3600

            let obj = {
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp,
                stakeCount: 0,
                unstakeCount: 0,
                amountStaked: 0,
                amountUnstaked: 0,
                currentStaked: 0,
                unstakedToStakedPercent: 0,
                unstakedToTotalStakedPercent: 0,
            }
            for (let j = 0; j < stakes.length; ++j) {
                if (
                    beginTimestamp <= stakes[j].timestamp &&
                    stakes[j].timestamp < endTimestamp
                ) {
                    obj.stakeCount = stakes[j].stakeCount
                    obj.unstakeCount = stakes[j].unstakeCount
                    obj.amountStaked = stakes[j].amountStaked
                    obj.amountUnstaked = stakes[j].amountUnstaked
                    obj.currentStaked = stakes[j].currentStaked
                    obj.unstakedToStakedPercent =
                        (100 *
                            (stakes[j].amountUnstaked -
                                stakes[j].amountStaked)) /
                        stakes[j].amountStaked
                    obj.unstakedToTotalStakedPercent =
                        (100 *
                            (stakes[j].amountUnstaked -
                                stakes[j].currentStaked)) /
                        stakes[j].currentStaked
                }
            }
            data.push(obj)
        }
        return data
    } catch (err) {
        console.log(err)
    }
}

export async function getStakesInfoMinute(startTimestamp, days) {
    let stakeQuery = `

  {
      stakeYears(first: 100 orderBy:timestamp) {
    
        dayStake(first: 365 orderBy:timestamp) {
          hourStake(first: 24, orderBy:timestamp)
          {
            minuteStake(first:60 orderBy:timestamp)
            {
              id
              amountStaked
              amountUnstaked
              currentStaked
              timestamp
              stakeCount
              unstakeCount
            }
          }
          
        }
      }
    }
  `

    try {
        const stakeData = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
                query: stakeQuery,
            },
        })
        const stakesData = stakeData.data.data.stakeYears
        let data = []
        let stakes = []
        for (let i = 0; i < stakesData[0].dayStake.length; ++i) {
            for (
                let j = 0;
                j < stakesData[0].dayStake[i].hourStake.length;
                ++j
            ) {
                for (
                    let c = 0;
                    c <
                    stakesData[0].dayStake[i].hourStake[j].minuteStake.length;
                    ++c
                ) {
                    let obj = {}
                    obj.stakeCount =
                        stakesData[0].dayStake[i].hourStake[j].minuteStake[
                            c
                        ].stakeCount
                    obj.unstakeCount =
                        stakesData[0].dayStake[i].hourStake[j].minuteStake[
                            c
                        ].unstakeCount
                    obj.amountStaked =
                        stakesData[0].dayStake[i].hourStake[j].minuteStake[
                            c
                        ].amountStaked
                    obj.amountUnstaked =
                        stakesData[0].dayStake[i].hourStake[j].minuteStake[
                            c
                        ].amountUnstaked
                    obj.timestamp =
                        stakesData[0].dayStake[i].hourStake[j].minuteStake[
                            c
                        ].timestamp
                    obj.currentStaked =
                        stakesData[0].dayStake[i].hourStake[j].minuteStake[
                            c
                        ].currentStaked
                    stakes.push(obj)
                }
            }
        }
        for (let i = 0; i < 60 * 24 * days; ++i) {
            let beginTimestamp = startTimestamp + i * 60
            let endTimestamp = startTimestamp + (i + 1) * 60
            let obj = {
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp,
                stakeCount: 0,
                unstakeCount: 0,
                amountStaked: 0,
                amountUnstaked: 0,
                currentStaked: 0,
                unstakedToStakedPercent: 0,
                unstakedToTotalStakedPercent: 0,
            }
            for (let j = 0; j < stakes.length; ++j) {
                if (
                    beginTimestamp <= stakes[j].timestamp &&
                    stakes[j].timestamp < endTimestamp
                ) {
                    obj.stakeCount = stakes[j].stakeCount
                    obj.unstakeCount = stakes[j].unstakeCount
                    obj.amountStaked = stakes[j].amountStaked
                    obj.amountUnstaked = stakes[j].amountUnstaked
                    obj.currentStaked = stakes[j].currentStaked
                    obj.unstakedToStakedPercent =
                        100 *
                        (stakes[j].amountUnstaked / stakes[j].amountStaked)
                    obj.unstakedToTotalStakedPercent =
                        100 *
                        (stakes[j].amountUnstaked / stakes[j].currentStaked)
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

export async function mapStakes(stakes) {
    return stakes.reduce(
        (acc, e) => {
            const time = moment
                .unix(parseInt(e.beginTimestamp))
                .format('YYYY-MM-DD')
            acc.staked.push(new TVTimeValueObject(Number(e.amountStaked), time))
            acc.unstaked.push(
                new TVTimeValueObject(-Number(e.amountUnstaked), time)
            )
            acc.currentStaked.push(
                new TVTimeValueObject(Number(e.currentStaked), time)
            )
            acc.unstakedToStakedPercent.push(
                new TVTimeValueObject(Number(e.unstakedToStakedPercent), time)
            )
            acc.unstakedToTotalStakedPercent.push(
                new TVTimeValueObject(
                    Number(e.unstakedToTotalStakedPercent),
                    time
                )
            )
            acc.stakeCount.push(
                new TVTimeValueObject(Number(e.stakeCount), time)
            )
            acc.unstakeCount.push(
                new TVTimeValueObject(Number(e.unstakeCount), time)
            )
            return acc
        },
        {
            staked: [],
            unstaked: [],
            currentStaked: [],
            unstakedToStakedPercent: [],
            unstakedToTotalStakedPercent: [],
            stakeCount: [],
            unstakeCount: [],
        }
    )
}
