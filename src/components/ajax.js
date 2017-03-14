// 公共ajax模块，使用axios插件，配置默认参数后供全站使用

import axios from 'axios'

var _ajax = axios.create({
    baseURL: '/api/front'
    ,timeout: 1000
    ,headers: {'X-Requested-With': 'foobar'}
});
export default _ajax