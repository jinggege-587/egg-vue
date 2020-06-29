<template>
    <div class="myChart">
        <div id="myChart" ></div>
        <div id="mountNode"></div>
    </div>
</template>

<script>
    import { SET_RAY_LIST, DELETE_ARTICLE } from '../store/mutation-type';
    import request from 'framework/network/request';
    import * as echarts from 'echarts';
    import G6 from '@antv/g6';

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
                    // this.showHigh();
                    this.mountNode()
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
            // 展示数据
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
            mountNode(){
                const data = {
                            // 点集
                            nodes: [
                                {
                                    id: 'node1', // String，该节点存在则必须，节点的唯一标识
                                    x: 100, // Number，可选，节点位置的 x 值
                                    y: 200, // Number，可选，节点位置的 y 值
                                },
                                {
                                    id: 'node2', // String，该节点存在则必须，节点的唯一标识
                                    x: 300, // Number，可选，节点位置的 x 值
                                    y: 200, // Number，可选，节点位置的 y 值
                                },
                            ],
                            // 边集
                            edges: [
                                {
                                    source: 'node1', // String，必须，起始点 id
                                    target: 'node2', // String，必须，目标点 id
                                },
                            ],
                        };
                const graph = new G6.Graph({
                                            container: 'mountNode', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
                                            width: 800, // Number，必须，图的宽度
                                            height: 500, // Number，必须，图的高度
                                        });
                graph.data(data); // 读取 Step 2 中的数据源到图上
                graph.render(); // 渲染图
            }
        }
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