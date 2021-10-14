import axios from 'axios'
import { token } from '../config.js';
import {getWholePeriodOfTime} from '../utils/date.js'
import {getTokens} from '../tokens/getTokens.js'

const day =60*60*24;

const dayQuery =`
{
    manageYearEntities(first:1000 orderBy:timestamp){
     dayManage(first:365 orderBy:timestamp){
       
        id
        amount
        timestamp
        sender
        sumAmount
       
     }
   }
}
  `

export async function getManageByDay(){
    try{
        let bigArray=await reformToBigArrayForDays(await getManageByDaysFromGraph());
        
        for(let i=0;i<bigArray.length;i++){
            bigArray[i].array=fillBigArrayForDays( bigArray[i].array);
        }
       
        return bigArray;
    }
    catch(err)
    {
        console.log(err)
    }
}


async function getManageByDaysFromGraph(){
    try{
        const dayData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
              query: dayQuery
            }
          })
        return dayData.data.data.manageYearEntities;
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
async function reformToBigArrayForDays(days){
    let out=[];
    let tokens=await getTokens();
    for(let i=0; i<tokens.length; i++){
        out.push({ 
            token:tokens[i],
            array:[]
        })
    }
    for(let i=0; i<days.length; i++){
        for(let j=0; j<days[i].dayManage.length; j++){
            for(let m=0;m<tokens.length;m++){
                if(days[i].dayManage[j].id.slice(0,42)==tokens[m]){
                    out[m].array.push(days[i].dayManage[j]);
                }
            }
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
    if(bigArray.length==0){
        return out;
    }
    if(bigArray.length==1){
        out.push({
            timestamp:bigArray[0].timestamp,
            amount:bigArray[0].amount,
            sender:bigArray[0].sender,
            sumAmount:bigArray[0].sumAmount,
        });
        return out;
    }
    for(let i=1;i<bigArray.length;i++){
        let timestamp=getWholePeriodOfTime(parseInt(bigArray[i-1].timestamp),day)
        let nextTimestamp=getWholePeriodOfTime(parseInt(bigArray[i].timestamp),day)
        out.push({
            timestamp:timestamp,
            amount:bigArray[i-1].amount,
            sender:bigArray[i-1].sender,
            sumAmount:bigArray[i-1].sumAmount,
        });
       
        timestamp+=day
        while(timestamp<nextTimestamp){
            out.push({
                timestamp:timestamp,
                amount:0,
                sender:[],
                sumAmount:bigArray[i-1].sumAmount,
            });
            timestamp+=day
        }       
    }
    
    out.push({
        timestamp:getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),day),
        amount:bigArray[bigArray.length-1].amount,
        sender:bigArray[bigArray.length-1].sender,
        sumAmount:bigArray[bigArray.length-1].sumAmount,
    })
    return out;
}
