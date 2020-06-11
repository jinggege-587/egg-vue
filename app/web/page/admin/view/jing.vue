<template>
    <div class="myChart">
        <div id="myChart" ></div>
        <!-- <highcharts :options="options" v-if="options"></highcharts> -->
    </div>
</template>

<script>
    import { SET_RAY_LIST, DELETE_ARTICLE } from '../store/mutation-type';
    import request from 'framework/network/request';
    import * as echarts from 'echarts';
    // import Highcharts from 'highcharts';
    // import organizationInit from 'highcharts/modules/organization';
    // import networkgraphInit from 'highcharts/modules/networkgraph';
    // import sankeyInit from 'highcharts/modules/sankey';
    
    
    // sankeyInit(Highcharts)
    // networkgraphInit(Highcharts)
    // organizationInit(Highcharts)


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
                jingList: [],
                myChartList: [],
            }
        },
        created () {
            this.getList();
        },
        methods: {
            // 获取数据
            async getList() {
                request.post('/admin/api/article/list', this.q).then(response => {
                    let {list} = response.data;
                    this.jingList = list;
                    console.log('this.jingList',this.jingList)

                    this.getData(1);
                    this.showHigh();
                });
            },
            // 数据组装
            getData(parent_id){
                let list = this.jingList;
                let arr_list = [],
                child_arr=[],
                myChartList = [],
                parent_name='',
                children_id='';
                let num = 0;
                list.map((e,n)=>{
                    num = n;
                    if(e.parent_id == parent_id) {
                        let status = false;
                        parent_name = e.name;
                        children_id = e.id;
                        if (e.parent_id == 1) {
                            this.myChartList = {
                                name: parent_name,
                                id: e.id,
                                value:e.id,
                                parent_id: e.parent_id,
                                collapsed:false,
                                children: this.getData(children_id)
                            };
                        } else {
                            arr_list.push({
                                name: e.name,
                                id: e.id,
                                value:e.id,
                                parent_id: e.parent_id,
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
            bhxt(){
                this.options = {
                    chart: {
                        type: 'networkgraph',
                        height: '100%'
                    },
                    title: {
                        text: '光云结构图'
                    },
                    subtitle: {
                        text: '光云结构图'
                    },
                    plotOptions: {
                        networkgraph: {
                            keys: ['from', 'to'],
                            layoutAlgorithm: {
                                // enableSimulation: true
                            }
                        }
                    },
                    series: [{
                        dataLabels: {
                            enabled: true
                        },
                        data: this.arr_list
                    }]
                };
                console.log('this.arr_list', this.arr_list);
            }
        },
        mounted () {
            // setTimeout(() => {
            //     this.showHigh();
            // }, 2000);
        },
    }
</script>

<style lang="less" scoped>
    .myChart{
        padding-top: 50px;
        #myChart{
            // min-height: 600px
            width: 800px;
            height: 100vh;
        }
    }
</style>