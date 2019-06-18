<template>
  <div>
    <div class="zzu-calendar-box">
      <div class="month-box" :width="width" :height="height">
        <div class="month-bar-box">
          <div class="month-bar-item">
            <el-button type="primary" plain icon="el-icon-arrow-left" @click="prevMonthHandler">{{prevMonthText}}
            </el-button>
          </div>
          <div class="month-bar-item center">
            <el-date-picker style="width: 130px"
                            v-model="currentMonth"
                            type="month"
                            format="yyyy年MM月"
                            value-format="yyyy-MM-dd"
                            :clearable="false"
                            :editable="false"
                            align="center" @change="changedMonth"
                            placeholder="选择月">
            </el-date-picker>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAllWeekDay"
                         @change="handleCheckAllChange">
              全选
            </el-checkbox>
          </div>
          <div class="month-bar-item">
            <el-button class="month-bar-item" type="primary" plain @click="nextMonthHandler" :true-label="true">
              {{nextMonthText}}<i
              class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
          </div>
        </div>
        <div class="week-line-box">
          <el-checkbox-group v-model="checkedWeekDays" @change="handleCheckedWeekDaysChange" class="week">
            <el-checkbox v-for="(week,idx) in weekDays" :label="idx" :key="idx">{{week}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="month-body">
          <div :class="['one-week',{'last-week':(idx+1) == monthDateList.length}]"
               v-for="(week,idx) in monthDateList">
            <zzu-day-cell :class="['date',{last:( i + 1 ) % 7 == 0}]"
                          v-for="(day,i) in week" @change="onDateSelectedHandler" :key="idx+'-'+i" :date="day">
              <div slot="date-body">
              </div>
            </zzu-day-cell>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import zzuDayCell from '@/views/test/ZzuDayCell'
  import Day from '@/utils/ZzuDate'
  import * as R from 'ramda'
  import Moment from 'moment'
  import {extendMoment} from 'moment-range'
  import calUtil from '@/utils/calendarUtil'

  const moment = extendMoment(Moment)
  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
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

  // const date = new Day('2018-05-18', 21, '初一', 7, false, false, true,)

  export default {
    name: "ZzuMonth",
    components: {
      zzuDayCell
    },
    created() {
      this.currentMonth = moment().startOf('month').format('YYYY-MM-DD')
    },
    props: {
      width: {
        type: String,
        default: '1050px'
      },
      height: {
        type: String,
        default: '800px'
      }
    },
    watch: {
      'checkedWeekDays': {
        handler(newVal, oldVal) {
          console.log('aaaa-0>', newVal, oldVal)
          if (oldVal.length > newVal.length) {
            // 删除选中状态
            R.difference(oldVal, newVal).forEach(n => this.handDateListWeekCheck(false, n))
          } else if (newVal.length) {
            newVal.forEach(n => this.handDateListWeekCheck(true, n))
          }
        },
        deep: true
      },
      'currentMonth': function (newVal, oldVal) {
        console.log(newVal, oldVal)
        if (oldVal)
          this.backupMonthDataHandler(oldVal)
        // 计算上一月和下一月
        let prevMonth = moment(newVal).add(-1, 'month')
        this.prevMonth = prevMonth.format('YYYY-MM-DD')
        this.prevMonthText = prevMonth.format('M月')
        let nextMonth = moment(newVal).add(1, 'month')
        this.nextMonth = nextMonth.format('YYYY-MM-DD')
        this.nextMonthText = nextMonth.format('M月')
        this.currentMonth = newVal
        this.dateRangeGenerator(newVal)
        console.log('all ->', this.allDate)
      }
    },
    data() {
      return {
        prevMonthText: '',
        prevMonth: '',
        currentMonth: '',
        nextMonth: '',
        nextMonthText: '',
        beginDay: '',
        endDay: '',
        isFillDay: true,
        checkedWeekDays: [],
        isIndeterminate: false,
        weekDays: weekDays,
        checkAllWeekDay: false,
        monthDateList: [],
        flattenMonthDateList: [],
        allDate: {}
      }
    },
    methods: {
      handleChange($event) {
        console.log('2222=>' + $event)
      },
      // 选中当前月份事件处理函数
      changedMonth(v) {
        this.currentMonth = v
      },
      // 上个月
      prevMonthHandler() {
        this.currentMonth = moment(this.currentMonth).add(-1, 'month').format('YYYY-MM-DD')
      },
      // 下个月
      nextMonthHandler() {
        this.currentMonth = moment(this.currentMonth).add(1, 'month').format('YYYY-MM-DD')
      },
      // 改变月份时备份数据函数
      backupMonthDataHandler(oldVal) {
        console.log('backup...')
        if (!this.currentMonth || !this.monthDateList.length) return
        if (!this.allDate.hasOwnProperty(oldVal)) {
          console.log('created. new all date ....')
          this.allDate[oldVal] = {}
        }
        this.allDate[oldVal].dateList = this.monthDateList
        this.allDate[oldVal].checkAllWeekDay = this.checkAllWeekDay
        this.allDate[oldVal].isIndeterminate = this.isIndeterminate
        this.allDate[oldVal].checkedWeekDays = this.checkedWeekDays
        console.log('backup... done')
      },
      // 恢复月份数据函数
      recoveryMonthDataHandler(newVal) {
        console.log('recovery...')
        if (this.allDate && this.allDate[newVal] && this.allDate[newVal].dateList.length) {
          this.monthDateList = this.allDate[newVal].dateList
          this.checkAllWeekDay = this.allDate[newVal].checkAllWeekDay
          this.isIndeterminate = this.allDate[newVal].isIndeterminate
          this.checkedWeekDays = this.allDate[newVal].checkedWeekDays
          console.log('recovery... done')
          return true
        } else {
          this.checkAllWeekDay = []
          this.isIndeterminate = false
          this.checkedWeekDays = []
          return false
        }
      },
      // 星期选择处理函数
      handleCheckedWeekDaysChange(value) {
        console.log(value)
        let checkedCount = value.length
        this.checkAllWeekDay = checkedCount === this.weekDays.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.weekDays.length
      },
      // 全选处理函数
      handleCheckAllChange(val) {
        this.checkedWeekDays = val ? [0, 1, 2, 3, 4, 5, 6] : []
        this.isIndeterminate = false
      },
      handDateListWeekCheck(val, weekIdx) {
        let len = this.monthDateList.length
        for (let i = 0; i < len; i++) {
          let date = this.monthDateList[i][weekIdx]
          if (!date.isPastTime)
            date.isChecked = val
        }
      },
      // 日历选中日期处理函数
      onDateSelectedHandler(date) {
        console.log('ttttt')
        if (date && date.date && !date.isPastTime) {
          date.isChecked = !date.isChecked
        }
      },
      isCkeckedAllColumn(date) {
        if (!this.flattenMonthDateList && this.flattenMonthDateList.length) R.flatten(this.monthDateList).filter(n => n && n.date)
        let week = this.flattenMonthDateList.filter(n => n && n.e == date.e && !n.isPastTime)
        if (R.all(x => x.isChecked, week)) {
          console.log('isall check')
        } else if (R.all(x => !x.isChecked, week)) {
          console.log('isall not check')
        }
      },
      // 只生成1个月的日期段
      dateRangeGeneratorByMonth(dateStr) {
        return moment.range(moment(dateStr).startOf('month'), moment(dateStr).endOf('month'))
      },
      // 补齐星期月首/月尾
      fillOutMonthDateList(isHead, days) {

      },
      // 日期段生成器
      dateRangeGenerator(newVal) {
        if (this.recoveryMonthDataHandler(newVal)) return
        console.log('gen')
        let firstDate = moment(this.currentMonth).startOf('month')
        let lastDate = moment(this.currentMonth).endOf('month')
        let firstDateWeek = firstDate.format('E') //找到星期几
        let lastDateWeek = lastDate.format('E')
        let startDate = firstDate;
        let endDate = lastDate;
        let beforeFirstQty = 0;
        let afterEndQty = 0;
        if (firstDateWeek != 1 && firstDateWeek <= 7) {
          beforeFirstQty = firstDateWeek - 1
          if (!this.isFillDay)
            startDate = firstDate.subtract(beforeFirstQty, 'days')
        }
        if (lastDateWeek != 7 && lastDateWeek < 7) {
          afterEndQty = 7 - lastDateWeek
          if (!this.isFillDay)
            endDate = endDate.add(afterEndQty, 'days')
        }

        let range = moment.range(startDate, endDate)
        let dateList = []
        let self = this
        let today = moment().format('YYYY-MM-DD')
        dateList = Array.from(range.by('day')).map(x => {
          let lunar = calUtil.solar2lunar(x.year(), x.month() + 1, x.format('D') * 1)
          let cnDay = self.dateToPerpetual(lunar)
          return new Day(x.format('YYYY-MM-DD'), x.format('D'), cnDay, x.format('E') * 1, false, x.isBefore(today), lunar)
        })
        if (this.isFillDay) {
          dateList = new Array(beforeFirstQty).fill(new Day()).concat(dateList).concat(new Array(afterEndQty).fill(new Day()))
        }
        let mDateList = []
        dateList.forEach((n, i) => {
          if (i % 7 == 0) mDateList.push([])
          mDateList[mDateList.length ? mDateList.length - 1 : 0].push(n)
        })
        console.log(mDateList)
        this.monthDateList = mDateList
      },
      dateToPerpetual(lunar) {
        if (!lunar) return null;
        if (lunar.lDay == 1) return lunar.IMonthCn
        this.isHoliday(lunar) ? lunar.isHoliday = true : lunar.isHoliday = false
        return lunar.isTerm ? lunar.Term : lunar.IDayCn
      },
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
    }
  }
</script>

<style scoped lang="stylus">
  border-color = #ccd2df
  .month-box
    margin 50px auto
    width 1050px
    box-sizing border-box
    border 1px solid border-color
    overflow hidden
    align-content center
    & > .month-bar-box
      display flex
      padding 10px 20px
      border-bottom 1px solid border-color
      & > .month-bar-item
        flex 1
      & > .month-bar-item.center
        flex 3
        text-align center
      & > .month-bar-item:last-child
        text-align right

  & > .week-line-box
    height 40px
    line-height 40px
    overflow hidden
    border-bottom 1px solid border-color
    & > .week
      display flex
      min-width 14.2857%
      & > *
        text-align center
        flex 1

  .month-body
    display flex
    height 700px
    flex-direction column
    align-items stretch
    & > .one-week:not(.last-week)
      border-bottom 1px solid border-color
    & > .one-week
      display flex
      flex 1
      font-size 0.91rem
      font-weight 700
      align-items stretch
      overflow hidden
      & > .date
        flex 1
        width 14.2857%
      & > .date:not(.last)
        border-right 1px solid border-color
</style>
