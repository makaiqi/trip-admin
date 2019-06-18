import Vue from 'vue'

// 字节转换
Vue.filter('kbTrans', function(value) {
    let data = 1024,
        unit = 'kb';
    if (value > data) {
        value = (value / data).toFixed(2);
        unit = 'mb';
    }

    return value + unit;
});
//保留2位小数点过滤器 
// 保留小数
Vue.filter('retainedDecimal', function(value) {
    value = Number(value);
    return value.toFixed(2);
});

const myFilter = Vue.filter(['kbTrans', 'retainedDecimal'])

export default myFilter