<template>
    <div class='system'>

        <h2>系统设置</h2>

        <el-form :model="dataForm" ref="dataForm" labelWidth="180px" :rules="rules">
            <el-form-item label="smtp服务器ip地址：" prop="smtp_ip">
                <el-input v-model="dataForm.smtp_ip"></el-input>
            </el-form-item>
            <el-form-item label="smtp服务器端口：" prop="smtp_port">
                <el-input v-model="dataForm.smtp_port"></el-input>
            </el-form-item>
            <el-form-item label="用户名：" prop="username">
                <el-input v-model="dataForm.username"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input type="password" v-model="dataForm.password"></el-input>
            </el-form-item>
            <el-form-item>
                <p class='blue'>用于找回密码时发送必要信息，系统通知时发送邮件</p>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="saveForm">保 存</el-button>
                <el-button type="info" @click="resetForm">重 置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang='scss'>
.system {
  h2 {
    font-weight: normal;
    text-align: center;
    margin: 50px 0;
  }
  .el-form {
    width: 600px;
    margin: auto;
  }
}
</style>

<script>
import rules from "@/base/rules";
import { smtpSetting } from "@/api/system";
export default {
  name: "system",
  components: {},
  data() {
    return {
      dataForm: { smtp_ip: "", smtp_port: "", username: "", password: "" },
      rules: {
        smtp_ip: [
          {
            required: true,
            message: "smtp服务器ip地址不能为空！",
            trigger: "blur"
          },
          { validator: rules.ip, trigger: "blur" }
        ],
        smtp_port: [
          {
            required: true,
            message: "smtp服务器端口不能为空！",
            trigger: "blur"
          },
          { validator: rules.port, trigger: "blur" }
        ],
        username: [
          { required: true, message: "用户名不能为空！", trigger: "blur" }
        ],
        password: [
          { required: true, message: "密码不能为空！", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //点击修改
    saveForm() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          smtpSetting(this.dataForm).then(res => {
            if (res.error_code === 0) {
              this.$notify({
                title: "成功",
                message: "修改密码成功",
                type: "success",
                duration: 2000
              });
            }
          });
        }
      });
    },
    //重置
    resetForm() {
      this.$refs.dataForm.resetFields();
    }
  }
};
</script>
