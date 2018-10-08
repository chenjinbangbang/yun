<template>
    <div ref="files" style="height: 400px;"></div>
</template>

<style lang="scss">
</style>

<script>
import { files } from "@/api/chart";
export default {
  props: ["info"],
  data() {
    return {
      origin: "",
      once: true
    };
  },
  mounted() {
    this.getdata(this.info);
  },
  watch: {
    info: function() {
      this.getdata(this.info);
    }
  },
  methods: {
    getdata(val) {
      files(val).then(result => {
        if (result.data.length > 0) {
          this.origin = this.arranged(result.data);
          if (this.once) {
            this.getCharts();
            this.once = false;
          } else {
            this.change();
          }
        } else {
          this.$message.error({
            message: "未获取到该城市节点文件数据！",
            center: true
          });
        }
      });
    },
    arranged(data) {
      let nodes = [[], []];
      data.forEach(val => {
        nodes[0].push(val.node_name);
        nodes[1].push(val.num);
      });
      return nodes;
    },
    getCharts() {
      let self = this;
      let dom = this.$refs.files;
      let myChart = this.$echarts.init(dom);

      let color = [
        "#404a59",
        "#ccc",
        "#fff",
        "#ffe052",
        "#2dffd8",
        "#ff61ae",
        "#2a333d",
        "#76a3fe",
        "#006ebd",
        "#2cc08e",
        "#ffb171",
        "#ff687b"
      ];
      let jbc = [{ offset: 0, color: color[8] }, { offset: 1, color: color[9] }];

      let option = {
        backgroundColor: color[0],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          right: "6%",
          top: "10%",
          left: "6%",
          bottom: "10%"
        },
        xAxis: {
          type: "value",
          name: '文件数',
          minInterval: 1,
          axisLine: {
            lineStyle: {
              color: color[1]
            }
          }
        },
        yAxis: {
          type: "category",
          name: '节点名',
          axisLine: {
            lineStyle: {
              color: color[1]
            }
          },
          data: this.origin[0]
        },
        color: ["#00a65a"],
        series: [
          {
            name: '文件统计',
            type: "bar",
            data: this.origin[1],
            itemStyle: {
              normal: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, jbc)
              }
            },
            label: {
              normal: {
                show: true,
                formatter: "{b}: {c}"
              }
            }
          }
        ]
      };

      myChart.setOption(option, true);

      this.change = function() {
        myChart.setOption({
          yAxis: {
            data: this.origin[0]
          },
          series: [
            {
              data: this.origin[1]
            }
          ]
        });
      };
    }
  }
};
</script>


