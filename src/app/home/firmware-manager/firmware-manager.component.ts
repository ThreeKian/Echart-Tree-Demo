import { Component, OnInit, NgZone } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpEvent } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UploadFile, UploadXHRArgs } from 'ng-zorro-antd/upload';
import { filter, retry } from 'rxjs/operators';
import { ApiService } from 'src/app/service/api.service';
import { Subscription, Observable, timer } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-firmware-manager',
  templateUrl: './firmware-manager.component.html',
  styleUrls: ['./firmware-manager.component.less']
})
export class FirmwareManagerComponent implements OnInit {
  defaultExpandedKeys = ['0', '1', '2', '3'];
  total = 0;
  pageIndex = 1;
  loading = false;
  DevNamelList = [];
  equipmentList = [];
  file = null;
  hideUpload = false;
  PrgName = '';
  CompileTime = '';

  isVisibleMiddle = false;
  DeviceName = '';
  DeviceNameList = [{
    equipmentID: 0,
    equipmentName: 'KJF16B分站'
  }];
  firmwareVersionList = [{
    versionID: 0,
    versionName: 'V 1.0.3'
  }];
  isOkLoading = false;
  canClose = true;
  hardVersion = '';
  softVersion = '';
  constructor(private http: HttpClient, private msg: NzMessageService, private ngZone: NgZone) {

  }

  ngOnInit() {
    this.GetAllDevName();
  }
  GetAllDevName() {
    this.DevNamelList = ['KJF130', 'GD3', 'CH4', 'KCC2-5', 'GJG3'];
  }
  showList(DevName) {
    // tslint:disable-next-line: max-line-length
    this.equipmentList = [{ UID: 14554422015016960, DevName: 'KJF130', PrgName: 'ER_IROM1', PrgLg: 288240, SoftVer: 'Ver1.7', HardVer: 'Ver0.1', PrgCRC: 16863, CompileTime: '0201-12-13T14:43:16', SaveTime: '2019-12-13T14:43:43', BinData: null }, { UID: 14554439955431424, DevName: 'KJF130', PrgName: 'ER_IROM1', PrgLg: 288240, SoftVer: 'Ver1.8', HardVer: 'Ver0.1', PrgCRC: 12510, CompileTime: '0201-12-13T15:00:55', SaveTime: '2019-12-13T15:01:58', BinData: null }, { UID: 14551216818503680, DevName: 'KJF130', PrgName: 'ER_IROM1', PrgLg: 288240, SoftVer: 'Ver1.6', HardVer: 'Ver0.1', PrgCRC: 50306, CompileTime: '0201-12-11T08:22:48', SaveTime: '2019-12-11T08:23:13', BinData: null }, { UID: 14550302674665472, DevName: 'KJF130', PrgName: 'ER_IROM1', PrgLg: 285672, SoftVer: 'Ver1.4', HardVer: 'Ver0.1', PrgCRC: 18700, CompileTime: '0201-12-10T16:52:53', SaveTime: '2019-12-10T16:53:18', BinData: null }, { UID: 14550165762555904, DevName: 'KJF130', PrgName: 'ER_IROM1', PrgLg: 266948, SoftVer: 'Ver1.1', HardVer: 'Ver0.1', PrgCRC: 41828, CompileTime: '0201-12-10T14:33:35', SaveTime: '2019-12-10T14:34:02', BinData: null }, { UID: 14551216310534144, DevName: 'KJF130', PrgName: 'ER_IROM1', PrgLg: 288240, SoftVer: 'Ver1.5', HardVer: 'Ver0.1', PrgCRC: 27646, CompileTime: '0201-12-11T08:21:20', SaveTime: '2019-12-11T08:22:42', BinData: null }, { UID: 14550165049622528, DevName: 'KJF130', PrgName: 'ER_IROM1', PrgLg: 266948, SoftVer: 'Ver1.0', HardVer: 'Ver0.1', PrgCRC: 52127, CompileTime: '0201-12-10T14:29:03', SaveTime: '2019-12-10T14:33:18', BinData: null }, { UID: 14550288021962752, DevName: 'KJF130', PrgName: 'ER_IROM1', PrgLg: 285564, SoftVer: 'Ver1.3', HardVer: 'Ver0.1', PrgCRC: 33733, CompileTime: '0201-12-10T16:38:07', SaveTime: '2019-12-10T16:38:24', BinData: null }, { UID: 14550256941842432, DevName: 'KJF130', PrgName: 'ER_IROM1', PrgLg: 285156, SoftVer: 'Ver1.2', HardVer: 'Ver0.1', PrgCRC: 46122, CompileTime: '0201-12-10T16:06:33', SaveTime: '2019-12-10T16:06:47', BinData: null }, { UID: 14554462183702528, DevName: 'KJF130', PrgName: 'ER_IROM1', PrgLg: 288240, SoftVer: 'Ver1.9', HardVer: 'Ver0.1', PrgCRC: 27224, CompileTime: '0201-12-13T15:08:31', SaveTime: '2019-12-13T15:24:34', BinData: null }];
  }
  // 显示模态框
  showModalMiddle() {
    this.DeviceName = '';
    this.hardVersion = '';
    this.softVersion = '';
    this.file = null;
    this.isVisibleMiddle = true;
  }
  customReq = (item: UploadXHRArgs) => {
    this.file = item.file;
    this.PrgName = item.file.name;
    console.log(this.file);
    this.hideUpload = true;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base = (event.target as any).result;
      // 以下方法为获取文件流内的信息，文件经过认为操作，把信息塞入编译好的文件流里面
      // 比如文件流从第1024字节开始存放设备名称，长度小于16字节
      // 1024+16处存放“软件版本号”，长度小于16字节
      // 1024+32处存放“硬件版本号”，长度小于16字节
      // 1024+48处存放固件编译日期，格式为：“Nov 18 2019”
      // 1024+64处存放固件编译时间，格式为：“14:08:15”
      // 获取设备名称
      const dataView = new DataView(base);
      let length = 0;
      while (length < 16 && dataView.getUint8(1024 + length) !== 0x00) {
        length++;
      }
      let buffer = base.slice(1024, 1024 + length);
      let gbkdecoder = new TextDecoder('gbk');
      let bytes = new Uint8Array(buffer);
      this.DeviceName = gbkdecoder.decode(bytes);
      // 获取软件版本
      length = 0;
      while (length < 16 && dataView.getUint8(1040 + length) !== 0x00) {
        length++;
      }
      buffer = base.slice(1040, 1040 + length);
      gbkdecoder = new TextDecoder('gbk');
      bytes = new Uint8Array(buffer);
      this.softVersion = gbkdecoder.decode(bytes);
      // 获取硬件版本
      length = 0;
      while (length < 16 && dataView.getUint8(1056 + length) !== 0x00) {
        length++;
      }
      buffer = base.slice(1056, 1056 + length);
      gbkdecoder = new TextDecoder('gbk');
      bytes = new Uint8Array(buffer);
      this.hardVersion = gbkdecoder.decode(bytes);
      // 获取编译日期
      length = 0;
      while (length < 10 && dataView.getUint8(1072 + length) !== 0x00) {
        length++;
      }
      buffer = base.slice(1072, 1072 + length);
      gbkdecoder = new TextDecoder('gbk');
      bytes = new Uint8Array(buffer);
      const date = gbkdecoder.decode(bytes);
      buffer = base.slice(1088, 1096);
      gbkdecoder = new TextDecoder('gbk');
      bytes = new Uint8Array(buffer);
      const time = gbkdecoder.decode(bytes);
      this.CompileTime = date + ' ' + time;
    };
    reader.readAsArrayBuffer(this.file);
    return timer(1000).subscribe(() => {
      item.onSuccess!({}, item.file!, {});
    });
  }
  removeFlie = (file: UploadFile) => {
    if (this.hideUpload === true) {
      this.hideUpload = false;
      return true;
    }
  }
  showAlert() {
    if (this.hideUpload === true) {
      this.msg.info('一次只支持上传一个文件');
    }
  }
  // 确认模态框
  handleOkMiddle() {
    if (this.DeviceName === '') {
      this.msg.create('error', '请完善内容后再提交');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base = (event.target as any).result;
      this.msg.info('上传成功');
      this.isVisibleMiddle = false;
      this.GetAllDevName();
      this.equipmentList = [];
    };
    reader.readAsArrayBuffer(this.file);
  }
  // 隐藏模态框
  handleCancelMiddle(): void {
    if (this.canClose === true) {
      this.isVisibleMiddle = false;
    }
  }
  removeFile = (file: UploadFile): boolean => {
    if (this.isOkLoading !== true) {
      this.file = null;
      return false;
    }
  }

}
