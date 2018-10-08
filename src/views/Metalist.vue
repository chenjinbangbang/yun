<template>
    <div class="metalist">
        <ul>
            <li v-for="(val, key) in datas" :class="{ err: val.state }" @click="link(val)" >                
                <h3>{{val.region_city_name}}</h3>
                <p>元数据服务器：{{val.meta_num}}台</p>
                <p>客户端数：{{val.client_num}}个</p>
                <p>状态：{{val.state?'警告':'正常'}}</p>
                <p class="jdt"><span :style="{width: val.diskused/val.disktotal*100 + '%' }"></span><i>容量已使用：{{parseInt(val.diskused/val.disktotal*100)}}%</i></p>
                <div :id="'chart'+ (key+1)"></div>
            </li>
        </ul>
    </div>
</template>  

<script>
import { metalist } from "@/api/chart";

export default {
  name: "metalist",
  data() {
    return {
      datas: [],
      isActive: true,
      hasError: true
    };
  },
  mounted() {
    metalist().then(res => {
      let self = this;
      let mock = res.data.results;
      mock.forEach(function(val, n) {
        self.datas.push(val);
      });
    });
  },

  methods: {
    link(val) {
      sessionStorage.setItem('regionID',  val.region_id);
      this.$router.push({
        path: "/status/treemap",
      });
    }
  }
};
</script>

<style lang="scss">
.metalist {
  background-color: #404a59 !important;
  height: calc(100% - 60px);
  ul {
    display: flex;
    padding: 30px 20px;
    //justify-content: space-around;
    flex-flow: row wrap;
  }
  li {
    width: 200px;
    margin: 20px;
    font-size: 14px;
    line-height: 30px;
    padding: 20px;
    text-align: center;
    box-sizing: border-box;
    border: 5px solid #63c3cf;
    background: #277680;
    color: #fff;
    cursor: pointer;
    &:hover {
      box-shadow: 0 0 10px rgba($color: #6cd6e3, $alpha: 0.8);
    }
    &.err {
      background: #c23531;
      border: 5px solid #f67976;
      color: #ff0;
      animation: notice 0.6s infinite alternate;
      h3 {
        border-bottom: 1px solid #f67976;
      }
    }
    h3 {
      padding-bottom: 10px;
      font-size: 18px;
      margin-bottom: 10px;
      border-bottom: 1px solid #63c3cf;
    }
    p {
      &.jdt {
        height: 20px;
        line-height: 20px;
        margin-top: 10px;
        font-size: 12px;
        background: rgba($color: #000, $alpha: 0.2);
        position: relative;
        span {
          position: absolute;
          height: 20px;
          left: 0;
          background: rgba($color: #fff, $alpha: 0.5);
        }
        i {
          font-style: normal;
        }
      }
    }
  }
}
@keyframes notice {
  from {
    box-shadow: 0 0 10px #f00;
  }
  to {
    box-shadow: 0 0 10px #ff0;
  }
}
</style>