import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription'; 

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  url:string|undefined;
  jsonResponseList:Array<any> | undefined;
  name: any=null;
  technology:any;
  apikey:any;
  apitokenVal:any;
  req:any;
  ngrokUrl='https://1023-2401-4900-1cbd-ffa9-6154-12f6-3300-8178.in.ngrok.io';
  public content = new BehaviorSubject<any>(this.name);  
  public share = this.content.asObservable();

  invokeFirstComponentFunction = new EventEmitter();    
  subsVar: Subscription | undefined;   

  constructor(private httpClient: HttpClient,
    ) {
    }

    onFirstComponentButtonClick(email:string) {    
      this.invokeFirstComponentFunction.emit(email); 
      console.log(email)   
    }

     //Home Page Generate Api for Jar
  getResultsForApiOnly(file: File,baseUrl:string): Observable<HttpEvent<any>> {
    console.log("get api results for jar")
    this.technology=localStorage.getItem('technology');
    this.url =`/api/autotest/generate-api-details`;  
    const formData: FormData = new FormData();
    formData.append('jarFile', file);
    formData.append('baseUrl', baseUrl);
    formData.append('inputSource', this.technology);
    console.log(localStorage.getItem('enableAuthParametersVal'))
    if(localStorage.getItem('enableAuthParametersVal')=='true'){ //when auth token checkbox enabled
      this.apikey=localStorage.getItem('apiKey')
      this.apitokenVal=localStorage.getItem('apiToken')
      formData.append('authTokenKey', this.apikey);
      formData.append('authTokenValue', this.apitokenVal);
      this.req = new HttpRequest('POST',  this.ngrokUrl+this.url, formData,{
        reportProgress: true,
        responseType: 'json'
      }); 
    }
    else{
     this.req = new HttpRequest('POST',  this.ngrokUrl+this.url, formData,{
      reportProgress: true,
      responseType: 'json'
    }); 
  }
    console.log(this.req)
    return this.httpClient.request(this.req); 
  }

  //Home Page Generate Api for open api & graphql
  getResultsForApiOnlyWithoutFile(baseUrl:string): Observable<HttpEvent<any>> { 
    this.technology=localStorage.getItem('technology');
    console.log("get api results for "+this.technology)
    this.url =`/api/autotest/generate-api-details`;  
    const formData: FormData = new FormData();
    formData.append('baseUrl', baseUrl);
    formData.append('inputSource', this.technology);
    if(localStorage.getItem('enableAuthParametersVal')=='true'){ //when auth token checkbox enabled
      this.apikey=localStorage.getItem('apiKey')
      this.apitokenVal=localStorage.getItem('apiToken')
      formData.append('authTokenKey', this.apikey);
      formData.append('authTokenValue', this.apitokenVal);
      this.req = new HttpRequest('POST',  this.ngrokUrl+this.url, formData,{
        reportProgress: true,
        responseType: 'json'
      }); 
    }
    else{
     this.req = new HttpRequest('POST',  this.ngrokUrl+this.url, formData,{
      reportProgress: true,
      responseType: 'json'
    }); 
  }
    console.log(this.req)
    return this.httpClient.request(this.req); 
  }

  public passDatatoResultsPage(data:any){
  this.content.next(data)
  }

  //Results Page Generate Report button
  public resendSelectedItems(selectedRowstoSend:Array<any>){  
    this.technology=localStorage.getItem('technology');
    const formData: FormData = new FormData();
    //formData.append('jsonResponseList', selectedRowstoSend);
    if(localStorage.getItem('enableAuthParametersVal')=='true'){ //when auth token checkbox enabled
      this.apikey=localStorage.getItem('apiKey')
      this.apitokenVal=localStorage.getItem('apiToken')
      formData.append('authTokenKey', this.apikey);
      formData.append('authTokenValue', this.apitokenVal);
    this.req = new HttpRequest('POST', this.ngrokUrl+`/api/autotest/generate-test-results?inputSource=`+this.technology, {authTokenKey:this.apikey,authTokenValue:this.apitokenVal,jsonResponseList:selectedRowstoSend}, {
      reportProgress: true,
      responseType: 'json'
    });
  }
  else{
    console.log("in else")
    this.req = new HttpRequest('POST', this.ngrokUrl+`/api/autotest/generate-test-results?inputSource=`+this.technology, {jsonResponseList:selectedRowstoSend}, {
      reportProgress: true,
      responseType: 'json'
    });
  }
    return this.httpClient.request(this.req);
  }

  public emailApi(emailId:string,data:Array<any>){
    return this.httpClient.post(this.ngrokUrl+`/api/autotest/sendReportToMail`, {emailId: emailId, data: data})
  }

  //Unused code

  //   getResults(file: File,baseUrl:string): Observable<HttpEvent<any>> { //Home Page Generate Report
//     console.log("get results with file")
//     if(localStorage.getItem("technology")=='open-api-specification'){
//  this.url =this.ngrokUrl+`/api/openApi/java/generate-report-from-url?apiUrl=`;
//     }
//     else{
//       if(localStorage.getItem("technology")=='graphql'){
//         this.url =this.ngrokUrl+`/api/graphql/apiTest=`;
//       }
//     }

//     const formData: FormData = new FormData();
//     formData.append('excelFile', file);
//      const req = new HttpRequest('POST',  this.url+baseUrl, formData, {
//       reportProgress: true,
//       responseType: 'json'
//     }); 
//     console.log(req)
//     return this.httpClient.request(req);
  
  
//   }



// getResultswithoutFile(baseUrl:string): Observable<HttpEvent<any>> { //Home Page Generate Report without any file
//   console.log("called")
//   if(localStorage.getItem("technology")=='open-api-specification'){
// this.url =`/api/openApi/java/urlWithFile?apiUrl`;
//   }
//   else{
//     if(localStorage.getItem("technology")=='GraphQL'){
//       //this.url =`/api/graphql/apiTest`;
//       this.url =`/api/autotest/generate-test-results?inputSource=`;
//     }
//   }

//   const formData: FormData = new FormData();
//   formData.append('baseUrl',baseUrl);
//    const req = new HttpRequest('POST',  this.ngrokUrl+this.url+this.technology, formData, {
//     reportProgress: true,
//     responseType: 'json'
//   }); 
//   console.log(req)
//   return this.httpClient.request(req);


// }


//   getResultsForApiOnly(file: File,baseUrl:string): Observable<HttpEvent<any>> {
//     const url = this.ngrokUrl+'/api/autotest/generate-api-details';
//     let queryParams = new HttpParams();
//     //queryParams.append('jarFile', file);
//     queryParams=queryParams.append('baseUrl', baseUrl);
//     queryParams=queryParams.append('inputSource', this.technology);
//     return this.httpClient.get<HttpEvent<any>>(url,{params:queryParams});
// }

// upload(baseUrl:string,jarFile:File): Observable<HttpEvent<any>> {
  //   const formData: FormData = new FormData();
  //   formData.append('baseUrl',baseUrl)
  //  // formData.append('excelFile', file);
  //   formData.append('jarFile',jarFile);  
  //   const req = new HttpRequest('POST', `http://localhost:8095/api/openApi/test-jar`, formData, {
  //     reportProgress: true,
  //     responseType: 'json'
  //   });
  //   return this.httpClient.request(req);
  // }
}
