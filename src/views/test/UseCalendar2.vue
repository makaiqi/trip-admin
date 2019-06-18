<template>
  <div>
  	<span>请先选择日期</span>
    <zzu-calendar
      @select="selectDateHandler"
      :is-cross-month="true"
      :is-show-past-time-checked="false"
      :date-list="dateList"
      date-name="stockDate"
      tip-name="tip"
      body-name="cxt"
      checked-name="isAvailable"
      class="zzu-calendar"
      width="800px"
      height="700px">
    </zzu-calendar>
    <tr class="tableDate-tr-bg">
             <th>门市价（元）</th>
             <th>掌中游价（元）</th>
             <th>结算价（元）</th>
             <th>费率（%）</th>
            </tr>

            <tr class="tableDate-tr-bg">
              <td><el-input-number class="ipt" v-model="adultText" controls-position="right" :min="0" :max="10"></el-input-number></td>
              <td><el-input-number class="ipt" v-model="zzyText" controls-position="right" :min="0" :max="10"></el-input-number></td>
              <td><el-input-number class="ipt" v-model="settlementText" controls-position="right" :min="0" :max="10"></el-input-number></td>
              <td><el-input class="ipt" :readonly="true" v-model="rateText" controls-position="right"></el-input></td>
            </tr>
    <el-button :disabled="disabledBut" @click="tableFun()">更新</el-button>
  </div>
</template>

<script>
  import ZzuCalendar from '@/components/ZzuCalendar'

  export default {
    name: "UseCalendar",
    data(){
    	return {
    		
    	}
    },
    components: {
      ZzuCalendar
    },
    data() {
      return {
      	adultText:"",
      	zzyText:"",
      	settlementText:"",
      	rateText:0,
      	soldText:0,
        dateList: [],
        allDate:[],
        disabledBut:true
      }
    },
    watch : {
    	adultText (newval,oldval) {
    		if(newval!=0 || this.zzyText!=0 || this.settlementText!=0){
    			this.disabledBut=false;
    		}else{
    			this.disabledBut=true;
    		}
    	}
    },
    mounted(){
    },
    methods: {
      selectDateHandler(dateList) {
      	this.allDate=[]
        console.log('your selected date list -> ', dateList)
        for(let i=0;i<dateList.length;i++){
        	this.allDate.push(dateList[i].date)
        }
        
//      console.log(this.allDate)
      },
      removeHandler() {
        this.dateList.pop()
      },
      tableFun(){
      	for(let i=0;i<this.allDate.length;i++){
      		if(this.adultText!=0 && this.zzyText!=0 && this.settlementText!=0){
      			this.disabledBut=false;
      		}
      		else{
      			this.disabledBut=true;
      			return;
      		}
      		this.dateList.push({
	          id:i,
	          opUserId: i,
	          ownerId: i,
	          stockDate:this.allDate[i],
	          gtInstId: 6,
	          stockQty: 120,
	          stockConfirmQty: 30,
	          soldQty: 20,
	          minPeople: 1,
	          maxPeople: 5,
	          tip: '日期：2018-05-26 库存：150<br/>成人价 ¥:80.00<br/>儿童价 ¥:30.00',
	          cxt: '<span style="color: #000;font-size:12px;">门市价：¥'+ this.adultText +':00'+ '掌中游价：￥'+this.zzyText+':00'+ '结算价：￥'+this.settlementText+':00'+ '费率：￥'+this.rateText+'%'+ '已售/库存：'+this.soldText +'/不限'+'</span>',
	          isAvailable: true,
	          adultPrice: 80.00,
	          adultMktPrice: 100.00,
	          childrenPrice: 30.00
	        })
      	}
      	
      },
    }
  }
</script>

<style lang="stylus" scoped="scoped">
  *{
  	font-size: 12px;
  }
  .tableDate-tr-bg {
	  border: #eaeaea solid 1px;
	  margin: auto;
	  th {
	    border: #eaeaea solid 1px;
	    background-color: #fafafa;
	    text-align: center;
	    padding: 10px;
	  }
	  td {
	    border: #eaeaea solid 1px;
	    padding: 10px;
	    text-align: center;
	  }
	  .ipt{
	  	width: 90%;
	  }
	}
</style>
