<template>
	<div class="table_calendar">
		<h3 class="table_calendar_title">价格库存</h3>
		<div class="table_calendar_form">
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
			  <el-form-item label="库存模式" prop="inventory_model">
			  	<el-radio v-model="ruleForm.inventory_model" label="v001">不限库存</el-radio>
	  			<el-radio v-model="ruleForm.inventory_model" label="v002">总库存</el-radio>
	  			<el-radio v-model="ruleForm.inventory_model" label="v003">日库存</el-radio>
			  </el-form-item>
			  <el-form-item label="日期价格" prop="time_pic">
			  	<p>请先选择日期</p>
			    <div class="calendar">
						<!-- 年份 月份 -->
						<div class="month">
							<ul>
								<li class="arrow" @click="pickPre(currentYear,currentMonth)">❮</li>
								<li class="year-month" @click="pickYear(currentYear,currentMonth)">
									<span class="choose-year">{{ currentYear }}</span>
									<span class="choose-month">{{ currentMonth }}月</span>
								</li>
								<li class="arrow" @click="pickNext(currentYear,currentMonth)">❯</li>
							</ul>
							<span @click="checkbox()">全选</span>
									<span @click="notcheck()">删除全选</span>
						</div>
			
						<!-- 星期 -->
						<ul class="weekdays">
							<li>周一</li>
							<li>周二</li>
							<li>周三</li>
							<li>周四</li>
							<li>周五</li>
							<li style="color:red">周六</li>
							<li style="color:red">周日</li>
						</ul>
			
						<!-- 日期 -->
						<ul class="days">
							
							<li v-for="(dayobject , index) in days" id="wp" :key="index" :class="{active:dayobject.checked}" @click="changeClass(dayobject,index)">
								<!--<input type="checkbox"  />-->
								<span v-if="dayobject.day.getMonth()+1 != currentMonth" class="other-month">{{ dayobject.day.getDate() }}</span>
								<span v-else>
			              <span v-if="dayobject.day.getFullYear() == new Date().getFullYear() && dayobject.day.getMonth() == new Date().getMonth() && dayobject.day.getDate() == new Date().getDate()" class="today">今天</span>
										<span v-else>{{ dayobject.day.getDate() }}</span>
								</span>
							</li>
						</ul>
					</div>
			  </el-form-item>
			</el-form>
		</div>
		
	</div>
</template>

<script>
	export default {
		data() {
			return {
				
				ruleForm: {
          time_pic: '',
          inventory_model:'v001',
        },
        rules: {
          time_pic: [
            { required: true, message: ' ', trigger: 'blur' },
          ],
        	inventory_model: [
            { required: true, message: ' ', trigger: 'blur' },
          ]
        },
				
				
				
				
				inputdable:"",
				
				currentDay: 1,
				currentMonth: 1,
				currentYear: 1970,
				currentWeek: 1,
				days: [],
				selectedDate: []
			}
		},
		mounted() {
			this.initData(null);
		},
		methods: {
			initData: function(cur) {
				var leftcount = 0; //存放剩余数量
				var date;

				if(cur) {
					date = new Date(cur);
				} else {
					var now = new Date();
					var d = new Date(this.formatDate(now.getFullYear(), now.getMonth(), 1));
					d.setDate(35);
					date = new Date(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
				}
				this.currentDay = date.getDate();
				this.currentYear = date.getFullYear();
				this.currentMonth = date.getMonth() + 1;

				this.currentWeek = date.getDay(); // 1...6,0
				if(this.currentWeek == 0) {
					this.currentWeek = 7;
				}
				var str = this.formatDate(
					this.currentYear,
					this.currentMonth,
					this.currentDay
				);
				this.days.length = 0;
				// 今天是周日，放在第一行第7个位置，前面6个
				//初始化本周
				for(var i = this.currentWeek - 1; i >= 0; i--) {
					var d = new Date(str);
					d.setDate(d.getDate() - i);
					var dayobject = {}; //用一个对象包装Date对象  以便为以后预定功能添加属性
					dayobject.day = d;
					this.days.push(dayobject); //将日期放入data 中的days数组 供页面渲染使用
				}
				//其他周
				for(var i = 1; i <= 35 - this.currentWeek; i++) {
					var d = new Date(str);
					d.setDate(d.getDate() + i);
					var dayobject = {};
					dayobject.day = d;
					this.days.push(dayobject);
				}
			},

			pickPre: function(year, month) {
				// setDate(0); 上月最后一天
				// setDate(-1); 上月倒数第二天
				// setDate(dx) 参数dx为 上月最后一天的前后dx天
				var d = new Date(this.formatDate(year, month, 1));
				d.setDate(0);
				this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
			},

			pickNext: function(year, month) {
				var d = new Date(this.formatDate(year, month, 1));
				d.setDate(35);
				this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1));
			},

			pickYear: function(year, month) {
				alert(year + "," + month);
			},
			// 返回 类似 2016-01-02 格式的字符串
			formatDate: function(year, month, day) {
				var y = year;
				var m = month;
				if(m < 10) m = "0" + m;
				var d = day;
				if(d < 10) d = "0" + d;
				return y + "-" + m + "-" + d;
			},
			checkbox(){
//				var ch=document.getElementsByName("wp");
//          if(document.getElementsByName("allChecked")[0].checked==true){
//              for(var i=0;i<ch.length;i++){
//                  ch[i].checked=true;
//                  this.$set(ch[i], "checked", true);
//              }
//          }else{
//              for(var i=0;i<ch.length;i++){
//              ch[i].checked=false;
////              val.checked = !val.checked;
//              }
//          }
					var date = new Date();
			     var year = date.getFullYear();
			     var month = date.getMonth()+1;
			     var d = new Date(year, month, 0);
//			     console.log(date.setDate(1))
//					for(var i=0;i<this.days.length;i++){
//						if(date.setDate(1)==this.days[i].day){
//							console.log(i)
//							break
//						}
//					}
					for(var i=1;i<d.getDate();i++){
						this.$set(this.days[i], "checked", true)
					}
					console.log(this.selectedDate)
			},
			notcheck(){
				var date = new Date();
			     var year = date.getFullYear();
			     var month = date.getMonth()+1;
			     var d = new Date(year, month, 0);
				for(var i=1;i<d.getDate();i++){
						this.$set(this.days[i], "checked", false)
					}
			},
			changeClass(val,index) {
				console.log(val);
				this.selectedDate = this.selectedDate.concat(val);
				console.log(this.selectedDate);
				if(typeof val.checked == "undefined") {
					this.$set(val, "checked", true)
				} else {
					val.checked = !val.checked;
				}
			}
		}
	}
</script>

<style lang="scss" scope>
@import "~@/assets/css/core/index";
.table_calendar{
	position: relative;
}
.table_calendar_title{
	position: absolute;
	left: 30px;
}
.table_calendar_form{
	padding-top: 50px;
}
.calendar {
  width: 80%;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.1),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);

  ul {
    list-style-type: none;
  }

  .month {
    width: 100%;
    color: #000000;
    background: #ccc;
  }

  .month ul {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: space-between;
  }

  .year-month {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }

  .year-month:hover {
    background: rgba(150, 2, 12, 0.1);
  }

  .choose-year {
    padding-left: 20px;
    padding-right: 20px;
  }

  .choose-month {
    text-align: center;
    font-size: 1.5rem;
  }

  .arrow {
    padding: 30px;
  }

  .arrow:hover {
    background: rgba(100, 2, 12, 0.1);
  }

  .month ul li {
    color: white;
    font-size: 20px;
    text-transform: uppercase;
    letter-spacing: 3px;
  }

  .weekdays {
    margin: 0;
    padding: 10px 0;
    /*background-color: #00b8ec;*/
    display: flex;
    flex-wrap: wrap;
    color: #000000;
    justify-content: space-around;
    border-bottom: 1px solid #ccc;
  }

  .weekdays li {
    display: inline-block;
    width: 13.6%;
    text-align: center;
  }

  .days {
    padding: 0;
    background: #ffffff;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    /*border-left: 1px solid #ccd2df;*/
    .active {
      /*// color: red;*/
      background: #f1f1f1;
      color: #ffffff;
    }
    .today {
      color: #00b8ec;
    }
  }

  .days li {
    list-style-type: none;
    display: inline-block;
    width: 15%;
    height: 120px;
    text-align: center;
    padding-bottom: 15px;
    padding-top: 15px;
    font-size: 1rem;
    color: #000;
    /*border: 1px solid #ccd2df;*/
    /*border-left:none ;*/
  }

  /*// .days li .active {
  //   padding: 6px 10px;
  //   border-radius: 50%;
  //   background: red;
  //   color: #fff;
  // }*/

  .days li .other-month {
    padding: 5px;
    color: gainsboro;
  }

  .days li:hover {
    background: #e1e1e1;
  }
}
</style>
