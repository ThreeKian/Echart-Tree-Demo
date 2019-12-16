import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { filter, retry, map, tap, catchError, delay, repeat } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { Subscription, EMPTY } from 'rxjs';

export interface TreeNodeInterface {
  id: string;
  name: string;
  level: number;
  expand: boolean;
  disabled: boolean;
  children?: TreeNodeInterface[];
}
@Component({
  selector: 'app-show-charts',
  templateUrl: './show-charts.component.html',
  styleUrls: ['./show-charts.component.less']
})
export class ShowChartsComponent implements OnInit {
  public subscription: Subscription;
  DeviceName = '';
  firmwareVersion = '';
  deviceTypeList = ['Station', 'CH4'];
  chooseTypeList = [{
    name: '全部',
    value: '1'
  }, {
    name: '多选',
    value: '0'
  }];
  chooseType = '1';
  firmwareVersionList = [];
  versionHistoryList = [];
  versionHistory = '';
  isVisible = false;
  alert = '';
  selected1: number;
  selected2: number;
  selected3: number;
  selected4: number;
  choosed1 = false;
  choosed2 = false;
  equipmentList = [
    {
      id: '1',
      name: '1-1-0',
      children: [
        {
          id: '1-1',
          name: '485',
          detail: [{
            id: '111',
            name: '1-1-1',
            disabled: false,
            children: [{
              id: '1111',
              name: 'can',
              disabled: true,
              detail: [{
                equipmentName: '11111',
                firmwareVersion: '1111-1',
                id: '0'
              }, {
                equipmentName: '11112',
                firmwareVersion: '1111-2',
                id: '1'
              }]
            }, {
              id: '1112',
              name: '485',
              disabled: true,
              detail: [{
                equipmentName: '11121',
                firmwareVersion: '1112-1',
                id: '0'
              }, {
                equipmentName: '11122',
                firmwareVersion: '1112-2',
                id: '1'
              }]
            }]
          }, {
            id: '112',
            name: '1-1-2',
            disabled: false,
            detail: [{
              equipmentName: '1121',
              firmwareVersion: '112-1',
              id: '0'
            }, {
              equipmentName: '1122',
              firmwareVersion: '112-2',
              id: '1'
            }]
          }]
        },
        {
          id: '12',
          name: 'can',
          detail: [{
            id: '113',
            name: '1-1-3',
            disabled: false,
            detail: [{
              equipmentName: '1131',
              firmwareVersion: '113-1',
              id: '0'
            }, {
              equipmentName: '1132',
              firmwareVersion: '113-2',
              id: '1'
            }]
          }, {
            id: '114',
            name: '1-1-4',
            disabled: false,
            children: [{
              id: '1141',
              name: 'can',
              disabled: true,
              detail: [{
                equipmentName: '11411',
                firmwareVersion: '1141-1',
                id: '0'
              }, {
                equipmentName: '11412',
                firmwareVersion: '1141-2',
                id: '1'
              }]
            }, {
              id: '1142',
              name: '485',
              disabled: true,
            }]
          }]
        }
      ]
    },
    {
      id: '2',
      name: '2-1',
      children: [
        {
          id: '21',
          name: '485',
          detail: [{
            id: '211',
            name: '2-1-1',
            disabled: false,
            children: [{
              id: '2111',
              name: 'can',
              disabled: true,
              detail: [{
                equipmentName: '21111',
                firmwareVersion: '2111-1',
                id: '0'
              }, {
                equipmentName: '21112',
                firmwareVersion: '2111-2',
                id: '1'
              }]
            }, {
              id: '2112',
              name: '485',
              disabled: true,
            }]
          }, {
            id: '212',
            name: '2-1-2',
            disabled: false,
            detail: [{
              equipmentName: '2121',
              firmwareVersion: '212-1',
              id: '0'
            }, {
              equipmentName: '2122',
              firmwareVersion: '212-2',
              id: '1'
            }]
          }]
        },
        {
          id: '22',
          name: 'can',
          detail: [{
            id: '213',
            name: '2-1-3',
            disabled: false,
          }, {
            id: '214',
            name: '2-1-4',
            disabled: false,
            detail: [{
              equipmentName: '2141',
              firmwareVersion: '214-1',
              id: '0'
            }, {
              equipmentName: '2142',
              firmwareVersion: '214-2',
              id: '1'
            }]
          }]
        }
      ]
    }
  ];
  detailList1 = [];
  detailList2 = [];
  equipmentDetailList = [];
  total = 0;
  pageIndex = 1;
  loading = false;
  image = new Image();
  chartOption = {
    title: {
      show: false
    },
    tooltip: {
      triggerOn: 'mousemove',
      formatter(param) {
        if (param.data.ID === undefined && param.data.DevNam === undefined && param.data.HardVer === undefined &&
          param.data.HardVer === undefined) {
          return null;
        } else {
          const arr = param.data.currentId.split('-');
          if (arr.length > 2) {
            return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px;">' +
              '编号：' + param.data.ID +
              '</div><div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px;">' +
              '设备名称：' + param.data.DevNam +
              '</div><div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px;">' +
              '硬件版本：' + param.data.HardVer +
              '</div><div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px;">' +
              '软件版本：' + param.data.SoftVer +
              '</div><div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px;">' +
              'IP地址：' + param.data.Index +
              '</div>';
          } else {
            return '<div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px;">' +
              'IP地址：' + param.data.IP +
              '</div><div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px;">' +
              '设备名称：' + param.data.DevNam +
              '</div><div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px;">' +
              '硬件版本：' + param.data.HardVer +
              '</div><div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px;">' +
              '软件版本：' + param.data.SoftVer +
              '</div><div style="border-bottom: 1px solid rgba(255,255,255,.3); font-size: 16px;padding-bottom: 7px;margin-bottom: 7px;">' +
              'IP地址：' + param.data.Index +
              '</div>';
          }
        }
      }
    },
    // 右上角的工具栏
    toolbox: {
      show: false,
    },
    calculable: false,
    series: [
      {
        name: '树图',
        type: 'tree',
        orient: 'vertical',  // vertical horizontal
        rootLocation: { x: 100, y: 230 }, // 根节点位置  {x: 100, y: 'center'}
        width: '100%',
        height: '60%',
        nodePadding: 1,
        layerPadding: 500,
        hoverable: false,
        roam: true,
        // 默认展开层数
        initialTreeDepth: 20,
        symbolSize: 7,
        itemStyle: {
          lineStyle: {
            curveness: 0.9
          },
          // 正常情况显示
          normal: {
            label: {
              show: true,
              position: 'top',
              textStyle: {
                // 字体颜色、大小、加粗
                color: '#000',
                fontSize: 15,
                fontWeight: 'bolder'
              }
            },
            color: '#fff',
            lineStyle: {
              color: '#000',
              width: 1,
              type: 'broken',
              curveness: '1'
            }
          },
          // 鼠标移上去样式
          emphasis: {
            label: {
              show: false,
              textStyle: {
                align: 'center',
                verticalAlign: 'middle'
              }
            },
            color: '#fff',
            borderWidth: 1
          }
        },
        data: []
      }
    ]
  };
  IPData = {};
  secondItemList = [];
  thirdItemList = [];
  fourthItemList = [];
  isAllDisplayDataChecked = false;
  isIndeterminate = false;
  mapOfCheckedId: { [key: string]: boolean } = {};
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  mapOfExpandedData2: { [key: string]: TreeNodeInterface[] } = {};
  deviceData = {};
  showEquipmentList = [{
    key: '已选择全部设备',
    color: '#a7a8a9',
    type: '全部'
  }];
  localDevicesList = ['BASE10KJF130', 'CH4', 'GD3', 'GJG3', 'KCC2-5', 'KGE28', 'KJF130', 'Station'];
  public echartsIntance: any;
  constructor( private msg: NzMessageService) { }

  ngOnInit() {
    const option1 = {
      name: '',
      symbol: 'image://assets/image/timg.png',
      symbolSize: [50, 50],
      value: 0,
      currentId: '0',
      itemStyle: {
        lineStyle: {
          curveness: 0.1
        },
      },
      checked: false,
      children: []
    };
    this.chartOption.series[0].data.push(option1);
    this.equipmentList.forEach(item => {
      this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
    });
    this.getDeviceTypeList();
    this.getVersionList();
    this.getProgressTopology();
    this.getFirstDeviceLine(0);
  }
  // 销毁实时调用接口
  chooseAll() {
    this.cleanTreeData();
    if (this.chooseType === '1') {
      this.showEquipmentList = [{
        key: '已选择全部设备',
        color: '',
        type: '全部'
      }];
    } else {
      this.showEquipmentList = [];
    }
    this.checkColor();
  }
  // 获取第一层设备,index：1刷新 0不是刷新
  getFirstDeviceLine(index) {
    this.IPData = {};
    // tslint:disable-next-line: max-line-length
    const data = [{ IP: '192.168.1.110', Index: '192.168.1.110/1', ID: '1', DevNam: 'KJF130', SoftVer: 'Ver1.5', HardVer: 'Ver0.1' }, { IP: '192.168.1.113', Index: '192.168.1.113/1', ID: '1', DevNam: 'KJF130', SoftVer: 'Ver1.4', HardVer: 'Ver0.1' }, { IP: '192.168.1.114', Index: '192.168.1.114/1', ID: '1', DevNam: 'KJF130', SoftVer: 'Ver1.5', HardVer: 'Ver0.1' }, { IP: '192.168.1.116', Index: '192.168.1.116/1', ID: '1', DevNam: 'KJF130', SoftVer: 'Ver1.5', HardVer: 'Ver0.1' }, { IP: '192.168.1.115', Index: '192.168.1.115/1', ID: '1', DevNam: 'KJF130', SoftVer: 'Ver1.5', HardVer: 'Ver0.1' }];
    const arr = data;
    for (let i = 0; i < arr.length; i++) {
      const str = JSON.stringify(data);
      console.log(str);
      // 这里注意增加的currentId，0-i代表第0个下的第i个，0代表电脑，i代表分站序号
      let indexArray = [];
      if (arr[i].Index) {
        indexArray = arr[i].Index.split('/');
      }
      const option = {
        name: '',
        symbol: 'image://assets/image/' + arr[i].DevNam + '.png',
        symbolSize: [50, 50],
        value: i,
        currentId: indexArray[0] + '-' + indexArray[1],
        itemStyle: {
          lineStyle: {
            curveness: 0.1
          },
        },
        checked: false,
        children: []
      };
      this.IPData[arr[i].IP] = i;
      // 把option合并进arr[i];
      Object.assign(arr[i], option);
      this.chartOption.series[0].data[0].children.push(arr[i]);
    }
    this.echartsIntance.clear();
    this.echartsIntance.setOption(this.chartOption);
    if (index === 1) {
      this.msg.success('刷新成功');
    }
  }
  // 左键点击第一层设备时调用
  onChartClick(event) {
    const arr = event.data.currentId.split('-');
    if (arr[0].indexOf('192.168') !== -1) {
      if (this.chartOption.series[0].data[0].children[event.data.value].children.length === 0) {
        console.log('调接口');
        this.getMoreDeviceLine(event.data.IP, event.data.value);
      }
    }
  }
  // 点到哪个节点，就把哪个节点的value传进来，获取数据后在第index个节点上赋值
  getMoreDeviceLine(ip, index) {
    this.chartOption.series[0].data[0].children[index].children = [];
    // tslint:disable-next-line: max-line-length
    const data = { RS485: [{ Port: 'RS485_1', Devices: [{ RS485: [{ Port: 'RS485_2', Devices: [{ RS485: [{ Port: 'RS485_2', Devices: [{ Index: '192.168.1.110/1/RS485_1/1/RS485_2/1/RS485_2/1', ID: '1', DevNam: 'KGE28', SoftVer: 'Ver1.0', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_1/1/RS485_2/1/RS485_2/2', ID: '2', DevNam: 'KGE28', SoftVer: 'Ver1.0', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_1/1/RS485_2/1/RS485_2/3', ID: '3', DevNam: 'KGE28', SoftVer: 'Ver1.0', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_1/1/RS485_2/1/RS485_2/4', ID: '4', DevNam: 'KGE28', SoftVer: 'Ver1.0', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_1/1/RS485_2/1/RS485_2/6', ID: '6', DevNam: 'KGE28', SoftVer: 'Ver1.0', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_1/1/RS485_2/1/RS485_2/7', ID: '7', DevNam: 'KGE28', SoftVer: 'Ver1.0', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_1/1/RS485_2/1/RS485_2/5', ID: '5', DevNam: 'KGE28', SoftVer: 'Ver1.0', HardVer: 'Ver0.1' }] }], Index: '192.168.1.110/1/RS485_1/1/RS485_2/1', ID: '1', DevNam: 'KJF130', SoftVer: 'Ver1.5', HardVer: 'Ver0.1' }] }, { Port: 'RS485_3', Devices: [{ Index: '192.168.1.110/1/RS485_1/1/RS485_3/1', ID: '1', DevNam: 'CH4', SoftVer: 'Ver1.1', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_1/1/RS485_3/2', ID: '2', DevNam: 'CH4', SoftVer: 'Ver1.1', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_1/1/RS485_3/3', ID: '3', DevNam: 'CH4', SoftVer: 'Ver1.1', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_1/1/RS485_3/4', ID: '4', DevNam: 'CH4', SoftVer: 'Ver1.1', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_1/1/RS485_3/5', ID: '5', DevNam: 'CH4', SoftVer: 'Ver1.1', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_1/1/RS485_3/6', ID: '6', DevNam: 'CH4', SoftVer: 'Ver1.1', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_1/1/RS485_3/7', ID: '7', DevNam: 'CH4', SoftVer: 'Ver1.1', HardVer: 'Ver0.1' }] }], CAN: [{ Port: 'CAN_1', Devices: [{ Index: '192.168.1.110/1/RS485_1/1/CAN_1/1', ID: '1', DevNam: 'KCC2-5', SoftVer: 'Ver1.0', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_1/1/CAN_1/2', ID: '2', DevNam: 'KCC2-5', SoftVer: 'Ver1.0', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_1/1/CAN_1/3', ID: '3', DevNam: 'KCC2-5', SoftVer: 'Ver1.0', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_1/1/CAN_1/4', ID: '4', DevNam: 'KCC2-5', SoftVer: 'Ver1.0', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_1/1/CAN_1/5', ID: '5', DevNam: 'KCC2-5', SoftVer: 'Ver1.0', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_1/1/CAN_1/6', ID: '6', DevNam: 'KCC2-5', SoftVer: 'Ver1.0', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_1/1/CAN_1/7', ID: '7', DevNam: 'KCC2-5', SoftVer: 'Ver1.0', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_1/1/CAN_1/8', ID: '8', DevNam: 'KCC2-5', SoftVer: 'Ver1.0', HardVer: 'Ver0.1' }] }], Index: '192.168.1.110/1/RS485_1/1', ID: '1', DevNam: 'KJF130', SoftVer: 'Ver1.5', HardVer: 'Ver0.1' }] }, { Port: 'RS485_2', Devices: [{ Index: '192.168.1.110/1/RS485_2/1', ID: '1', DevNam: 'GJG3', SoftVer: 'Ver1.1', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_2/2', ID: '2', DevNam: 'GJG3', SoftVer: 'Ver1.1', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_2/3', ID: '3', DevNam: 'GJG3', SoftVer: 'Ver1.1', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_2/4', ID: '4', DevNam: 'GJG3', SoftVer: 'Ver1.1', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_2/5', ID: '5', DevNam: 'GJG3', SoftVer: 'Ver1.1', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_2/6', ID: '6', DevNam: 'GJG3', SoftVer: 'Ver1.1', HardVer: 'Ver0.1' }, { Index: '192.168.1.110/1/RS485_2/7', ID: '7', DevNam: 'GJG3', SoftVer: 'Ver1.1', HardVer: 'Ver0.1' }] }], Index: '192.168.1.110/1', ID: '1', DevNam: 'KJF130', SoftVer: 'Ver1.5', HardVer: 'Ver0.1' };
    const str = JSON.stringify(data);
    console.log(str);
    const str1 = str.replace(/"RS485"/g, '"children"');
    const str2 = str1.replace(/"CAN"/g, '"children1"');
    const str3 = str2.replace(/"Devices"/g, '"children2"');
    const str4 = str3.replace(/"Port"/g, '"name"');
    const treeData = JSON.parse(str4);
    const indexArray = treeData.Index.split('/');
    treeData.currentId = indexArray[0];
    treeData.IP = ip;
    console.log(treeData);
    if (str.indexOf('CAN') !== -1 || str.indexOf('Devices') !== -1) {
      this.assignData(treeData);
    }
    this.checkPoint(treeData);
    this.chartOption.series[0].data[0].children[index].Index = treeData.Index;
    this.chartOption.series[0].data[0].children[index].children = treeData.children;
    this.echartsIntance.setOption(this.chartOption);
    console.log(JSON.stringify(this.chartOption));
  }
  // echarts的鼠标事件，右键选中设备，更改设备图标
  onChartInit(ec) {
    this.echartsIntance = ec;
    // 去除默认的鼠标事件
    document.oncontextmenu = function () { return false; };
    // 新加上鼠标右击事件
    ec.on('contextmenu', (params) => {
      this.changeImage(null, params.data.currentId);
    });
    console.log(this.chartOption.series[0].data[0]);
  }
  changeImage(data, currentId) {
    const idArray = currentId.split('-');
    if (data === null) {
      data = this.chartOption.series[0].data[0];
      for (const item of data.children) {
        if (idArray[0] === item.IP) {
          idArray.splice(0, 1);
          this.changeImage(item, idArray.join('-'));
          return;
        }
      }
    }
    // 去除第一个id，继续往下找，直到最后一个，比如0-2-1-3，去除0，在第2层找2，继续去除2，在第3层找1，去除1，在第4层找3
    // 直到item为空时，表示已经为当前选中的节点
    const item = idArray.splice(0, 1)[0];
    console.log(currentId);
    console.log(item);
    console.log(data.children);
    if (data.children && data.children.length > 0 && item !== '') {
      // item-1是因为后台逻辑，所以节点是从1算起，而不是0
      this.changeImage(data.children[Number(item) - 1], idArray.join('-'));
    } else {
      const option = {
        key: data.Index,
        type: data.DevNam,
        color: '',
      };
      // --2为蓝色背景的图片文件
      if (data.symbol.indexOf('--2') === -1) {
        if (this.DeviceName !== data.DevNam) {
          this.msg.error('请选择正确的类型设备');
          return;
        }
        if (this.showEquipmentList.length > 0) {
          if (this.showEquipmentList[0].type === '全部') {
            this.msg.info('选择更新设备为全部设备');
            return;
          }
          if (this.showEquipmentList[0].type !== data.DevNam) {
            this.msg.error('只允许升级同种类型设备');
            return;
          }
        }
        data.symbol = 'image://assets/image/' + data.DevNam + '--2.png';
        if (this.localDevicesList.indexOf(data.DevNam) === -1) {
          data.symbol = 'image://assets/image/default--2.png';
        }
        data.checked = true;
        this.showEquipmentList.push(option);
        this.checkColor();
        this.echartsIntance.setOption(this.chartOption);
        return;
      }
      if (data.symbol.indexOf('--2') !== -1) {
        data.symbol = 'image://assets/image/' + data.DevNam + '.png';
        if (this.localDevicesList.indexOf(data.DevNam) === -1) {
          data.symbol = 'image://assets/image/default.png';
        }
        data.checked = false;
        const index = this.showEquipmentList.findIndex((value) => {
          return value.key === data.Index;
        });
        if (index !== -1) {
          this.showEquipmentList.splice(index, 1);
        }
        this.checkColor();
        this.echartsIntance.setOption(this.chartOption);
        return;
      }
    }
  }
  // 合并RS485、CAN、Device在同一个数组里
  assignData(dict) {
    if (dict.children && dict.children1) {
      dict.children = dict.children.concat(dict.children1);
    }
    if (!dict.children && dict.children1) {
      dict.children = dict.children1;
    }
    if (dict.children && dict.children2) {
      dict.children = dict.children.concat(dict.children2);
    }
    if (!dict.children && dict.children2) {
      dict.children = dict.children2;
    }
    if (dict.children && dict.children.length > 0) {
      for (const item of dict.children) {
        if (item.children || item.children1 || item.children2) {
          this.assignData(item);
        }
      }
    }
  }
  // 接口获取到数据后，补充数据，为节点添加图片以及样式，补充currentId
  checkPoint(dict) {
    const option = {
      symbol: '',
      symbolSize: [10, 10],
      checked: false,
      itemStyle: {
        lineStyle: {
          curveness: 0.1
        }
      },
    };
    if (dict.DevNam) {
      option.symbolSize = [50, 50];
      option.symbol = 'image://assets/image/' + dict.DevNam + '.png';
    }
    if (this.localDevicesList.indexOf(dict.DevNam) === -1 && !dict.name) {
      option.symbolSize = [50, 50];
      option.symbol = 'image://assets/image/default.png';
    }
    Object.assign(dict, option);
    if (dict.children) {
      for (let i = 0; i < dict.children.length; i++) {
        // 循环重复，按照上一层的currentId，不断往下补充
        dict.children[i].currentId = dict.currentId + '-' + (i + 1);
        this.checkPoint(dict.children[i]);
      }
    }
  }

  // --------------------------------------------------以上为树状图的逻辑---------------------------------------------------------

  // 以下三个为获取选择器内容的数据接口
  getDeviceTypeList() {
    this.deviceTypeList = ['KJF130', 'KGE28', 'CH4', 'KCC2-5', 'GJG3'];
    this.DeviceName = this.deviceTypeList[0];
  }
  getVersionList() {
    this.firmwareVersionList = ['GD3', 'KJF130', 'KCC2-5', 'GJG3', 'CH4'];
  }
  // 下载进度列表数据接口
  getProgressTopology() {
    // tslint:disable-next-line: max-line-length
    this.equipmentDetailList = [{ Index: '192.168.1.110/1', DevNam: 'KJF130', SrcVer: 'Ver0.1', DstVer: 'v1.0.0', Progress: '100' }, { Index: '192.168.1.110/1/RS485_3/1', DevNam: 'KCC2-5', SrcVer: 'Ver0.1', DstVer: 'v1.0.0', Progress: '100' }, { Index: '192.168.1.110/1/RS485_3/2', DevNam: 'KCC2-5', SrcVer: 'Ver0.1', DstVer: 'v1.0.0', Progress: '100' }, { Index: '192.168.1.110/1/RS485_3/3', DevNam: 'KCC2-5', SrcVer: 'Ver0.1', DstVer: 'v1.0.0', Progress: '100' }, { Index: '192.168.1.110/1/RS485_3/4', DevNam: 'KCC2-5', SrcVer: 'Ver0.1', DstVer: 'v1.0.0', Progress: '100' }, { Index: '192.168.1.110/1/RS485_3/5', DevNam: 'KCC2-5', SrcVer: 'Ver0.1', DstVer: 'v1.0.0', Progress: '100' }, { Index: '192.168.1.110/1/RS485_3/6', DevNam: 'KCC2-5', SrcVer: 'Ver0.1', DstVer: 'v1.0.0', Progress: '100' }, { Index: '192.168.1.110/1/RS485_3/7', DevNam: 'KCC2-5', SrcVer: 'Ver0.1', DstVer: 'v1.0.0', Progress: '100' }, { Index: '192.168.1.110/1/RS485_3/8', DevNam: 'KCC2-5', SrcVer: 'Ver0.1', DstVer: 'v1.0.0', Progress: '100' }];
  }
  showModal(): void {
    this.alert = '';
    this.isVisible = true;
    if (this.showEquipmentList.length === 0 && this.chooseType !== '1') {
      this.alert = '请选择设备！';
      return;
    }
    if (this.firmwareVersion === '' || this.versionHistory === '') {
      this.alert = '请完善固件版本！';
      return;
    }
  }
  // 设备升级
  handleOk(): void {
    this.isVisible = false;
    if (this.alert === '') {
      const data = {
        DevNam: this.DeviceName,
        UID: this.versionHistory,
        DeviceIndexs: []
      };
      if (this.chooseType === '0') {
        for (const item of this.showEquipmentList) {
          data.DeviceIndexs.push(item.key);
        }
      }
      this.msg.success('升级成功', {
        nzDuration: 5000
      });
      this.cleanTreeData();
    }
  }
  handleCancel(): void {
    this.isVisible = false;
  }
  // 重置树状图
  cleanTreeData() {
    if (this.showEquipmentList.length > 0) {
      if (!(this.chooseType === '1' && this.showEquipmentList[0].type === '全部')) {
        this.showEquipmentList = [];
      }
      // 清楚所有被选中的节点状态，更换节点图标
      const str = JSON.stringify(this.chartOption.series[0].data[0]);
      const str1 = str.replace(/--2.png/g, '.png');
      const str2 = str1.replace(/"checked":true/g, '"checked":false');
      this.chartOption.series[0].data[0] = JSON.parse(str2);
      this.echartsIntance.setOption(this.chartOption);
    }
  }
  // 刷新
  refreshTree() {
    this.chartOption.series[0].data = [];
    this.showEquipmentList = [];
    const option1 = {
      name: '',
      symbol: 'image://assets/image/timg.png',
      symbolSize: [50, 50],
      value: 0,
      currentId: '0',
      itemStyle: {
        lineStyle: {
          curveness: 0.1
        },
      },
      checked: false,
      children: []
    };
    this.chartOption.series[0].data.push(option1);
    this.getFirstDeviceLine(1);
  }
  // 选择器重新选择后，重置树形图
  changeDeviceName() {
    if (this.showEquipmentList.length > 0) {
      this.cleanTreeData();
    }
  }
  checkColor() {
    if (this.showEquipmentList.length > 0) {
      for (let i = 0; i < this.showEquipmentList.length; i++) {
        if (i % 6 === 1) {
          this.showEquipmentList[i].color = '#f7a400';
        }
        if (i % 6 === 2) {
          this.showEquipmentList[i].color = '#3a9efd';
        }
        if (i % 6 === 3) {
          this.showEquipmentList[i].color = '#ff6150';
        }
        if (i % 6 === 4) {
          this.showEquipmentList[i].color = '#58b368';
        }
        if (i % 6 === 5) {
          this.showEquipmentList[i].color = '#D08EF1';
        }
        if (i % 6 === 0) {
          this.showEquipmentList[i].color = '#a7a8a9';
        }
      }
    }
  }




  // -----------------------------------------------------------列表----------------------------------------------------------


  convertTreeToList(root: object): TreeNodeInterface[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: any }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.id]) {
      hashMap[node.id] = true;
      array.push(node);
    }
  }
  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.detailList1.every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate = this.detailList1.some(item => this.mapOfCheckedId[item.id]) && !this.isAllDisplayDataChecked;
  }
  checkAll(value: boolean): void {
    this.detailList1.forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }
  showDetail1(data, i: number, k: number) {
    if (data.detail) {
      console.log(data);
      console.log(i);
      console.log(k);
      this.selected1 = i;
      this.selected2 = k;
      this.choosed1 = true;
      this.selected3 = null;
      this.selected4 = null;
      this.choosed2 = false;
      this.detailList1 = data.detail;
      this.detailList1.forEach(item => {
        this.mapOfExpandedData2[item.id] = this.convertTreeToList(item);
      });
    }
  }
  showDetail2(data, i: number, k: number) {
    if (data.detail) {
      this.selected3 = i;
      this.selected4 = k;
      this.choosed2 = true;
      this.detailList2 = data.detail;
    } else {
      this.selected3 = null;
      this.selected4 = null;
      this.choosed2 = false;
      this.detailList2 = [];
    }
  }
}
