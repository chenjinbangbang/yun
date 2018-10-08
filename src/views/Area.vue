<template>
    <div class='area'>

        <div class="dataForm">
            <el-dialog  :title="operate === 0 ? '添加区域' : '修改区域'" :visible.sync="visible" :closeOnClickModal="false" :beforeClose="handleClose">
                <el-form :model="dataForm" ref="dataForm" :rules="rules" labelWidth="150px">
                    <el-form-item label="区域名称：" prop="areaName">
                        <el-input v-model="dataForm.areaName"></el-input>
                    </el-form-item>
                    <el-form-item label="区域地区：" prop="areaAddress">
                        <el-cascader :options="regionOptions" v-model="dataForm.areaAddress" @change="addressChange"></el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址：" prop="areaStreet">
                        <el-input v-model="dataForm.areaStreet"></el-input>
                    </el-form-item>
                    <el-form-item label="区域数据库ip：" prop="dbIp">
                        <el-input v-model="dataForm.dbIp"></el-input>
                    </el-form-item>
                    <el-form-item label="区域数据库端口：" prop="dbPort">
                        <el-input v-model="dataForm.dbPort"></el-input>
                    </el-form-item>
                    <el-form-item label="区域数据库ip：" prop="msIp">
                        <el-input v-model="dataForm.msIp"></el-input>
                    </el-form-item>
                    <el-form-item label="区域数据库端口：" prop="msPort">
                        <el-input v-model="dataForm.msPort"></el-input>
                    </el-form-item>
                    <!--<el-form-item label="客户端数量：" prop="clientNum">
                        <el-slider v-model="dataForm.clientNum" showInput></el-slider>
                    </el-form-item>
                    <el-form-item label="存储代理数量：" prop="storageAgencyNum">
                        <el-slider v-model="dataForm.storageAgencyNum" showInput></el-slider>
                    </el-form-item>
                    <el-form-item label="存储服务器数量：" prop="storageServerNum">
                        <el-slider v-model="dataForm.storageServerNum" showInput></el-slider>
                    </el-form-item>-->
                    <el-form-item label="状态：" prop="status">
                        <el-radio-group v-model="dataForm.status">
                            <el-radio label="使用">使用</el-radio>
                            <el-radio label="停用">停用</el-radio>
                            <el-radio label="维护">维护</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="saveForm">保 存</el-button>
                        <el-button type="info" @click="resetForm">取 消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>

        <div class="title">
            <h2>区域列表</h2>
            <div class="search">
                <el-input v-model="search" placeholder="区域名称" prefixIcon="el-icon-search" @keyup.enter.native="searchClick"></el-input>
                <el-button type="primary" @click="searchClick" icon="el-icon-search">{{$t('table.search')}}</el-button>
            </div>
            <el-button type="primary" @click="addRow" icon="el-icon-plus" v-if="this.$store.getters.roles.some(role=>'admin'.indexOf(role)>=0)">{{$t('table.add')}}</el-button>
        </div>

        <main class="tableLists">
            <el-table :data="currentTableLists" border style="width:100%" v-loading="loading">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="areaName" label="区域名称"></el-table-column>
                <el-table-column label="区域地址" width="200">
                    <template slot-scope="scope">
                        <span>{{scope.row.areaAddress[0]}} {{scope.row.areaAddress[1]}} {{scope.row.areaAddress[2]}}</span>
                        <span>{{scope.row.areaStreet}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="dbIp" label="区域数据库ip"></el-table-column>
                <el-table-column prop="dbPort" label="区域数据库端口"></el-table-column>
                <el-table-column prop="msIp" label="区域服务器ip"></el-table-column>
                <el-table-column prop="msPort" label="区域服务器端口"></el-table-column>
                <el-table-column prop="clientNum" label="客户端数量">
                    <template slot-scope="scope">
                        <router-link to="/home/client">
                            <el-button type="text">{{scope.row.clientNum}}</el-button>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="storageAgencyNum" label="存储代理数量">
                    <template slot-scope="scope">
                        <router-link to="/home/storage-agency">
                            <el-button type="text">{{scope.row.storageAgencyNum}}</el-button>
                        </router-link>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="storageServerNum" label="存储服务器数量"></el-table-column>-->
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="editRow(scope.row.id)" icon="el-icon-edit">{{$t('table.edit')}}</el-button>
                        <el-button type="danger" size="mini" @click.native.prevent="deleteRow(scope.row.id)" icon="el-icon-delete">{{$t('table.delete')}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </main>

        <div class="page">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10,20,50,100]"
                :page-size="pageSize"
                layout="total,sizes,prev,pager,next,jumper"
                :total="tableLists.length">
            </el-pagination>
        </div>

    </div>
</template>

<style lang='scss'>
    .area{}
</style>

<script>
    import Area from '../../static/area.json'; //获取中国省市区三级联json格式
    export default {
        name: 'area1',
        components: {},
        data() {
            //ip验证
            let ip = (rule,value,callback) => {
                let valReg = /((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))/;
                if(!valReg.test(value)){
                    callback(new Error('输入ip地址格式有误！'));
                }else{
                    callback();
                }
            };
            //端口号验证
            let port = (rule,value,callback) => {
                let valReg = /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/;
                if(!valReg.test(value)){
                    callback(new Error('输入端口号格式有误！'));
                }else{
                    callback();
                }
            };
            return {
                //表格数据
                tableLists: [],
                //表单数据
                //dataForm: {id: null,areaName: '深圳1',areaAddress: ["广东","深圳","宝安区"],areaStreet: '西乡大道天虹商场',dbIp: '0.0.0.0',dbPort: '8080',msIp: '0.0.0.0',msPort: '8000',clientNum: 10,storageAgencyNum: 20,storageServerNum: 30,status: '使用'},
                dataForm: {id: null,areaName: '',areaAddress: [],areaStreet: '',dbIp: '',dbPort: '',msIp: '',msPort: '',clientNum: 0,storageAgencyNum: 0,storageServerNum: 0,status: '使用'},
                visible: false, //表单显示与隐藏
                regionOptions: [], //中国省市区三级联级联选择器
                editIndex: 0, //点击修改的是哪个索引
                operate: 0, //判断用户是添加（0）还是修改数据（1）
                loading: true, //数据加载
                //查询
                search: '', //关键字查询字段
                query: {}, //所有查询条件
                //表格当前分页数据
                currentTableLists: [],
                pageSize: 10, //一页有多少条数据
                currentPage: 1, //当前页
                //表单验证
                rules: {
                    areaName: [
                        {required: true,message: '区域名称不能为空！',trigger: 'blur'}
                    ],
                    areaAddress: [
                        {required: true,message: '区域地区不能为空！',trigger: 'blur'}
                    ],
                    areaStreet: [
                        {required: true,message: '详细地址不能为空！',trigger: 'blur'}
                    ],
                    dbIp: [
                        {required: true,message: '区域数据库ip不能为空！',trigger: 'blur'},
                        {validator: ip,trigger: 'blur'}
                    ],
                    dbPort: [
                        {required: true,message: '区域数据库端口不能为空！',trigger: 'blur'},
                        {validator: port,trigger: 'blur'}
                    ],
                    msIp: [
                        {required: true,message: '区域服务器ip不能为空！',trigger: 'blur'},
                        {validator: ip,trigger: 'blur'}
                    ],
                    msPort: [
                        {required: true,message: '区域服务器端口不能为空！',trigger: 'blur'},
                        {validator: port,trigger: 'blur'}
                    ]
                },
            }
        },
        filters: {
            statusFilter(status){
                const statusMap = {
                    "使用": "success",
                    "停用": "danger",
                    "维护": "warning"
                };
                return statusMap[status];
            }
        },
        mounted(){
            //获取中国省市区三级联级联选择器
            this.getArea();
            //获取表格数据
            this.getTableLists();
        },
        methods: {
            //获取中国省市区三级联级联选择器
            getArea(){
                for(let x of Area){ //获取省份
                    let city = [];
                    for(let y of x.city){ //获取城市
                        let area = [];
                        for(let z of y.area){ //获取地区
                            area.push({value: z,label: z});
                        }
                        city.push({value: y.name,label: y.name,children: area});
                    }
                    this.regionOptions.push({value: x.name,label: x.name,children: city});
                }
            },
            //三级联地址改变
            addressChange(value){
                this.dataForm.areaAddress = value;
            },
            /*----------------------表单数据与操作--------------------*/
            //获取表格数据
            getTableLists(){
                this.$http.get("http://localhost:3000/areas").then((result) => {
                    this.tableLists = result.data;

                    //获取当前分页表格数据
                    this.tableListsChange();
                });
            },
            //点击添加数据
            addRow(){
                this.visible = true;
                this.operate = 0;
            },
            //点击修改数据
            editRow(id){
                this.editIndex = id;
                this.$http.get('http://localhost:3000/areas/'+id).then((result) => {
                    this.operate = 1;
                    this.visible = true;
                    this.dataForm = result.data;
                });
            },
            //保存数据
            saveForm(){
                this.$refs.dataForm.validate((valid) => {
                    if(valid){
                        if(this.operate === 0){ //添加数据
                            let dataForm = this.dataForm;
                            this.$http.post('http://localhost:3000/areas',dataForm).then((result) => {
                                this.getTableLists();
                            });
                        }else if(this.operate === 1){ //修改数据
                            let dataForm = this.dataForm;
                            this.$http.put('http://localhost:3000/areas/'+dataForm.id,dataForm).then((result) => {
                                this.getTableLists();
                            });
                        }
                        this.resetForm();
                    }
                });
            },
            //删除数据
            deleteRow(id){
                this.$confirm('是否删除该数据？','提示',{
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.delete('http://localhost:3000/areas/'+id).then((result) => {
                        this.$message.success({message: '删除数据成功！',center: true,duration: 1200, onClose: () => {
                            this.getTableLists();
                        }});
                    })
                }).catch(() => {});
            },
            //关闭表单，并重置表单
            handleClose(){
                this.resetForm();
            },
            //重置并退出
            resetForm(){
                setTimeout(() => { //解决快速点击2次时，表单已重置修改信息为空的问题
                    //两个一起解决重置问题
                    this.$refs.dataForm.resetFields();
                    this.dataForm = {id: null,areaName: '',areaAddress: [],areaStreet: '',dbIp: '',msIp: '',clientNum: 0,storageAgencyNum: 0,storageServerNum: 0,status: '使用'};
                },500);
                this.visible = false;
            },
            /*----------------------搜索--------------------*/
            //所有查询条件
            queryFilter(){
                this.$http.get('http://localhost:3000/areas',{params: this.query}).then((result) => {
                    this.tableLists = result.data;

                    this.tableListsChange();
                });
            },
            //点击搜索
            searchClick(){
                this.query.areaName_like = this.search;
                this.queryFilter();
            },
            /*----------------------分页--------------------*/
            //每页多少条数据
            handleSizeChange(val){
                this.pageSize = val;
                this.tableListsChange();
            },
            //当前页
            handleCurrentChange(val){
                this.currentPage = val;
                this.tableListsChange();
            },
            //获取当前分页表格数据
            tableListsChange(){
                this.currentTableLists = this.tableLists.filter((item,index,self) => {
                    return index >= this.pageSize * (this.currentPage-1) && index < this.pageSize * this.currentPage;
                });
                this.loading = false;
            },
        }
    }
</script>
