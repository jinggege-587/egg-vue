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
        mounted () {
            // this.mountNode();
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
                const mockData = [
                                    {
                                        id: 'g1',
                                        name: 'Name1',
                                        count: 123456,
                                        label: 'xx Yuan',
                                        rate: 0.97,
                                        status: 'S',
                                        childList: [
                                        {
                                            id: 'g12',
                                            name: 'Deal with Long label',
                                            count: 123456,
                                            label: 'xx Yuan',
                                            rate: 0.123,
                                            status: 'S',
                                            childList: [
                                            {
                                                id: 'g121',
                                                name: 'Name3',
                                                count: 123456,
                                                label: 'xx Yuan',
                                                rate: 0.123,
                                                status: 'S',
                                                childList: [
                                                {
                                                    id: 'g1211',
                                                    name: 'Name4',
                                                    count: 123456,
                                                    label: 'xx Yuan',
                                                    rate: 0.123,
                                                    status: 'I',
                                                    childList: [],
                                                },
                                                ],
                                            },
                                            {
                                                id: 'g122',
                                                name: 'Name5',
                                                count: 123456,
                                                label: 'xx Yuan',
                                                rate: 0.96,
                                                status: 'S',
                                                childList: [
                                                {
                                                    id: 'g1221',
                                                    name: 'Name6',
                                                    count: 123456,
                                                    label: 'xx Yuan',
                                                    rate: 0.123,
                                                    status: 'S',
                                                    childList: [
                                                    {
                                                        id: 'g12211',
                                                        name: 'Name6-1',
                                                        count: 123456,
                                                        label: 'xx Yuan',
                                                        rate: 0.123,
                                                        status: 'I',
                                                        childList: [],
                                                    },
                                                    ],
                                                },
                                                {
                                                    id: 'g1222',
                                                    name: 'Name7',
                                                    count: 123456,
                                                    label: 'xx Yuan',
                                                    rate: 0.123,
                                                    status: 'S',
                                                    childList: [],
                                                },
                                                ],
                                            },
                                            {
                                                id: 'g123',
                                                name: 'Name8',
                                                count: 123456,
                                                label: 'xx Yuan',
                                                rate: 0.23,
                                                status: 'S',
                                                childList: [
                                                {
                                                    id: 'g1231',
                                                    name: 'Name8-1',
                                                    count: 123456,
                                                    label: 'xx Yuan',
                                                    rate: 0.123,
                                                    status: 'I',
                                                    childList: [],
                                                },
                                                ],
                                            },
                                            ],
                                        },
                                        {
                                            id: 'g13',
                                            name: 'Name9',
                                            count: 123456,
                                            label: 'xx Yuan',
                                            rate: 0.123,
                                            status: 'S',
                                            childList: [
                                            {
                                                id: 'g131',
                                                name: 'Name10',
                                                count: 123456,
                                                label: 'xx Yuan',
                                                rate: 0.123,
                                                status: 'I',
                                                childList: [],
                                            },
                                            {
                                                id: 'g132',
                                                name: 'Name11',
                                                count: 123456,
                                                label: 'xx Yuan',
                                                rate: 0.123,
                                                status: 'I',
                                                childList: [],
                                            },
                                            ],
                                        },
                                        {
                                            id: 'g14',
                                            name: 'Name12',
                                            count: 123456,
                                            label: 'xx Yuan',
                                            rate: 0.123,
                                            status: 'I',
                                            childList: [],
                                        },
                                        ],
                                    },
                                ];
                this.initGraph(mockData);
                this.registerFn();
            },
            initGraph(data){
                if (!data ?.length) {
                    return;
                }
                const props = {
                    data: data,
                    config: {
                        padding: [20, 50],
                        defaultLevel: 3,
                        defaultZoom: 0.8,
                        modes: { default: ['zoom-canvas', 'drag-canvas'] },
                    },
                    nodeClick: (item) => {
                        console.log(item);
                    },
                };
                this.props = props;
                this.transformData(data);
                const { onInit, config } = props;
                // 默认配置
                const defaultConfig = {
                    width: 1600,
                    height: 800,
                    pixelRatio: 1,
                    modes: {
                        default: ['zoom-canvas', 'drag-canvas'],
                    },
                    fitView: false,
                    animate: true,
                    defaultEdge: {
                        style: {
                        stroke: '#1890FF',
                        },
                    },
                };
                console.log(1);
                let graph = new G6.Graph({
                    container: 'mountNode',
                    ...defaultConfig,
                    ...config,
                });
                this.graph = graph;
                console.log(2);
                // this.initEvent();
                if (typeof onInit === 'function') {
                    onInit(graph);
                }
                let backUpData = JSON.parse(JSON.stringify(data));
                graph.data(this.getPosition(data, true));
                graph.render();
                graph.zoom(config.defaultZoom || 1);
                if (data ?.length) {
                    graph.changeData(this.getPosition(backUpData));
                }

            },
            transformData(data, parentIndex){
                if (!data || !data.length) {
                    return;
                }
                const {
                    config: { defaultLevel = 10, padding = [20, 20] },
                } = this.props;

                let backUpData;
                let maxMatrixY = 0;
                let isAnimating = false;
                let graph = null;

                data.forEach((item, index) => {
                    const { status, rate } = item;
                    const children = this.get(item, 'childList', []);
                    const recordIndex = parentIndex !== undefined ? parentIndex + '-' + index : index + '';
                    maxMatrixY = index === 0 ? maxMatrixY : maxMatrixY + 1;
                    const recordLength = recordIndex.split('-').length;
                    const childrenKeys = [];
                    if (children.length) {
                        this.getKeys(children, childrenKeys);
                    }
                    let lightColor;
                    if (status === 'I') {
                        lightColor = '#DCDFE5';
                    } else {
                        lightColor = rate >= 0.95 ? '#1890FF' : '#EB2F96';
                    }
                    item = {
                        ...item,
                        lightColor,
                        id: toString(item.id),
                        x: padding[0],
                        y: padding[1],
                        recordIndex,
                        collapsed: recordLength >= defaultLevel,
                        hasChildren: children.length,
                        childrenKeys,
                    };
                    data[index] = item;
                    if (children.length) {
                        this.transformData(this.get(item, 'childList', []), recordIndex);
                    }
                });
            },
            initEvent(){
                this.graph.on('node:click', async (evt) => {
                    if (isAnimating) {
                        return;
                    }
                    const { item, target } = evt;
                    const {
                        attrs: { isCollapseShape },
                    } = target;
                    if (isCollapseShape) {
                        isAnimating = true;
                        const model = item.getModel();
                        graph.setItemState(item, 'click', true);
                        const { childrenKeys, id, collapsed, recordIndex } = model;
                        // 更新状态
                        if (collapsed) {
                            updateCollapseStatus(id, recordIndex, collapsed, 'expand');
                            graph.changeData(getExpandPosition(backUpData));
                            graph.stopAnimate();
                            childrenKeys.forEach(async (key) => {
                                const childrenItem = graph.findById(key);
                                if (childrenItem) {
                                    childrenItem.toBack();
                                }
                            });
                            updateCollapseStatus(id, recordIndex, collapsed);
                            graph.changeData(getPosition(backUpData));
                            await sleep(500);
                            graph.setItemState(item, 'click', false);
                            isAnimating = false;
                        } else {
                            updateCollapseStatus(id, recordIndex, collapsed, 'collapsed');
                            graph.changeData(getPosition(backUpData));
                                childrenKeys.forEach(async (key) => {
                                const childrenItem = graph.findById(key);
                                if (childrenItem) {
                                    childrenItem.toBack();
                                }
                            });
                            await sleep(500);
                            updateCollapseStatus(id, recordIndex, collapsed);
                            childrenKeys.forEach(async (key) => {
                                const childrenItem = graph.findById(key);
                                if (childrenItem) {
                                    graph.remove(childrenItem);
                                }
                            });
                            graph.setItemState(item, 'click', false);
                            isAnimating = false;
                        }
                    } else {
                    const { nodeClick } = props;
                    if (typeof nodeClick === 'function') {
                        nodeClick(item.getModel());
                    }
                    }
                });

                this.graph.on('node:mouseenter', (evt) => {
                    const node = evt.item;
                    graph.setItemState(node, 'hover', true);
                    graph.updateItem(node, {
                    style: {
                        ...node._cfg.originStyle,
                        shadowColor: '#bbb',
                        shadowBlur: 6,
                    },
                    });
                });

                this.graph.on('node:mousemove', (evt) => {
                    if (isAnimating) {
                    return;
                    }
                    const { item, target, x, y } = evt;
                    const {
                    attrs: { isTitleShape },
                    } = target;
                    const model = item.getModel();
                    const { name, id } = model;
                    if (isTitleShape) {
                    const postion = graph.getClientByPoint(x, y);
                    createTooltip(postion, name, id);
                    } else {
                    removeTooltip(id);
                    }
                });

                this.graph.on('node:mouseout', (evt) => {
                    if (isAnimating) {
                    return;
                    }
                    const { item, target } = evt;
                    const {
                    attrs: { isTitleShape },
                    } = target;
                    const model = item.getModel();
                    const { id } = model;
                    if (isTitleShape) {
                    removeTooltip(id);
                    }
                });

                this.graph.on('node:mouseleave', (evt) => {
                    const node = evt.item;
                    graph.setItemState(node, 'hover', false);
                    graph.updateItem(node, {
                    style: {
                        ...node._cfg.originStyle,
                        shadowColor: 'transparent',
                        shadowBlur: 0,
                    },
                    });
                });
            },
            get(object, path, defaultValue){
                return object ?.[path] || defaultValue;
            },
            getKeys(data, keys){
                if (!data || !data.length) {
                    return;
                }
                data.forEach(item => {
                    const { id } = item;
                    const children = this.get(item, 'childList', []);
                    keys.push(id);
                    if (children.length) {
                        this.getKeys(children, keys);
                    }
                });
            },
            getPosition (data, init){
                let maxMatrixY = 0;
                const graphData = {
                    nodes: [],
                    edges: [],
                };

                if (!data) {
                    return graphData;
                }

                if (init) {
                    this.initAnimateData(data, graphData);
                } else {
                    this.recursion(data, 0, graphData);
                }

                return graphData;
            },
            initAnimateData (data, graphData){
                if (!data || !data.length) {
                    return;
                }
                data.forEach(item => {
                    const children = this.get(item, 'childList', []);
                    const collapsed = this.get(item, 'collapsed');
                    const { childList, ...model } = item;
                    graphData.nodes.push(model);
                    if (children.length && !collapsed) {
                        this.initAnimateData(this.get(item, 'childList', []), graphData);
                    }
                });
            },
            recursion (
                data,
                parentMatrixX,
                graphData,
                parentId,
                parentX,
                parentY,
                parentAnimate,
                ) {
                if (!data || !data.length) {
                    return;
                }
                let maxMatrixY = 0;
                const {
                    config: { padding = [20, 20], nodesMargin = [250, 100], coefficient = [0.2, -0.1] },
                } = this.props;
                data.forEach((item, index) => {
                    const matrixX = parentMatrixX || 0;
                    const children = this.get(item, 'childList', []);
                    const animate = this.get(item, 'animate', false);
                    const afterDrawHidden = this.get(item, 'afterDrawHidden', false);
                    const collapsed = this.get(item, 'collapsed');
                    maxMatrixY = index === 0 || afterDrawHidden ? maxMatrixY : maxMatrixY + 1;

                    const currentX =
                    afterDrawHidden || parentAnimate === 'expand'
                        ? parentX
                        : matrixX * nodesMargin[0] + padding[0];
                    const currentY =
                    afterDrawHidden || parentAnimate === 'expand'
                        ? parentY
                        : maxMatrixY * nodesMargin[1] + padding[1];

                    item = {
                    ...item,
                    id: toString(item.id),
                    matrixX,
                    matrixY: maxMatrixY,
                    x: currentX,
                    y: currentY,
                    type: 'flow-rect',
                    coefficientX: coefficient[0],
                    coefficientY: coefficient[1],
                    hasChildren: children.length,
                    collapsed: item.collapsed || false,
                    };
                    data[index] = item;
                    const { childList, ...model } = item;
                    graphData.nodes.push(model);

                    if (parentId) {
                    graphData.edges.push({
                        source: parentId,
                        target: toString(item.id),
                        targetAnchor: 0,
                        sourceAnchor: 1,
                        type: index === 0 ? 'line' : 'flow-cubic',
                    });
                    }

                    if ((children.length && animate) || (children.length && !collapsed)) {
                        this.recursion(
                            children,
                            afterDrawHidden ? matrixX : matrixX + 1,
                            graphData,
                            toString(item.id),
                            currentX,
                            currentY,
                            animate,
                        );
                    }
                });
            },
            // 自定义节点、边
            registerFn(){
                /**
                 * 自定义节点
                 */
                G6.registerNode(
                    'flow-rect',
                    {
                    shapeType: 'flow-rect',
                    draw(cfg, group) {
                        const { name = '', lightColor, hasChildren, label, rate, collapsed } = cfg;
                        // 逻辑不应该在这里判断
                        const rectConfig = {
                        width: 184,
                        height: 74,
                        lineWidth: 1,
                        fontSize: 12,
                        fill: '#fff',
                        radius: 4,
                        stroke: lightColor,
                        opacity: 1,
                        };

                        const textConfig = {
                        textAlign: 'left',
                        textBaseline: 'top',
                        };

                        const rect = group.addShape('rect', {
                        attrs: {
                            x: 0,
                            y: 0,
                            ...rectConfig,
                        },
                        });

                        // label title
                        group.addShape('text', {
                        attrs: {
                            ...textConfig,
                            x: 12,
                            y: 8,
                            text: name.length > 10 ? name.substr(0, 10) + '...' : name,
                            fontSize: 14,
                            fill: '#000',
                            cursor: 'pointer',
                            isTitleShape: true,
                        },
                        });

                        // label count
                        group.addShape('text', {
                        attrs: {
                            ...textConfig,
                            x: 12,
                            y: 34,
                            text: label,
                            fontSize: 20,
                            fill: '#000',
                        },
                        });

                        // label percentage
                        group.addShape('text', {
                        attrs: {
                            ...textConfig,
                            x: 178,
                            y: 37,
                            text: `${((rate || 0) * 100).toFixed(2)}%`,
                            fontSize: 14,
                            textAlign: 'right',
                            fill: lightColor,
                        },
                        });

                        // bottom line
                        group.addShape('rect', {
                        attrs: {
                            x: 0,
                            y: 70,
                            width: rectConfig.width,
                            height: 4,
                            radius: [0, 0, rectConfig.radius, rectConfig.radius],
                            fill: '#DCDFE5',
                        },
                        });

                        // bottom percent
                        group.addShape('rect', {
                        attrs: {
                            x: 0,
                            y: 70,
                            width: 100,
                            height: 4,
                            radius: [0, 0, 0, rectConfig.radius],
                            fill: lightColor,
                        },
                        });

                        if (hasChildren) {
                        // collapse circle
                        group.addShape('circle', {
                            attrs: {
                            x: rectConfig.width,
                            y: rectConfig.height / 2,
                            r: 8,
                            stroke: lightColor,
                            fill: collapsed ? lightColor : '#fff',
                            isCollapseShape: true,
                            },
                        });

                        // collpase text
                        group.addShape('text', {
                            attrs: {
                            x: rectConfig.width,
                            y: rectConfig.height / 2,
                            width: 16,
                            height: 16,
                            textAlign: 'center',
                            textBaseline: 'middle',
                            text: collapsed ? '+' : '-',
                            fontSize: 16,
                            fill: collapsed ? '#fff' : lightColor,
                            cursor: 'pointer',
                            isCollapseShape: true,
                            },
                        });
                        }

                        this.drawLinkPoints(cfg, group);
                        return rect;
                    },
                    update(cfg, item) {
                        const group = item.getContainer();
                        this.updateLinkPoints(cfg, group);
                    },
                    setState(name, value, item) {
                        if (name === 'click' && value) {
                        const group = item.getContainer();
                        const { collapsed } = item.getModel();
                        const [, , , , , , CircleShape, TextShape] = group.get('children');
                        if (TextShape) {
                            const {
                            attrs: { stroke },
                            } = CircleShape;
                            if (!collapsed) {
                            TextShape.attr({
                                text: '-',
                                fill: stroke,
                            });
                            CircleShape.attr({
                                fill: '#fff',
                            });
                            } else {
                            TextShape.attr({
                                text: '+',
                                fill: '#fff',
                            });
                            CircleShape.attr({
                                fill: stroke,
                            });
                            }
                        }
                        }
                    },
                    getAnchorPoints() {
                        return [
                        [0, 0.5],
                        [1, 0.5],
                        ];
                    },
                    },
                    // 注意这里继承了 'single-shape'
                    'rect',
                );

                G6.registerEdge(
                    'flow-cubic',
                    {
                    getControlPoints(cfg) {
                        let controlPoints = cfg.controlPoints; // 指定controlPoints
                        if (!controlPoints || !controlPoints.length) {
                        const { startPoint, endPoint, sourceNode, targetNode } = cfg;
                        const { x: startX, y: startY, coefficientX, coefficientY } = sourceNode
                            ? sourceNode.getModel()
                            : startPoint;
                        const { x: endX, y: endY } = targetNode ? targetNode.getModel() : endPoint;
                        let curveStart = (endX - startX) * coefficientX;
                        let curveEnd = (endY - startY) * coefficientY;
                        curveStart = curveStart > 40 ? 40 : curveStart;
                        curveEnd = curveEnd < -30 ? curveEnd : -30;
                        controlPoints = [
                            { x: startPoint.x + curveStart, y: startPoint.y },
                            { x: endPoint.x + curveEnd, y: endPoint.y },
                        ];
                        }
                        return controlPoints;
                    },
                    getPath(points) {
                        const path = [];
                        path.push(['M', points[0].x, points[0].y]);
                        path.push([
                        'C',
                        points[1].x,
                        points[1].y,
                        points[2].x,
                        points[2].y,
                        points[3].x,
                        points[3].y,
                        ]);
                        return path;
                    },
                    },
                    'single-line',
                );
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