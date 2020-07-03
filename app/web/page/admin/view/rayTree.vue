<template>
    <div class="myChart">
        <div id="myChart" ></div>
    </div>
</template>

<script>
    import request from 'framework/network/request';
    import * as echarts from 'echarts';
    // import g6 from './../../../asset/js/g6'

    export default {
        name: 'myChart',
        data() {
            return {
                q: {
                    pageIndex: 1,
                    pageSize: 1550
                },
                arr_list: [],
                list: [],
                nodes: [],
                options: {},
                rayList: [],
                myChartList: [],
            }
        },
        created () {
            this.getList();
        },
        methods: {
            // 获取数据
            async getList() {
                request.post('/admin/api/article/rayList', this.q).then(response => {
                    let {list} = response.data;
                    this.rayList = list;
                    console.log('this.rayList',this.rayList)

                    this.getData(0);

                });
            },
            // 数据组装
            getData(superiorId){
                let list = this.rayList;
                let arr_list = [],
                child_arr=[],
                myChartList = [],
                parent_name='',
                children_id='';
                let num = 0;
                list.map((e,n)=>{
                    num = n;
                    if(e.superiorId == superiorId) {
                        let status = false;
                        parent_name = e.name;
                        children_id = e.id;
                        if (e.superiorId == 0) {
                            this.myChartList = {
                                name: parent_name,
                                id: e.id,
                                value:e.id,
                                superiorId: e.superiorId,
                                collapsed:false,
                                children: this.getData(children_id)
                            };
                        } else {
                            arr_list.push({
                                name: e.name,
                                id: e.id,
                                value:e.id,
                                superiorId: e.superiorId,
                                collapsed:false,
                                children: this.getData(children_id)
                            });
                        }
                    }
                });

                return arr_list;
            },
            showHigh(){
                console.log('showHigh->->->myChartList', this.myChartList);
                let data = this.myChartList;
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('myChart'));
                myChart.setOption({
                    tooltip: {
                        trigger: 'item',
                        triggerOn: 'mousemove'
                    },
                    series: [
                        {
                            type: 'tree',

                            data: [data],

                            top: '1%',
                            left: '5%',
                            bottom: '1%',
                            right: '5%',

                            symbolSize: 7,

                            label: {
                                position: 'left',
                                verticalAlign: 'middle',
                                align: 'right',
                                fontSize: 9
                            },

                            leaves: {
                                label: {
                                    position: 'right',
                                    verticalAlign: 'middle',
                                    align: 'left'
                                }
                            },

                            expandAndCollapse: true,
                            animationDuration: 550,
                            animationDurationUpdate: 750
                        }
                    ]
                });

            },
        },
        mounted () {
            setTimeout(() => {
                this.showHigh();
            }, 200);
        },
    }
</script>

<style lang="less" scoped>
    .myChart{
        padding-top: 50px;
        #myChart{
            // min-height: 600px
            width: 2000px;
            height: 8000px;
        }
    }
</style>