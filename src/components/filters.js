// 公共filters

import Vue from 'vue'
import address from '../../config/address.config'

// 过滤器数组
var filters=[
    // 日期转换成 xxxx年xx月xx日 12:12 格式
    {
        name:'dateTransform'
        ,fn:function(val){
                var _date=new Date(val)
                var _year=_date.getFullYear(),
                _month=_date.getMonth()+1,
                _day=_date.getDate(),
                _hour=_date.getHours(),
                _minute=_date.getMinutes()
                function addZero(target){
                    if (target<10){
                        target='0'+target
                    }
                    return target
                }
                return _year+'年'+addZero(_month)+'月'+addZero(_day)+'日  '+addZero(_hour)+':'+addZero(_minute)
            }
    }

    // 图片cdn
    ,{
        name:'imgCdn'
        ,fn:function(val){
            return address.IMG_ADDRESS+val
        }
    }
]

// 注册filters到Vue
for (var i=0; i<filters.length; i++){
    Vue.filter(filters[i].name,filters[i].fn)
}