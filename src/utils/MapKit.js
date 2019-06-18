import axios from 'axios'

const http = axios.create({
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  },
  timeout: 180000
})

const ak = '2oWExwugTqH1ISdLCtTIHpSFrxifDcGo'

const geocoder = 'http://api.map.baidu.com/geocoder/v2/'
export default {
  getPointByAddress(address, city) {
    if (!address) throw Error('address must be require')
    let p = {
      address, ak,
      output: 'json'
    }
    if (city) p.city = city
    return http.get(geocoder, {
      params: p
    })
  }
}
