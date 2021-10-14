import axios from 'axios'
import { token } from '../config.js';
import {getWholePeriodOfTime} from '../utils/date.js'


const day =60*60*24;

const dayQuery =`
{
    yearRewardsMintedEntities(first:100 orderBy:timestamp){
      dayMint(first:365 orderBy:timestamp){
        timestamp
        amount
        recipient
        caller
      }
    }
  }
  `

export async function getMintRewardsByDays(){
    try{
        return fillBigArrayForDays(reformToBigArrayForDays(await getTotalReserveByDaysFromGraph()))
    }
    catch(err)
    {
        console.log(err)
    }
}


async function getTotalReserveByDaysFromGraph(){
    try{
        const dayData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
              query: dayQuery
            }
          })
        return dayData.data.data.yearRewardsMintedEntities;
    }
    catch(err)
    {
        console.log(err)
    }
}

/**
 * struct from subgrph reform to array
 * @param {} days struct from subgrph
 * @returns 
 */
function reformToBigArrayForDays(days){
    let out=[];
    for(let i=0; i<days.length; i++){
        for(let j=0; j<days[i].dayMint.length; j++){
            out.push(days[i].dayMint[j]);
        }
    }
    return out;
}

/**
 * fills the array and divides it into equal time intervals
 * @param {*} bigArray  
 * @returns 
 */
function fillBigArrayForDays(bigArray){
    let out = [];
   
    for(let i=1;i<bigArray.length;i++){
        let nextTimestamp=getWholePeriodOfTime(parseInt(bigArray[i].timestamp),day)
        let timestamp=getWholePeriodOfTime(parseInt(bigArray[i-1].timestamp),day)
        out.push({
            amount:bigArray[i-1].amount,
            timestamp:timestamp,
            recipient:bigArray[i-1].recipient,
            caller:bigArray[i-1].caller,
        });
        timestamp+=day;
        while(timestamp<nextTimestamp){
            out.push({
                amount:0,
                timestamp:timestamp,
                recipient:[],
                caller:[]
            });
            timestamp+=day;
        }
        
    }
    out.push({
        totalReverse:bigArray[bigArray.length-1].finalTotalReserves,
        timestamp:getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),day),
        audited:bigArray[bigArray.length-1].audited,
    })
    return out;
}
