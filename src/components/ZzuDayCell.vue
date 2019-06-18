<template>
  <div>
    <div v-if="!date.date" class="zzu-day-cell-box" >
      <div class="day-box">
        <div class="cn-day">&nbsp;</div>
        <div class="ln-day">&nbsp;</div>
        <div class="holiday">&nbsp;</div>
      </div>
    </div>
    <div v-else :class="['zzu-day-cell-box',{'past-time': date.isPastTime,selected: date.isChecked}] " @click="clickHandler">
      <div class="day-box">
        <div :class="['cn-day',{today:date.lunar.isToday}]">{{date.day}}日</div>
        <div :class="['ln-day',{'first-ln-day':date.lunar.lDay == 1}]">{{date.cnDay}}</div>
        <div class="holiday">{{date.lunar.holiday}}</div>
      </div>
      <el-tooltip placement="top" effect="light" :open-delay="300" :disabled="!date.tip">
        <div slot="content" v-html="date.tip">
        </div>
        <slot name="date-body" class="content-box" v-html="date.body">
        </slot>
      </el-tooltip>
    </div>
  </div>

</template>
<script>
  import Day from '@/utils/ZzuDate'

  export default {
    name: "DayCell",
    props: {
      date: {
        type: Day
      }
    },
    data() {
      return {}
    },
    methods: {
      clickHandler() {
        this.$emit('change', this.date)
      }
    }
  }
</script>

<style scoped lang="stylus">
  .zzu-day-cell-box
    box-sizing border-box
    padding 8px
    width 100%
    height 100%
    overflow hidden
    & > .day-box
      display flex
      font-size 0.88rem
      font-weight 600
      justify-content space-between
      margin-bottom 10px
      & .holiday
        color #309000
      & > .day-box > div
        flex 1
        align-items flex-end
  .cn-day,.ln-day,.holiday
    min-width 10px
  .ln-day,.holiday
    font-size 0.77rem
  .ln-day
    color #ccc
    font-size 0.72rem

  .first-ln-day
    color #ffc107

  .past-time
    background #fafafa
    color #909399

  .today
    color #f44336

  .selected
    background #50bfff

  .content-box
    overflow hidden

</style>
