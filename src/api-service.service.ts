import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  url:string|undefined;
  jsonResponseList:Array<any> | undefined;
  name: any=null;
  ngrokUrl='https://6a8c-2401-4900-1cbc-8443-d0e1-5b1f-c3e9-372.in.ngrok.io';
  public content = new BehaviorSubject<any>(this.name);  
  public share = this.content.asObservable();
  constructor(private httpClient: HttpClient,
    ) {}

  getResults(file: File,baseUrl:string): Observable<HttpEvent<any>> {
    console.log("called")
    if(localStorage.getItem("technology")=='Open Spec API'){
 this.url =this.ngrokUrl+`/openApi/java/urlWithFile?apiUrl=`;
    }
    else{
      if(localStorage.getItem("technology")=='GraphQL'){
        this.url =this.ngrokUrl+`/graphql/apiTest=`;
      }
    }

    const formData: FormData = new FormData();
    formData.append('excelFile', file);
     const req = new HttpRequest('POST',  this.url+baseUrl, formData, {
      reportProgress: true,
      responseType: 'json'
    }); 
    console.log(req)
    return this.httpClient.request(req);
  
  
  }

  getResultswithoutFile(baseUrl:string): Observable<HttpEvent<any>> {
    console.log("called")
    if(localStorage.getItem("technology")=='Open Spec API'){
 this.url =this.ngrokUrl+`/openApi/java/urlWithFile?apiUrl=`;
    }
    else{
      if(localStorage.getItem("technology")=='GraphQL'){
        this.url =this.ngrokUrl+`/graphql/apiTest=`;
      }
    }

    const formData: FormData = new FormData();
    formData.append('baseUrl',baseUrl);
     const req = new HttpRequest('POST',  this.ngrokUrl+'/graphql/apiTest', formData, {
      reportProgress: true,
      responseType: 'json'
    }); 
    console.log(req)
    return this.httpClient.request(req);
  
  
  }

  public passDatatoResultsPage(data:any){
  this.content.next(data)
  }

  public getResultsforGraphQl(api:any){
    return this.httpClient.get(
      this.ngrokUrl+`/graphql/apiTest?baseUrl=`,api);
  }

  
  upload(file: File,baseUrl:string,jarFile:File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('baseUrl',baseUrl)
    formData.append('excelFile', file);
    formData.append('jarFile',jarFile);  
    const req = new HttpRequest('POST', `http://localhost:8095/openApi/test-jar`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.httpClient.request(req);
  }

  //testEditedData
  public resendSelectedItems(selectedRowstoSend:Array<any>){
console.log(selectedRowstoSend);
    const req = new HttpRequest('POST', this.ngrokUrl+`/graphql/testEditedData`, selectedRowstoSend, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.httpClient.request(req);
  }
}
