import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable, EMPTY, of, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  static API = {
    Add_Bin_File: 'AddBinFile', // 上传固件
    Get_All_DevName: 'GetAllDevName', // 侧栏列表
    Get_All_BinFile_Info_By_DevName: 'GetAllBinFileInfoByDevName?DevName=', // 固件列表
    Broadcast_For_Modbus_Devices: 'BroadcastForModbusDevices', // 发送广播包更新第一层设备
    Get_All_Modbus_Device: 'GetAllModbusDevice', //  获取第二层所有设备
    Get_Device_Topology: 'GetDeviceTopology?ip=', //  获取第三层所有设备
    Get_All_Device_Type_Online: 'GetAllDeviceTypeOnline', //  获取设备类型列表
    Upgrade_Devices_By_Type: 'UpgradeDevicesByType', //  获取固件版本
    Get_Progress_Topology: 'GetProgressTopology', //  获取列表
  };
  static DELAY = 1000;
  private debug = false;
  private baseUrl = `http://${'192.168.3.112:8001/api/Downloader/'}`;

  constructor(private http: HttpClient) {
  }

  get<T>(api: string, mock?: boolean): Observable<T> {
    if (this.debug || mock) {
      return this.mock(api);
    } else {
      return this.http
        .get<T>(`${this.baseUrl}${api}`)
        .pipe(
          catchError(error => {
            console.error(error);
            return EMPTY;
          })
        );
    }
  }

  post<T>(api: string, data: any, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: any;
    withCredentials?: boolean;
  }, mock?: boolean): Observable<T | any> {
    HttpErrorResponse
    if (this.debug || mock) {
      return this.mock(api);
    } else {
      return this.http
        .post<T>(`${this.baseUrl}${api}`, data, options)
        .pipe(
          timeout(api.includes('DeviceConfigIssue') ? 60 * 60 * 1000 : 15000),
          catchError(error => of({
            Data: null,
            IsSuccessful: 0,
            Message: (error instanceof TimeoutError) ? '网络请求超时' : `${error.message ? error.message : error}`
          }))
        );
    }
  }

  private mock<T>(api: string): Observable<T> {
    return this.http
      .get<T>(`/assets/mock${api}.json`)
      .pipe(
        catchError(error => {
          console.error(error);
          return EMPTY;
        })
      );
  }
}
