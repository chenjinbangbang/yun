<template>
    <div class="chart">
        <el-dialog title="当前区域拓扑图" :visible.sync="visible" :closeOnClickModal="false">
            <topology height='400px' width='100%' :info='topology'></topology>
        </el-dialog>
        <div class="show-temp sp">
            <table>
                <tr><th colspan="2">总体统计信息</th></tr>
                <tr v-for="(value, key) in info"><td>{{ key }}</td><td>{{ value }}</td></tr>
            </table>
        </div>
        <div ref="myChart" class="myChart"></div>
    </div>
</template>

<script>
import axios from "axios";
import request from "@/utils/request";
import { maps, choice, stat } from "@/api/chart";
import "echarts/map/js/china";
import Topology from "@/components/Charts/topology";
import json from "@/mock/zuobiao.json";
export default {
  name: "chart",
  components: { Topology },
  data() {
    return {
      info: "", //统计信息
      visible: false, //是否显示拓扑图
      inter: [], //区域中心信息
      topology: [], //拓扑图参数
      options: "", //保存所有初始内容
      metadataName: "",
      mnsj: "",
      city: [],
      myMap: {}, //保存城市网点数据
      geoCoordMap: "" //初始化城市经纬度坐标
    };
  },
  mounted() {
    choice().then(result => {
      let self = this;
      this.geoCoordMap = json;
      this.options = result.data.results;
      this.options.forEach(function(val, n) {
        self.inter.push([val.region_id, val.location, val.regionName]);
      });
      this.inter.forEach(this.getinfo);
    });
    stat().then(result => {
      this.info = {
        区域数量: result.data.metadata_num,
        客户端数量: result.data.client_num,
        存储代理数量: result.data.gateway_num,
        当前文件数量: result.data.business_num
      };
    });
  },
  methods: {
    getinfo(data, n) {
      let self = this;
      maps(data[0])
        .then(result => {
          //获取城市节点信息
          result.data.client_city.forEach(function(val, index) {
            if (val.children) {
              let node = "";
              val.children.forEach(function(data, i) {
                node +=
                  "<tr><td>" +
                  data.name +
                  "</td><td>" +
                  data.value +
                  "</td></tr>";
              });
              let dom =
                "<table class='show-temp'><tr><th>网点名</th><th>连接数</th></tr>" +
                node +
                "</table>";
              self.myMap[val.city_name] = dom;
            }
          });
          //添加地图数据
          this.city.push([
            result.data.city_name,
            this.arrangement(result.data)
          ]);
          if (this.city.length == this.inter.length) {
            this.getCharts();
          }
        })
        .catch(err => {
          alert("区域中心数据有误！");
          if (this.city.length == this.inter.length) {
            this.getCharts();
          }
        });
    },
    nodeinfo() {
      console.log(this.inter);
    },
    arrangement(data) {
      let citydata = [];
      data.client_city.forEach(function(val, index) {
        citydata.push([
          { name: data.city_name },
          { name: val.city_name, value: val.value }
        ]);
      });
      return citydata;
    },
    getCharts() {
      let chart = this.$refs.myChart;
      let myChart = this.$echarts.init(chart);
      let self = this;
      let show = "";

      // if(this.city[1].length == 0){
      //     show = {
      //         normal: {
      //             show: true,
      //             position: 'right',
      //             formatter: '{b}'
      //         }
      //     }
      // }else{
      //     show = ""
      // }

      //返回图例
      function legend(val) {
        let arr = [];
        val.forEach(name => {
          arr.push(name[0]);
        });
        return arr;
      }

      //返回城市经纬度
      function bccity(name) {
        let coordinate;
        $.each(self.geoCoordMap, function(a, b) {
          if (name.indexOf(a) > -1) {
            coordinate = b;
          }
        });
        return coordinate;
      }

      //返回城市关联线
      let convertData = function(data) {
        let res = [];
        for (let i = 0; i < data.length; i++) {
          let dataItem = data[i];
          let fromCoord = bccity(dataItem[0].name);
          let toCoord = bccity(dataItem[1].name);

          if (fromCoord && toCoord) {
            res.push({
              fromName: dataItem[0].name,
              toName: dataItem[1].name,
              coords: [toCoord, fromCoord]
            });
          }
        }
        return res;
      };

      let color = ["#fbe52d", "#a6c84c", "#50cfe2", "#ed6a57", "#d78cf8"];

      let series = [];
      //渲染地图
      function serdata(city, i) {
        series.push(
          {
            name: city[0],
            type: "lines",
            zlevel: 1,
            effect: {
              show: true,
              period: 6,
              trailLength: 0.4,
              color: "#fff",
              symbolSize: 3
            },
            silent: true,
            lineStyle: {
              normal: {
                color: color[i + 1],
                width: 0,
                curveness: 0.2
              }
            },
            data: convertData(city[1])
          },
          {
            name: city[0],
            type: "lines",
            zlevel: 2,
            symbol: "none",
            symbolSize: 10,
            effect: {
              show: true,
              period: 6,
              trailLength: 0,
              symbol: "arrow",
              symbolSize: 8
            },
            silent: true,
            lineStyle: {
              normal: {
                color: color[i + 1],
                width: 1,
                opacity: 0.6,
                curveness: 0.2
              }
            },
            data: convertData(city[1])
          },
          {
            name: city[0],
            type: "effectScatter",
            coordinateSystem: "geo",
            zlevel: 2,
            rippleEffect: {
              brushType: "stroke"
            },
            label: {
              normal: {
                show: true,
                position: "right",
                formatter: "{b}"
              }
            },
            symbolSize: val => {
              return (val[2] / 2 + 20) / 2;
              //return val[2] / 8;
            },
            itemStyle: {
              normal: {
                color: color[i + 1]
              }
            },
            data: city[1].map(dataItem => {
              let obj = {
                name: dataItem[1].name,
                value: bccity(dataItem[1].name).concat([dataItem[1].value])
              };
              return obj;
            })
          },
          {
            name: city[0],
            type: "effectScatter",
            coordinateSystem: "geo",
            zlevel: 2,
            label: {
              normal: {
                show: true,
                position: "right",
                formatter: "{b}"
              }
            },
            symbol: "pin",
            symbolSize: 20,
            itemStyle: {
              normal: {
                color: color[0]
              }
            },
            data: [
              {
                name: city[0],
                value: bccity(city[0])
              }
            ]
          }
        );
      }
      this.city.forEach(serdata);

      let option = {
        backgroundColor: "#404a59",
        title: {
          text: "全国区域中心分布图",
          //subtext: '',
          top: "30px",
          left: "center",
          textStyle: {
            color: "#fff"
          }
        },
        tooltip: {
          trigger: "item",
          formatter: function(params) {
            return self.myMap[params.name];
          }
        },
        legend: {
          top: 80,
          left: "center",
          data: legend(this.city),
          textStyle: {
            color: "#fff"
          },
          selectedMode: "multiple"
        },
        geo: {
          map: "china",
          label: {
            emphasis: {
              show: false,
              color: "#fff"
            }
          },
          roam: true,
          itemStyle: {
            normal: {
              areaColor: "#323c48",
              borderColor: "#404a59"
            },
            emphasis: {
              areaColor: "#2a333d"
            }
          }
        },
        series: series
      };

      myChart.setOption(option);

      myChart.on("click", function(data) {
        console.log(data);
        if (data.name == data.seriesName) {
          self.inter.forEach((val, n) => {
            if (val[1].indexOf(data.name) > -1) {
              self.topology.splice(0, self.topology.length);
              self.visible = true;
              self.topology = JSON.parse(JSON.stringify(val));
            }
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.chart {
  height: calc(100% - 60px);
  padding: 0 !important;
  position: relative;
  background-color: #404a59 !important;
  .myChart {
    width: 100%;
    min-height: 100%;
  }
  .show-temp {
    text-align: center;
    width: 100%;
    border: none;
  }
}
.selects {
  position: absolute;
  z-index: 999;
  right: 20px;
  top: 20px;
  background-color: #323c48;
  color: #fff;
  outline: none;
  border-color: #2a333d;
  min-width: 70px;
  height: 30px;
  line-height: 30px;
  padding-left: 4px;
  border-radius: 5px;
}
</style>
<style lang="scss">
.chart {
  .sp {
    position: absolute;
    z-index: 999;
    bottom: 20px;
    right: 20px;
    width: auto !important;
    padding: 6px;
    border-radius: 6px;
    background-color: rgba(50, 50, 50, 0.7);
  }
  th,
  td {
    height: 34px;
    line-height: 34px;
    padding: 0 14px;
    background-color: #222427;
    text-align: center;
    color: #fff;
  }
  th {
    border-bottom: 2px solid #00707f;
    font-size: 14px;
  }
  td {
    border-bottom: 1px solid #36393e;
    font-size: 12px;
  }
}
</style>

