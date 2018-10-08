<template>
  <div class="chart">
    <lines height='300px' width='100%' :info='linecpu' :para='inter.cpu'></lines>
    <lines height='300px' width='100%' :info='linememory' :para='inter.memory'></lines>
    <lines height='300px' width='100%' :info='linein' :para='inter.in'></lines>
    <lines height='300px' width='100%' :info='lineout' :para='inter.out'></lines>
    <!--<disk height='300px' width='100%' :info='disk' :para='inter'></disk>
    <count height='400px' width='100%' :info='nodes' :para='inter' @city="fileNum" style="float:left"></count>
    <count height='400px' width='100%' :info='files' :para='cityname' style="float:right"></count> -->
  </div>
</template>

<style lang="scss" scoped>
.el-tabs__content {
  overflow: visible;
}
.chart {
  padding: 0 !important;
  background-color: #404a59 !important;
  position: relative;
}
</style>

<script>
import { monitorchart } from "@/api/chart";
import Lines from "@/components/Charts/lines";
import Disk from "@/components/Charts/disk";
import Count from "@/components/Charts/count";

export default {
  name: "Chart",
  components: { Lines, Disk, Count },
  data() {
    return {
      linecpu: ["cpu", "CPU使用率", "CPU使用率/100%"],
      linememory: ["memory", "内存使用量", "内存使用量/MB"],
      lineout: ["out", "网络输出", "网络输出/Mbps"],
      linein: ["in", "网络输入", "网络输入/Mbps"],
      disk: ["disk", "磁盘信息", "容量/GB"],
      nodes: ["nodes", "各城市节点数", "节点城市", "节点统计"],
      files: ["files", "节点文件统计", "节点名", "文件统计"],
      inter: ""
    };
  },
  mounted() {
    monitorchart({ id: sessionStorage.getItem('ChartID'), type: sessionStorage.getItem('ChartType') }).then(res => {
      let self = this;
      this.inter = res.data;
      let num = res.data.cpu[2].length;
      setInterval(function() {
        monitorchart({ id: sessionStorage.getItem('ChartID'), type: sessionStorage.getItem('ChartType'), length: num }).then(res => {
          self.inter = res.data;
          num += res.data.cpu[0].length;
        });
      }, 300000);
    });
  },
  methods: {}
};
</script>


