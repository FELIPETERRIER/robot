const webSocket = require('ws');
const ws = new webSocket(`${process.env.STREAM_URL}/${process.env.SYMBOL.toLowerCase()}@ticker`);
const PROFITABILITY =parseFloat(process.env.PROFITABILITY);
let sellPrice = 0


ws.onmessage = (e)  =>{
    //ioioioi
    console.clear();
    const obj = JSON.parse(e.data)
    console.log('Symbol:'+ obj.s);
    console.log('preco de venda:' +  obj.a);
    //logica
    const currentPrice = parseFloat(obj.a);
    if(sellPrice === 0 && currentPrice < 97963.11000000){
        console.log('bom para comprar')

        newOrder("0.001","BUY")
        sellPrice = currentPrice * PROFITABILITY
    }else if(sellPrice !== 0 && currentPrice >= sellPrice){
        console.log('bom para vender')
        newOrder("0.001","SELL")
        sellPrice = 0;

    }else
        console.log('esperando....'+ sellPrice)
} 

const axios = require('axios');
const crypto = require('crypto');

async function newOrder(quatify,side) {
        const data = {
            symbol: process.env.SYMBOL,
            type: ' MARKET',
            side,
            quatify,
        };

    const timestamp = Date.now();
    console.log(timestamp)
    const recvWindow = 60000;

    const signature  = crypto.createHmac('sha256',process.env.SECRET_KEY)
    .update(`${new URLSearchParams({...data,timestamp,recvWindow})}}`)
    .digest('hex');
     

    const newData = {...data,timestamp,recvWindow,signature};
    const qs = `?${new URLSearchParams(newData)}`;

    try {
        const result = await axios({
            method: 'POST',
            url:`${process.env.API_URL}/v3/orde${qs}`,
            headers: {'X-MBX-APIKEY': process.env.API_KEY}
        })
        console.log(result.data)

        
    } catch (error) {
        console.error('error')
        
    }

    
}



