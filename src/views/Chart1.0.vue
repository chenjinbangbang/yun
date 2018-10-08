<template>
    <div class="chart">
        <el-dialog title="当前区域拓扑图" :visible.sync="visible" :closeOnClickModal="false">
            <topology height='400px' width='100%' :info='inter'></topology>
        </el-dialog>
        <div class="show-temp sp">
            <table>
                <tr><th colspan="2">总体统计信息</th></tr>
                <tr v-for="(value, key) in info"><td>{{ key }}</td><td>{{ value }}</td></tr>
            </table>
        </div>
        <select v-model="inter[0]" class="selects" v-show="spread" >
            <option v-for="option in options" v-bind:value="option.id">
                {{ option.regionName }}
            </option>
        </select>
        <div ref="myChart" class="myChart"></div>
    </div>
</template>

<script>
import { maps, choice, stat } from "@/api/chart";
import "echarts/map/js/china";
import Topology from "@/components/Charts/topology";
import json from "@/mock/zuobiao.json";
export default {
  name: "chart",
  components: { Topology },
  data() {
    return {
      info: "",
      visible: false,
      inter: [],
      options: "", //保存所有初始内容
      metadataName: "",
      mnsj: "",
      city: [],
      myMap: {},
      once: true, //是否第一次加载
      geoCoordMap: "", //初始化城市经纬度坐标
      spread: false //是否铺开地图信息
    };
  },
  mounted() {
    choice().then(result => {
      this.geoCoordMap = json;
      this.options = result.data.results;
      this.inter.push(result.data.results[0].id);
      this.inter.push(result.data.results[0].location);
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
  watch: {
    inter: {
      handler: function() {
        maps(this.inter[0]).then(result => {
          let self = this;
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
          self.city = [result.data.city_name, this.arrangement(result.data)];
          if (this.once) {
            this.getCharts();
            this.once = false;
          } else {
            this.change();
          }
        });
      },
      deep: true
    }
  },
  methods: {
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

      function bccity(name) {
        let coordinate;
        $.each(self.geoCoordMap, function(a, b) {
          if (name.indexOf(a) > -1) {
            coordinate = b;
          }
        });
        return coordinate;
      }

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

      let color = ["#fbe52d", "#a6c84c", "#50cfe2"];

      let series = [];
      //渲染客户端城市及相关效果
      function city(city) {
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
                color: color[1],
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
                color: color[1],
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
                color: color[1]
              }
            },
            data: city[1].map(dataItem => {
              let obj = {
                name: dataItem[1].name,
                value: bccity(dataItem[1].name).concat([dataItem[1].value])
              };
              return obj;
            })
          }
        );
      }
      //返回区域城市
      function region(city) {
        if (self.spread) {
          return [
            {
              name: city[0],
              value: bccity(city[0])
            }
          ];
        } else {
          let regions = [];
          self.options.forEach(function(val) {
            regions.push({
              name: val.location,
              value: bccity(val.location),
              id: val.id
            });
          });
          return regions;
        }
      }
      //渲染区域城市
      function serdata(city) {
        series.push({
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
          data: region(city)
        });
      }
      serdata(this.city);

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
        geo: {
          map: "china",
          label: {
            emphasis: {
              show: false
            }
          },
          roam: false,
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

      this.change = function() {
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
        series.splice(0, series.length);
        city(this.city);
        serdata(this.city);
        myChart.setOption({
          series: series
        });
      };

      myChart.on("click", function(data) {
        if (!self.spread) {
          self.inter.splice(0, 1, data.data.id);
          self.spread = true;
        }
        if (data.name == data.seriesName && self.spread) {
          self.visible = true;
          self.inter.pop();
          self.inter.push(data.name);
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

