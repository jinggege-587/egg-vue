<template>
    <div class="myChart">
        <div id="container"></div>
    </div>
</template>

<script>
    import G6 from '@antv/g6';
    import request from 'framework/network/request';

    export default {
        data() {
            return {
                q: {
                    pageIndex: 1,
                    pageSize: 1550
                },
                jingList: [],
                myChartList: []
            }
        },
        mounted () {
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
                    this.mountNode();
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
                                id: e.id,
                                value:e.id,
                                name: parent_name,
                                positionName: e.positionName,
                                userNick: e.userNick,
                                image: 'http://wx.chengyun.raycloud.com/'+e.picPath,
                                superiorId: e.superiorId,
                                collapsed:false,
                                childList: this.getData(children_id)
                            };
                        } else {
                            arr_list.push({
                                id: e.id,
                                value:e.id,
                                name: e.name,
                                positionName: e.positionName,
                                userNick: e.userNick,
                                image: 'http://wx.chengyun.raycloud.com/'+e.picPath,
                                superiorId: e.superiorId,
                                collapsed:false,
                                childList: this.getData(children_id)
                            });
                        }
                    }
                });

                return arr_list;
            },
            // 展示数据
            mountNode(){
                const mockData = [this.myChartList];

                console.log('mockData', mockData);

                //  组件props
                const props = {
                    data: mockData,
                    config: {
                        padding: [20, 50],
                        defaultLevel: 1000, //展开多少层
                        defaultZoom: 0.8,
                        modes: { 
                            default: [
                                // 'zoom-canvas', 
                                'drag-canvas'
                            ] 
                        },
                    },
                    nodeClick: (item) => {
                        console.log(item);
                    },
                };

                const { data } = props;
                let backUpData;
                let maxMatrixY = 0;
                let isAnimating = false;
                let graph = null;

                // 默认配置
                const defaultConfig = {
                    width: 1600,
                    height: 28800,
                    pixelRatio: 1,
                    modes: {
                        default: [
                            // 'zoom-canvas', 
                            'drag-canvas'
                        ],
                    },
                    fitView: false,
                    animate: true,
                    defaultEdge: {
                        style: {
                        stroke: '#1890FF',
                        },
                    },
                };
                const initGraph = (data) => {
                    if (!data ?.length) {
                        return;
                    }
                    console.log(1,data);
                    transformData(data);
                    console.log(2,data);
                    const { onInit, config } = props;
                    graph = new G6.Graph({
                        container: 'container',
                        ...defaultConfig,
                        ...config,
                    });
                    initEvent();
                    if (typeof onInit === 'function') {
                        onInit(graph);
                    }
                    backUpData = JSON.parse(JSON.stringify(data));
                    graph.data(getPosition(data, true));
                    graph.render();
                    graph.zoom(config.defaultZoom || 1);
                    if (data ?.length) {
                        graph.changeData(getPosition(backUpData));
                    }
                };

                const transformData = (data, parentIndex) => {
                    if (!data || !data.length) {
                        return;
                    }
                    const {
                        config: { defaultLevel = 10, padding = [20, 20] },
                    } = props;
                    data.forEach((item, index) => {
                        const { status, rate } = item;
                        const children = get(item, 'childList', []);
                        const recordIndex = parentIndex !== undefined ? parentIndex + '-' + index : index + '';
                        maxMatrixY = index === 0 ? maxMatrixY : maxMatrixY + 1;
                        const recordLength = recordIndex.split('-').length;
                        const childrenKeys = [];
                        if (children.length) {
                            getKeys(children, childrenKeys);
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
                            collapsed: recordLength >= defaultLevel,//false,
                            hasChildren: children.length,
                            childrenKeys,
                        };
                        data[index] = item;
                        if (children.length) {
                            transformData(get(item, 'childList', []), recordIndex);
                        }
                    });
                };

                // number to string
                const toString = (id) => id + '';

                /**
                 * 获取keys, 折叠、展开时直接使用
                 * @param {data} ListItem
                 * @param {keys} string[]
                 */
                const getKeys = (data, keys) => {
                    if (!data || !data.length) {
                        return;
                    }
                    data.forEach(item => {
                        const { id } = item;
                        const children = get(item, 'childList', []);
                        keys.push(id);
                        if (children.length) {
                            getKeys(children, keys);
                        }
                    });
                };

                /**
                 * 生成初始化数据，为了动画而动画
                 */
                const initAnimateData = (data, graphData) => {
                    if (!data || !data.length) {
                        return;
                    }
                    data.forEach(item => {
                        const children = get(item, 'childList', []);
                        const collapsed = get(item, 'collapsed');
                        const { childList, ...model } = item;
                        graphData.nodes.push(model);
                        if (children.length && !collapsed) {
                        initAnimateData(get(item, 'childList', []), graphData);
                        }
                    });
                };


                /**
                 * 简易get，项目中请使用lodash的get
                 * @param {Object} object 查找对象
                 * @param {string} path 查找路径
                 * @param {*} defaultValue 默认值
                 */
                const get = (object, path, defaultValue) => {
                    return object ?.[path] || defaultValue;
                };


                /**
                 * 计算位置
                 * @param {data} Array<Item>
                 * @param {flag} string[] | string
                 * @param {postion} object
                */
                const getPosition = (data, init) => {
                    maxMatrixY = 0;
                    const graphData = {
                        nodes: [],
                        edges: [],
                    };

                    if (!data) {
                        return graphData;
                    }

                    if (init) {
                        initAnimateData(data, graphData);
                    } else {
                        recursion(data, 0, graphData);
                    }

                    return graphData;
                };


                /**
                 * 递归
                 */
                const recursion = (
                    data,
                    parentMatrixX,
                    graphData,
                    parentId,
                    parentX,
                    parentY,
                    parentAnimate,
                ) => {
                    if (!data || !data.length) {
                        return;
                    }
                    const {
                        config: { padding = [20, 20], nodesMargin = [250, 100], coefficient = [0.2, -0.1] },
                    } = props;
                    data.forEach((item, index) => {
                        const matrixX = parentMatrixX || 0;
                        const children = get(item, 'childList', []);
                        const animate = get(item, 'animate', false);
                        const afterDrawHidden = get(item, 'afterDrawHidden', false);
                        const collapsed = get(item, 'collapsed');
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
                            recursion(
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
                };

                // 事件绑定
                const initEvent = () => {
                    graph.on('node:click', async (evt) => {
                        if (isAnimating) {
                            return;
                        }
                        const { item, target } = evt;
                        const {
                            attrs: { isCollapseShape },
                        } = target;
                        console.log('isCollapseShape', isCollapseShape);
                        if (isCollapseShape) {
                            isAnimating = true;
                            const model = item.getModel();
                            graph.setItemState(item, 'click', true);
                            const { childrenKeys, id, collapsed, recordIndex } = model;
                            // 更新状态
                            console.log('collapsed', collapsed);
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

                    graph.on('node:mouseenter', (evt) => {
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

                    graph.on('node:mousemove', (evt) => {
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

                    graph.on('node:mouseout', (evt) => {
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

                    graph.on('node:mouseleave', (evt) => {
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
                };


                // 自定义节点、边
                const registerFn = () => {
                    /**
                     * 自定义节点
                     */
                    G6.registerNode(
                        'flow-rect',
                        {
                        shapeType: 'flow-rect',
                        draw(cfg, group) {
                            const { name = '',image, positionName, userNick, des, lightColor, hasChildren, label, rate, collapsed } = cfg;
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

                            // label name
                            group.addShape('text', {
                                attrs: {
                                    ...textConfig,
                                    x: 12,
                                    y: 12,
                                    text: name,
                                    fontSize: 20,
                                    fill: '#000',
                                },
                            });

                            // label positionName
                            group.addShape('text', {
                                attrs: {
                                    ...textConfig,
                                    width: 20,
                                    height: 20,
                                    x: 12,
                                    y: 42,
                                    text: positionName,
                                    fontSize: 14,
                                    fill: '#000',
                                    cursor: 'pointer',
                                    isTitleShape: true,
                                },
                            });
                            // label image
                            group.addShape('image', {
                                attrs: {
                                    // ...textConfig,
                                    x: 122,
                                    y: 8,
                                    width: 20,
                                    height: 20,
                                    // img: img,
                                    img: 'https://g.alicdn.com/cm-design/arms-trace/1.0.155/styles/armsTrace/images/TAIR.png',
                                },
                                name: 'image-shape',
                            });

                            // label userNick
                            group.addShape('text', {
                                attrs: {
                                    ...textConfig,
                                    x: 175,
                                    y: 9,
                                    text: userNick,
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
                };


                /**
                 * sleep
                 * @param {duration} number unit ms
                 */
                const sleep = (duration = 500) => {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve('done');
                        }, duration);
                    });
                };


                /**
                 * 计算位置
                 * @param {data} Array<Item>
                 * @param {flag} string[] | string
                 * @param {postion} object
                 */
                const getExpandPosition = (data) => {
                    maxMatrixY = 0;
                    const graphData = {
                        nodes: [],
                        edges: [],
                    };

                    if (!data) {
                        return graphData;
                    }

                    recursionExpand(data, 0, graphData);

                    return graphData;
                };

                /**
                 * 展开时的特殊处理
                 */
                const recursionExpand = (
                    data,
                    parentMatrixX,
                    graphData,
                    parentX,
                    parentY,
                    parentAnimate,
                ) => {
                    if (!data || !data.length) {
                        return;
                    }
                    data.forEach((item, index) => {
                        const matrixX = parentMatrixX || 0;
                        const children = get(item, 'childList', []);
                        const animate = get(item, 'animate', false);
                        const afterDrawHidden = get(item, 'afterDrawHidden', false);
                        const collapsed = get(item, 'collapsed');
                        const currentX = parentAnimate === 'expand' ? parentX : item.x;
                        const currentY = parentAnimate === 'expand' ? parentY : item.y;

                        item = {
                            ...item,
                            id: toString(item.id),
                            x: currentX,
                            y: currentY,
                            hasChildren: children.length,
                        };
                        data[index] = item;
                        const { childList, ...model } = item;
                        graphData.nodes.push(model);

                        if ((children.length && animate) || (children.length && !collapsed)) {
                            recursionExpand(
                                children,
                                afterDrawHidden ? matrixX : matrixX + 1,
                                graphData,
                                currentX,
                                currentY,
                                animate,
                            );
                        }
                    });
                };


                /**
                 * 创建提示
                 * @param {postion} 鼠标点击的位置
                 * @param {name} string 节点Name
                 * @param {id} string 节点id
                 */
                const createTooltip = (postion= { x, y }, name, id) => {
                    const offsetTop = -60;
                    const existTooltip = document.getElementById(id);
                    const x = postion.x + 'px';
                    const y = postion.y + offsetTop + 'px';
                    if (existTooltip) {
                        existTooltip.style.left = x;
                        existTooltip.style.top = y;
                    } else {
                        // content
                        const tooltip = document.createElement('div');
                        const span = document.createElement('span');
                        span.textContent = name;
                        tooltip.style.padding = '10px';
                        tooltip.style.background = 'rgba(0,0,0, 0.65)';
                        tooltip.style.color = '#fff';
                        tooltip.style.borderRadius = '4px';
                        tooltip.appendChild(span);
                        // box
                        const div = document.createElement('div');
                        div.style.position = 'absolute';
                        div.style.zIndex = '99';
                        div.id = id;
                        div.style.left = x;
                        div.style.top = y;
                        div.appendChild(tooltip);
                        document.body.appendChild(div);
                    }
                };
                /**
                 * 删除提示
                 * @param {id} string
                 */
                const removeTooltip = (id) => {
                    const removeNode = document.getElementById(id);
                    if (removeNode) {
                        document.body.removeChild(removeNode);
                    }
                };


                /**
                 * 更新当前数据的collapse状态以及子节点的afterDrawHidden状态
                 * @param {id} string
                 * @param {recordIndex} string 节点索引
                 * @param {collapsed} boolean
                 */
                const updateCollapseStatus = (
                    id,
                    recordIndex,
                    collapsed,
                    animate,
                ) => {
                    let currentList = backUpData;
                    try {
                        let currentRecord;
                        const indexs = recordIndex.split('-');
                        for (let i = 0; i < indexs.length; i += 1) {
                        currentRecord = currentList[indexs[i]];
                        currentList = currentList[indexs[i]].childList;
                        }
                        currentRecord.collapsed = !collapsed;
                        currentRecord.animate = animate;

                        const setHidden = (data) => {
                        if (!data || !data.length) {
                            return;
                        }
                        data.forEach((item, index) => {
                            const children = get(item, 'childList', []);
                            data[index] = {
                            ...item,
                            afterDrawHidden: !collapsed,
                            };
                            if (children.length && !item.collapsed) {
                            setHidden(children);
                            }
                        });
                        };
                        setHidden(currentList);
                    } catch (err) {
                        console.error(err, id, currentList);
                    }
                };

                
                registerFn();
                initGraph(data);
            }
        }
    }
</script>

<style lang="less" scoped>
    
</style>