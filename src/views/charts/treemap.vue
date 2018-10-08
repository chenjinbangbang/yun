<template>
    <div class="treemap">
        <div ref="meta" style="height: 35%">1</div>
        <div ref="gate" style="height: 45%">2</div>
        <div ref="node" style="height: 20%">3</div>
        <el-dialog title="节点文件统计" :visible.sync="visible" :closeOnClickModal="false" class="dialogbg">
            <count height='400px' width='100%' :info='filesdata' ></count>
        </el-dialog>
    </div>
</template>

<script>
import axios from "axios";
import { treemapmds, treemapsgw, treemapnode } from "@/api/chart";
import { getLocation } from "@/api/region";
import Count from "@/components/Charts/count";
import json from "@/views/charts/icon.json";

export default {
  name: "tree",
  components: { Count },
  data() {
    return {
      icons: json, //图标数据
      visible: false,
      metadata: "",
      gatedata: "",
      nodedata: "",
      filesdata: "",
      cityinfo: []
    };
  },
  mounted() {
    let self = this;
    let paraid = sessionStorage.getItem("regionID");
    axios
      .all([
        treemapmds(paraid),
        treemapsgw(paraid),
        treemapnode(paraid),
        getLocation()
      ])
      .then(
        axios.spread(function(meta, gate, node, location) {
          self.metadata = meta;
          self.gatedata = gate;
          self.nodedata = node;
          location.data.forEach(function(citylist) {
            citylist.children.forEach(function(cityinfo) {
              self.cityinfo.push({
                cityname: cityinfo.location,
                cityid: cityinfo.location_id
              });
            });
          });
          self.getCharts();
        })
      );
  },
  methods: {
    getCharts() {
      let self = this;
      var dom = [this.$refs.meta, this.$refs.gate, this.$refs.node];
      var myChart = [
        this.$echarts.init(dom[0]),
        this.$echarts.init(dom[1]),
        this.$echarts.init(dom[2])
      ];
      var eachdata = ["meta", "gate", "node"];
      var colors = {
        meta: ["#277680"],
        gate: ["#54575c"],
        node: ["#487560"],
        err: ["#c23531"],
        warn: ["#c4ccd3"]
      };

      //模拟数据
      var gate = {
        error_code: 0,
        data: {
          children: [
            {
              name: "存储代理1",
              ip: "2.2.2.2",
              id: 2,
              cpu: 34,
              state: 0,
              memoryused: 4.5,
              memorytotal: 12,
              diskused: 179,
              disktotal: 3072,
              diskin: 20,
              diskout: 10,
              networkin: 4.1,
              networkout: 2.6
            },
            {
              name: "存储代理2",
              ip: "3.3.3.3",
              id: 3,
              cpu: 51,
              state: 0,
              memoryused: 6.3,
              memorytotal: 12,
              diskused: 649,
              disktotal: 3072,
              diskin: 20,
              diskout: 10,
              networkin: 2.2,
              networkout: 2.9
            },
            {
              name: "存储代理3",
              ip: "4.4.4.4",
              id: 4,
              cpu: 94,
              state: 1,
              memoryused: 11,
              memorytotal: 12,
              diskused: 2649,
              disktotal: 3072,
              diskin: 20,
              diskout: 10,
              networkin: 1.2,
              networkout: 5.3
            }
          ]
        }
      };

      //label层级富文本配置
      var labelstyle = {
        show: true,
        rich: {
          budget: {
            fontSize: 12,
            lineHeight: 20,
            color: "#ff0"
          },
          household: {
            fontSize: 12,
            color: "#fff"
          },
          label: {
            fontSize: 9,
            backgroundColor: "rgba(0,0,0,0.3)",
            color: "#fff",
            borderRadius: 2,
            padding: [2, 4],
            align: "center"
          },
          name: {
            fontSize: 12,
            color: "#fff",
            lineHeight: 22
          },
          hr: {
            width: "100%",
            borderColor: "rgba(255,255,0,0.2)",
            borderWidth: 0.5,
            height: 0,
            lineHeight: 10
          },
          cpu: {
            height: 24,
            align: "right",
            backgroundColor: {
              image: this.icons.cpu
            }
          },
          memory: {
            height: 24,
            align: "right",
            backgroundColor: {
              image: this.icons.memory
            }
          },
          disk: {
            height: 24,
            align: "right",
            backgroundColor: {
              image: this.icons.disk
            }
          },
          network: {
            height: 24,
            align: "right",
            backgroundColor: {
              image: this.icons.network
            }
          }
        }
      };

      //返回层级配置
      function getLevelOption() {
        return [
          {
            itemStyle: {
              normal: {
                borderColor: "#404a59",
                borderWidth: 0,
                gapWidth: 10
              }
            },
            upperLabel: {
              normal: {
                show: false
              }
            }
          },
          {
            itemStyle: {
              normal: {
                borderColor: "#404a59",
                borderWidth: 10,
                gapWidth: 6
              }
            },
            upperLabel: {
              normal: {
                fontSize: 16
              }
            }
          },
          {
            label: {
              normal: labelstyle
            },
            itemStyle: {
              normal: {
                borderWidth: 5,
                gapWidth: 4,
                borderColorSaturation: 0.6
              }
            }
          },
          {
            label: {
              normal: labelstyle
            }
          }
        ];
      }

      //返回图标类型
      function icon(name) {
        if (name.indexOf("CPU") > -1) {
          return "cpu";
        } else if (name.indexOf("内存") > -1) {
          return "memory";
        } else if (name.indexOf("磁盘") > -1) {
          return "disk";
        } else if (name.indexOf("网络") > -1) {
          return "network";
        }
      }

      //返回富文本模版
      var textformat = function(params) {
        var currency = [
          "{name|" + params.name + "}    {" + icon(params.name) + "|}",
          "{hr|}"
        ];

        if (params.name.indexOf("磁盘") > -1) {
          currency = currency.concat([
            "{budget|读取：" + params.value[2] + "Mbps}",
            "{budget|写入：" + params.value[1] + "Mbps}"
          ]);
          if (params.treePathInfo[1].name == "存储代理") {
            currency = currency.concat([
              "{budget|已用：" +
                parseInt(params.value[3] / params.value[4] * 100) +
                "%} {label|" +
                (params.value[3] > 1e3
                  ? (params.value[3] / 1024).toFixed(2)
                  : params.value[3]) +
                (params.value[3] > 1e3 ? "TB}" : "GB}"),
              "{budget|未用：" +
                parseInt(
                  (params.value[4] - params.value[3]) / params.value[4] * 100
                ) +
                "%} {label|" +
                (params.value[4] - params.value[3] > 1e3
                  ? ((params.value[4] - params.value[3]) / 1024).toFixed(2)
                  : params.value[4] - params.value[3]) +
                (params.value[4] - params.value[3] > 1e3 ? "TB}" : "GB}")
            ]);
          }
        } else if (params.name.indexOf("内存") > -1) {
          currency = currency.concat([
            "{budget|已用：" +
              parseInt(params.value[1] / params.value[2] * 100) +
              "%} {label|" +
              (params.value[1] > 1e3
                ? (params.value[1] / 1024).toFixed(2)
                : params.value[1]) +
              (params.value[1] > 1e3 ? "TB}" : "GB}"),
            "{budget|未用：" +
              parseInt(
                (params.value[2] - params.value[1]) / params.value[2] * 100
              ) +
              "%} {label|" +
              (params.value[2] - params.value[1] > 1e3
                ? ((params.value[2] - params.value[1]) / 1024).toFixed(2)
                : (params.value[2] - params.value[1]).toFixed(2)) +
              (params.value[2] - params.value[1] > 1e3 ? "TB}" : "GB}")
          ]);
        } else if (params.name.indexOf("CPU") > -1) {
          currency = currency.concat([
            "{budget|已使用：" + params.value[1] + "%}"
          ]);
        } else if (params.name.indexOf("网络") > -1) {
          currency = currency.concat([
            "{budget|发送：" + params.value[1] + "Mbps}",
            "{budget|接收：" + params.value[2] + "Mbps}"
          ]);
        } else {
          currency = currency.concat([
            "{budget|城市节点数：" + params.value[1] + "个}"
          ]);
        }

        return currency.join("\n");
      };

      //返回服务器状态色
      function state(val) {
        if (
          val.cpu / 100 > 0.9 ||
          val.diskused / val.disktotal > 0.9 ||
          val.memoryused / val.memorytotal > 0.9
        ) {
          return colors["err"];
        } else {
          return [];
        }
      }

      //返回格式化后的metahuo或gate数据
      function metagate(origin) {
        var back = [];
        if (origin.data.children.length > 0) {
          origin.data.children.forEach(function(val, n) {
            var mod = {
              name: val.ip,
              color: state(val),
              ip: val.ip,
              value: 1000,
              children: [
                {
                  name: "CPU情况",
                  id: val.id,
                  value: [10, val.cpu],
                  backtip: true, //是否返回鼠标提示
                  label: {
                    normal: {
                      formatter: textformat
                    }
                  }
                },
                {
                  name: "内存情况",
                  id: val.id,
                  value: [10, val.memoryused, val.memorytotal],
                  backtip: true,
                  label: {
                    normal: {
                      formatter: textformat
                    }
                  }
                },
                {
                  name: "磁盘情况",
                  id: val.id,
                  value: [
                    10,
                    val.diskin,
                    val.diskout,
                    val.diskused,
                    val.disktotal
                  ],
                  backtip: true,
                  label: {
                    normal: {
                      formatter: textformat
                    }
                  }
                },
                {
                  name: "网络情况",
                  id: val.id,
                  value: [10, val.networkin, val.networkout],
                  backtip: true,
                  label: {
                    normal: {
                      formatter: textformat
                    }
                  }
                }
              ]
            };
            back.push(mod);
          });
        } else {
          back.push({
            name: "暂无数据",
            value: 404
          });
        }
        return back;
      }
      //返回格式化后的node数据
      function nodefun(origin) {
        var back = [];
        if (origin.data.children.length > 0) {
          origin.data.children.forEach(function(val, n) {
            var mod = {
              name: val.cityname,
              value: [4, val.num],
              backtip: true,
              label: {
                normal: {
                  formatter: textformat
                }
              }
            };
            back.push(mod);
          });
        }
        return back;
      }

      //格式化后的数据结构
      var datas = {
        meta: [
          {
            name: "区域中心",
            children: metagate(self.metadata)
          }
        ],
        gate: [
          {
            name: "存储代理",
            children: metagate(self.gatedata)
          }
        ],
        node: [
          {
            name: "城市节点",
            value: 500,
            children: nodefun(self.nodedata)
          }
        ]
      };

      function options(type) {
        return {
          backgroundColor: "#404a59",
          color: colors[type],
          tooltip: {
            show: false,
            formatter: "点击查看详情"
          },
          series: [
            {
              //name: "深圳",
              roam: false,
              width: "100%",
              height: "100%",
              top: 0,
              squareRatio: 1,
              nodeClick: false,
              breadcrumb: {
                show: false
              },
              type: "treemap",
              visibleMin: 1,
              label: {
                normal: {
                  show: true,
                  formatter: "{b}"
                }
              },
              upperLabel: {
                normal: {
                  show: true,
                  formatter: "{b}",
                  height: 40
                }
              },
              levels: getLevelOption(),
              data: datas[type]
            }
          ]
        };
      }

      eachdata.forEach(function(obj, v) {
        myChart[v].setOption(options(obj));
        myChart[v].on("click", function(params) {
          if (params.data.id && params.data.backtip) {
            self.link(
              params.data.id,
              params.treePathInfo[1].name == "区域中心" ? "mds" : "sgw"
            );
          } else if (params.data.backtip) {
            self.cityinfo.forEach(function(val) {
              if (val.cityname.indexOf(params.name) > -1) {
                self.visible = true;
                self.filesdata = {
                  region_id: sessionStorage.getItem("regionID"),
                  location_id: val.cityid
                };
              }
            });
          }
        });
      });
    },
    link(id, type) {
      if (id) {
        sessionStorage.setItem("ChartID", id);
        sessionStorage.setItem("ChartType", type);
        this.$router.push({
          path: "/status/metadata"
        });
      } else {
        this.$router.push({
          path: "/center/client"
        });
      }
    }
  }
};
</script>
<style lang="scss">
.treemap {
  background-color: #404a59 !important;
  height: calc(100% - 60px);
}
.dialogbg .el-dialog {
  background-color: #404a59;
}
.dialogbg .el-dialog .el-dialog__title {
  color: #ff0;
}
</style>

