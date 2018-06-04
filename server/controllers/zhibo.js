// 跳过https证书验证
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

var https = require('https')
var axios = require('axios')

// 登录授权接口
module.exports = async (ctx, next) => {
    try {
        const url = 'https://120.55.23.46/json/zhibo/saishi.htm?device=iPhone%206s%20Plus&_only_care=3&version_code=4.6.7&os=iOS&UDID=caa6e30097c2067f4d67217f332486d19ce54a27&platform=ios&os_version=11.3.1&appname=zhibo8&_platform=ios&IDFA=EA95F362-3E46-4B71-BB16-E4E20F7A2C7B&pk=com.zhibo8.pro'

        const agent = new https.Agent({
            rejectUnauthorized: false
        })
        const res = await axios.get(url, { httpsAgent: agent })
        // const res = await axios.get(url)
        // console.log(res.data)
        ctx.body = res.data
    } catch (ex) {
        ctx.state.code = 400
        ctx.body = ''
    }
}
