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
  technology:any;
  ngrokUrl='https://66a8-2409-40f2-30-b407-2089-cca5-66aa-d9bc.in.ngrok.io';
  public content = new BehaviorSubject<any>(this.name);  
  public share = this.content.asObservable();
  constructor(private httpClient: HttpClient,
    ) {
this.technology=localStorage.getItem('technology');
console.log(this.technology)
    }

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

  getResultsForApiOnly(file: File,baseUrl:string): Observable<HttpEvent<any>> { //Home Page Generate Api for Jar
    this.url =`/api/autotest/generate-api-details`;  
    const formData: FormData = new FormData();
    formData.append('jarFile', file);
    formData.append('baseUrl', baseUrl);
    formData.append('inputSource', this.technology);
     const req = new HttpRequest('POST',  this.url, formData, {
      reportProgress: true,
      responseType: 'json'
    }); 
    console.log(req)
    return this.httpClient.request(req);
  
  
  }

  getResultsForApiOnlyWithoutFile(baseUrl:string): Observable<HttpEvent<any>> { //Home Page Generate Api
    this.url =`/api/autotest/generate-api-details?baseUrl=`;    
    console.log("getResultsForApiOnlyWithoutFile",this.ngrokUrl+this.url+baseUrl+'&inputSource='+this.technology)
     const req = new HttpRequest('GET',  this.ngrokUrl+this.url+baseUrl+'&inputSource='+this.technology,{
      reportProgress: true,
      responseType: 'json'
    }); 
    return this.httpClient.request(req);
  }

  public passDatatoResultsPage(data:any){
  this.content.next(data)
  }

  upload(baseUrl:string,jarFile:File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('baseUrl',baseUrl)
   // formData.append('excelFile', file);
    formData.append('jarFile',jarFile);  
    const req = new HttpRequest('POST', `http://localhost:8095/api/openApi/test-jar`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.httpClient.request(req);
  }

  //testEditedData
  public resendSelectedItems(selectedRowstoSend:Array<any>){  //Results Page Generate Report button
    const req = new HttpRequest('POST', this.ngrokUrl+`/api/autotest/generate-test-results?inputSource=`+this.technology, selectedRowstoSend, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.httpClient.request(req);
  }
}
