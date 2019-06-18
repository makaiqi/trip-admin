import Day from '@/utils/ZzuDate'
import Moment from 'moment'
import {extendMoment} from 'moment-range'
import calUtil from '@/utils/calendarUtil'
import * as R from 'ramda'

const moment = extendMoment(Moment)
const holidays = {
  cal: {
    '1-1': '元旦',
    '2-14': '情人',
    '3-8': '妇女',
    '4-1': '愚人',
    '4-5': '清明',
    '5-1': '劳动',
    '6-1': '儿童',
    '7-1': '建党',
    '8-1': '建军',
    '9-10': '教师',
    '10-1': '国庆',
    '6-23': '奥林匹克',
    '12-24': '平安夜',
    '12-25': '圣诞'
  },
  lunar: {
    '1-1': '春节',
    '1-15': '元宵',
    '2-2': '龙头',
    '5-5': '端午',
    '7-7': '七夕',
    '8-15': '中秋',
    '9-9': '重阳',
    '10-1': '寒衣',
    '12-8': '腊八'
  },
  other(day, month, year) {
    if (!day || !month || !year) return '';
    let rs = ''
    if (month == 5) {
      let m = moment(`${year}-05-01`).add(1, 'w')
      m.add(7 - m.format('E') * 1, 'days').format('YYYY-MM-DD') == moment(`${year}-05-${day > 9 ? day : '0' + day}`).format('YYYY-MM-DD') ? rs = '母亲' : ''
    } else if (month == 6) {
      let m = moment(`${year}-06-01`).add(2, 'w')
      m.add(7 - m.format('E') * 1, 'days').format('YYYY-MM-DD') == moment(`${year}-06-${day > 9 ? day : '0' + day}`).format('YYYY-MM-DD') ? rs = '父亲' : ''
    } else if (month == 11) {
      let m = moment(`${year}-11-01`).add(3, 'w')
      m.add(4 - m.format('E') * 1, 'days').format('YYYY-MM-DD') == moment(`${year}-11-${day > 9 ? day : '0' + day}`).format('YYYY-MM-DD') ? rs = '感恩' : ''
    }
    return rs
  }
}
export default class ZzuCalendar {
  constructor(isCrossMonth = false, isShowPastTimeChecked = false) {
    this.cfg = {
      isCrossMonth: isCrossMonth,
      isShowPastTimeChecked: isShowPastTimeChecked
    }
    this.allDate = new Set()
    this.allMonth = {}
  }

  // 生成一个月的日期集合
  monthDateBuild(month) {
    if (this.allMonth.hasOwnProperty(month) && this.allMonth[month].hasOwnProperty('dateList')) return
    let today = moment()
    if (!this.allMonth.hasOwnProperty(month)) {
      this.allMonth[month] = {}
    }
    this.allMonth[month].dateList = Array.from(moment.range(moment(month).startOf('month'), moment(month).endOf('month')).by('day')).map(x => {
      let lunar = calUtil.solar2lunar(x.year(), x.month() + 1, x.format('D') * 1)
      let cnDay = this.dateToPerpetual(lunar)
      return new Day(null, x.format('YYYY-MM-DD'), x.format('D'), cnDay, x.format('E') * 1, false, x.isBefore(today, 'day'), lunar)
    })
    this.allMonth[month].dateList.forEach(n => this.allDate.add(n))
    this.setMonthCfg(month)
  }

  // 日历日期格式化
  getMonthDateFormat(month) {
    if (!(this.allMonth.hasOwnProperty(month) && this.allMonth[month].hasOwnProperty('dateList'))) this.monthDateBuild(month)
    let dateList = []
    this.compensateDate(month).forEach((n, i) => {
      if (i % 7 == 0) dateList.push([])
      dateList[dateList.length - 1].push(n)
    })
    return dateList
  }

  // 获取配置数据
  getMonthConfig(month) {
    return this.allMonth[month].cfg
  }

  // 补偿日历
  compensateDate(month) {
    let list = this.allMonth[month].dateList
    let prev = moment(month).add(-1, 'month').startOf('month')
    let prevFmt = prev.format('YYYY-MM-DD')
    let next = moment(month).add(1, 'month').startOf('month')
    let nextFmt = next.format('YYYY-MM-DD')
    if (this.cfg.isCrossMonth) {
      if (!this.allMonth[prevFmt]) this.monthDateBuild(prevFmt)
      if (!this.allMonth[nextFmt]) this.monthDateBuild(nextFmt)
      if (!(this.allMonth.hasOwnProperty(prevFmt) && this.allMonth[prevFmt].hasOwnProperty('dateList'))) this.monthDateBuild(prevFmt)
      if (!(this.allMonth.hasOwnProperty(nextFmt) && this.allMonth[nextFmt].hasOwnProperty('dateList'))) this.monthDateBuild(nextFmt)
      return this.allMonth[prevFmt].dateList.slice(this.allMonth[prevFmt].dateList.length - (list[0].e * 1 - 1)).concat(this.allMonth[month].dateList).concat(this.allMonth[nextFmt].dateList.slice(0, 7 - list[list.length - 1].e))
    } else {
      return new Array(list[0].e - 1).fill(new Day()).concat(this.allMonth[month].dateList).concat(new Array(7 - list[list.length - 1].e).fill(new Day()))
    }
  }

  // 选中星期几时处理函数
  selectDateByWeekDay(month, dayVal, isChecked = false, isAll = false) {
    if (!month) return
    if (this.cfg.isCrossMonth) {
      if (this.cfg.isShowPastTimeChecked) {
        isAll ? R.flatten(this.getMonthDateFormat(month)).forEach(x => x.isChecked = isChecked) : R.flatten(this.getMonthDateFormat(month)).filter(x => x.e == dayVal + 1).forEach(y => y.isChecked = isChecked)
      } else {
        isAll ? R.flatten(this.getMonthDateFormat(month)).filter(x => !x.isPastTime).forEach(y => y.isChecked = isChecked) : R.flatten(this.getMonthDateFormat(month)).filter(x => !x.isPastTime && x.e == dayVal + 1).forEach(y => y.isChecked = isChecked)
      }
    } else {
      if (this.cfg.isShowPastTimeChecked) {
        isAll ? this.allMonth[month].dateList.forEach(x => x.isChecked = isChecked) : this.allMonth[month].dateList.filter(x => x.e == dayVal + 1).forEach(y => y.isChecked = isChecked)
      } else {
        isAll ? this.allMonth[month].dateList.filter(x => !x.isPastTime).forEach(y => y.isChecked = isChecked) : this.allMonth[month].dateList.filter(x => !x.isPastTime && x.e == dayVal + 1).forEach(y => y.isChecked = isChecked)
      }
    }
  }

  // 日期选择状态处理函数
  selectDate(date, month) {
    if (!date || !date.date || !this.cfg.isShowPastTimeChecked && date.isPastTime) return console.log('return')
    date.isChecked = !date.isChecked
    let week = []
    if (this.cfg.isCrossMonth) {
      if (this.cfg.isShowPastTimeChecked)
        week = R.flatten(this.getMonthDateFormat(month)).filter(x => x.e == date.e)
      else
        week = R.flatten(this.getMonthDateFormat(month)).filter(x => x.e == date.e && !x.isPastTime)
    } else {
      if (this.cfg.isShowPastTimeChecked)
        week = this.allMonth[month].dateList.filter(x => x.e == date.e)
      else
        week = this.allMonth[month].dateList.filter(x => x.e == date.e && !x.isPastTime)
    }
    let weekDays = this.allMonth[month].cfg.checkedWeekDays
    if (R.all(x => x.isChecked)(week)) {
      weekDays.push(date.e - 1)
      weekDays.length == 7 ? this.allMonth[month].cfg.isIndeterminate = false : this.allMonth[month].cfg.isIndeterminate = true
    } else {
      let idx = weekDays.indexOf(date.e - 1)
      if (idx != -1) {
        this.allMonth[month].cfg.checkedWeekDays.splice(idx, 1)
      }
    }
    let len = this.allMonth[month].cfg.checkedWeekDays.length
    this.allMonth[month].cfg.checkAllWeekDay = len === 7
    this.allMonth[month].cfg.isIndeterminate = len > 0 && len < 7
  }

  // 友好显示农历
  dateToPerpetual(lunar) {
    if (!lunar) return null
    if (lunar.lDay == 1) return lunar.IMonthCn
    this.isHoliday(lunar) ? lunar.isHoliday = true : lunar.isHoliday = false
    return lunar.isTerm ? lunar.Term : lunar.IDayCn
  }

  // get节假日
  isHoliday(lunar) {
    let holiday = []
    let h1 = holidays.cal[`${lunar.cMonth}-${lunar.cDay}`]
    if (h1) holiday.push(h1)
    let h2 = holidays.lunar[`${lunar.lMonth}-${lunar.lDay}`]
    if (h2) holiday.push(h2)
    let h3 = holidays.other(lunar.cDay, lunar.cMonth, lunar.cYear)
    if (h3) holiday.push(h3)
    let h = holiday.filter(n => n).join('/')
    lunar.holiday = h
    return h
  }

  // 获取月份配置
  getMonthCfg(month) {
    return this.allMonth.hasOwnProperty(month) && this.allMonth[month].hasOwnProperty('cfg') ? this.allMonth[month].cfg : (this.setMonthCfg(month) || this.allMonth[month].cfg)
  }

  // 保存月份配置参数
  setMonthCfg(month, cfg) {
    if (!month) return
    if (!this.allMonth.hasOwnProperty(month)) this.allMonth[month] = {}
    if (cfg && cfg.hasOwnProperty('checkedWeekDays') && cfg.hasOwnProperty('checkAllWeekDay') && cfg.hasOwnProperty('isIndeterminate')) {
      this.allMonth[month].cfg.checkedWeekDays = cfg.checkedWeekDays
      this.allMonth[month].cfg.checkAllWeekDay = cfg.checkAllWeekDay
      this.allMonth[month].cfg.isIndeterminate = cfg.isIndeterminate
    } else {
      let cfg = this.allMonth[month].cfg
      if (!cfg || !cfg.hasOwnProperty('checkedWeekDays'))
        this.allMonth[month].cfg = {
          checkedWeekDays: [],
          checkAllWeekDay: false,
          isIndeterminate: false
        }
    }
  }

  // 取消所有选中的日期
  cancelAllDateSelected() {
    this.getAllDate().forEach(x => x.isChecked = false)
    for (let key in this.allMonth) {
      this.allMonth[key].cfg.checkedWeekDays.splice(0)
      this.allMonth[key].cfg.checkAllWeekDay = false
      this.allMonth[key].cfg.isIndeterminate = false
    }
    return []
  }

  // 获取所有的日期
  getAllDate() {
    return Array.from(this.allDate)
  }

  // 获取所有的已选择的日期
  getAllCheckedDate() {
    return Array.from(this.allDate).filter(n => n.isChecked)
  }

  // 合并日期内容
  mergeDateContent(dateList, dateName, checkedName, bodyName, tipName) {
    if (!dateList || !dateName || !dateList instanceof Array || !checkedName) return this.getAllCheckedDate()
    let allList = this.getAllDate()
    let today = moment()
    dateList.forEach(x => {
      let date = R.find(R.propEq('date', x[dateName]))(allList)
      if (!date) {
        this.monthDateBuild(moment(x[dateName]).startOf('month').format('YYYY-MM-DD'))
        // let month = moment(date.date).startOf('month').format('YYYY-MM-DD')
        // this.monthDateBuild(month)
        allList = this.getAllDate()
        date = R.find(R.propEq('date', x[dateName]))(allList)
      }
      if (!date) return console.log(`Merge error not found: ${x[dateName]}`)
      if (this.cfg.isShowPastTimeChecked) date.isChecked = x[checkedName]
      else if (!today.isAfter(x[dateName])) date.isChecked = x[checkedName]
      date.id = x.id
      date.tip = x[tipName]
      date.body = x[bodyName]
    })
    R.differenceWith((x, y) => x.date === y[dateName], allList, dateList).forEach(x => {
      x.id = null
      x.tip = null
      x.body = null
    })
    return this.getAllCheckedDate()
  }
}
