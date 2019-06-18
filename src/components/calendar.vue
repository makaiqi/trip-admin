<template>
  <div class="month-box" @mouseup="sendEvent" @mouseleave="sendEvent" :style="{width,height}">
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
        <!-- <el-checkbox :indeterminate="cfg.isIndeterminate" v-model="cfg.checkAllWeekDay"
                     @change="handleCheckAllChange">
          全选
        </el-checkbox> -->
        <!-- <el-button type="warning" icon="el-icon-delete" class="remove-btn" @click="cancelAllDateChecked">清理选中日期
        </el-button> -->
      </div>
      <div class="month-bar-item">
        <el-button class="month-bar-item" type="primary" plain @click="nextMonthHandler" :true-label="true">
          {{nextMonthText}}<i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
      </div>
    </div>
    <!-- <div class="week-line-box">
      <el-checkbox-group v-model="cfg.checkedWeekDays" @change="handleCheckedWeekDaysChange" class="week">
        <el-checkbox v-for="(week,idx) in weekDays" :label="idx" :key="idx">{{week}}</el-checkbox>
      </el-checkbox-group>
    </div> -->
    <div class="month-body">
      <div :class="['one-week',{'last-week':(idx+1) == monthDateList.length}]"
           v-for="(week,idx) in monthDateList">
        <zzu-day-cell :class="['date',{last:( i + 1 ) % 7 == 0}]"
                      v-for="(day,i) in week" :key="idx+'-'+i" :date="day">
          <div slot="date-body" v-html="day.body">
          </div>
        </zzu-day-cell>
      </div>
    </div>
  </div>

</template>

<script>
  import ZzuDayCell from '@/components/ZzuDayCell'
  import * as R from 'ramda'
  import Moment from 'moment'
  import {extendMoment} from 'moment-range'
  import ZzuCalendar from '@/utils/ZzuCalendar'

  const moment = extendMoment(Moment)
  const weekDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  let calendar = null

  export default {
    name: "ZzuCalendar",
    props: {
      width: String,
      height: String,
      tipName: String,
      dateName: {
        type: String,
        required: true
      },
      checkedName: String,
      bodyName: String,
      dateList: {
        type: Array
      },
      isCrossMonth: {type: Boolean, default: false},
      isShowPastTimeChecked: {type: Boolean, default: false}
    },
    components: {
      ZzuDayCell
    },
    data() {
      return {
        prevMonthText: '',
        prevMonth: '',
        currentMonth: '',
        nextMonth: '',
        nextMonthText: '',
        cfg: {
          checkedWeekDays: [],
          checkAllWeekDay: false,
          isIndeterminate: false
        },
        weekDays: weekDays,
        monthDateList: [],
        allDate: {}
      }
    },
    created() {
      calendar = new ZzuCalendar(this.isCrossMonth, this.isShowPastTimeChecked)
      this.currentMonth = moment().startOf('month').format('YYYY-MM-DD')
      setTimeout(() => calendar.mergeDateContent(this.dateList, this.dateName, this.checkedName, this.bodyName, this.tipName), 50)

    },
    watch: {
      'cfg.checkedWeekDays': {
        handler(newVal, oldVal) {
          if (oldVal.length > newVal.length) {
            // 删除选中状态
            R.difference(oldVal, newVal).forEach(n => calendar.selectDateByWeekDay(this.currentMonth, n))
          } else if (newVal.length) {
            newVal.forEach(n => calendar.selectDateByWeekDay(this.currentMonth, n, true))
          }
        },
        deep: true
      },
      'dateList': {
        handler(newVal, oldVal) {
          calendar.mergeDateContent(this.dateList, this.dateName, this.checkedName, this.bodyName, this.tipName)
        },
        deep: true
      },
      'currentMonth': function (newVal, oldVal) {
        !oldVal ? this.cfg = calendar.getMonthCfg(newVal) : calendar.setMonthCfg(oldVal, this.cfg)
        // 计算上一月和下一月
        let prevMonth = moment(newVal).add(-1, 'month')
        this.prevMonth = prevMonth.format('YYYY-MM-DD')
        this.prevMonthText = prevMonth.format('M月')
        let nextMonth = moment(newVal).add(1, 'month')
        this.nextMonth = nextMonth.format('YYYY-MM-DD')
        this.nextMonthText = nextMonth.format('M月')
        this.currentMonth = newVal
        this.cfg = calendar.getMonthCfg(newVal)
        this.monthDateList = calendar.getMonthDateFormat(newVal)
      }
    },
    methods: {
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

      // 星期选择处理函数
      handleCheckedWeekDaysChange(value) {
        let checkedCount = value.length
        this.cfg.checkAllWeekDay = checkedCount === this.weekDays.length
        this.cfg.isIndeterminate = checkedCount > 0 && checkedCount < this.weekDays.length
      },
      // 全选处理函数
      handleCheckAllChange(val) {
        this.cfg.checkedWeekDays = val ? [0, 1, 2, 3, 4, 5, 6] : []
        this.cfg.isIndeterminate = false
      },
      // 日历选中日期处理函数
      onDateSelectedHandler(date) {
        calendar.selectDate(date, this.currentMonth)
//      console.log(date.date)
      },
      // 清理所有选中的日期
      cancelAllDateChecked() {
        calendar.cancelAllDateSelected()
      },
      sendEvent() {
        let list = calendar.getAllCheckedDate()
//      console.log('calendar select event: ->', list)
        this.$emit('select', list)
      }

    }
  }
</script>

<style scoped lang="stylus">
  border-color = #ccd2df
  .remove-btn
    margin-left 10px

  .month-box
    width 100%
    box-sizing border-box
    border 1px solid border-color
    overflow hidden
    display flex
    flex-direction column
    align-content center
    & > .month-bar-box
      height 54px
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
    overflow hidden
    flex-direction column
    flex-grow: 2
    flex-basis auto
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
