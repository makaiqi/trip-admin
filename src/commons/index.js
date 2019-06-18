import Vue from 'vue'
import router from '@/router'
import store from '@/store'


// 获取用户信息
Vue.prototype.getUserInfo = (id) => {
  return new Promise((resolve, reject) => {
    Vue.prototype.$http.get(`arch/User/findById`,
      {
        params: {
          id
        }
      }
    ).then( rs => {
      if(rs.data.code == 0) {
        // store.commit()
        resolve(rs.data.data)
      } else {
        resolve(false)
      }
    })
  });
}

// 获取城市时境内还是境外
Vue.prototype.getCityContain = (cityId) => {
  return new Promise((resolve, reject) => {
    Vue.prototype.$http.get('fund/Area/findByChildrenId',
      {
        params: {
          id: cityId
        }
      }
    ).then( rs => {
      if(rs.data.code == 0) {
        resolve(rs.data.data)
      } else {
        resolve(false)
      }
    })
  });
}

// 根据首字母查询城市
Vue.prototype.getCityByFirstLetter = (firstLetter) => {
  Vue.prototype.$http.get('fund/Area/findByFirstLetter',
    {
      params:	{
        first_letter: firstLetter
      }
    }
  ).then( rs => {
    if(rs.data.code == 0) {
      resolve(rs.data.data)
    } else {
      resolve(false)
    }
  }).catch();
}

// 路由跳转
Vue.prototype.goPage = (url) => {
  console.log(url)
  router.push(url)
}

// 地址信息保存处理
Vue.prototype.saveOrUpdateAddress = (formAddOrUpdate) => {
  let data = {
    addressDomain: {}
  };

  for(let key in formAddOrUpdate) {
    if(key == 'address' || key == 'lat' || key == 'lng' || key == 'shortAddress') {
      data.addressDomain[key] = formAddOrUpdate[key]
    } else {
      data[key] = formAddOrUpdate[key]
    }
  }

  return data;
};

Vue.prototype.saveOrUpdateAddressAll = (formAddOrUpdate) => {
  let data = {
    addressDomain: {}
  };

  for(let key in formAddOrUpdate) {
    if(key == 'address'  || key == 'areaId'|| key == 'cityId'|| key == 'cityName') {
      data.addressDomain[key] = formAddOrUpdate[key]
    } else {
      data[key] = formAddOrUpdate[key]
    }
  }

  return data;
}

// 时间补全秒
Vue.prototype.timeCompletion = (data, type = 'HH:mm') => {
  if(type == 'HH:mm') {
    return data + ':00';
  }
  return data;
}

// 用户session设置
Vue.prototype.sessionStorage = {
  getItem (key) {
    return sessionStorage.getItem(key);
  },
  setItem (key, value) {
    sessionStorage.setItem(key, value);
  },
  removeItem (key) {
    sessionStorage.removeItem(key);
  },
  clear () {
    sessionStorage.clear();
  }
}

// 对象及数组深copy
Vue.prototype.deepCopy = function(source) {
  let result;
  if (Array.isArray(source)) {
    result = [];
    if(source.length > 0) {
      result = source.map(item => {
        return item instanceof Object ? Vue.prototype.deepCopy(item) : item;
      })
    }
  } else if(source instanceof Object) {
    result = {};
    for (let key in source) {
      if(source[key] instanceof Object) {
        result[key] = Vue.prototype.deepCopy(source[key])
      } else  {
        result[key] = source[key];
      }
    }
  } else {
    result = source;
  }

  return result;
}
