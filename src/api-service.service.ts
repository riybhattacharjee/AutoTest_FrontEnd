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
  ngrokUrl='https://6480-2401-4900-1cbd-e3d7-b448-6d69-79ee-1996.in.ngrok.io';
  public content = new BehaviorSubject<any>(this.name);  
  public share = this.content.asObservable();
  constructor(private httpClient: HttpClient,
    ) {
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
     const req = new HttpRequest('POST',  this.ngrokUrl+this.url, formData,{
      reportProgress: true,
      responseType: 'json'
    }); 
    
    return this.httpClient.request(req); 
  }

  //Home Page Generate Api for open api & graphql
  getResultsForApiOnlyWithoutFile(baseUrl:string): Observable<HttpEvent<any>> { 
    this.technology=localStorage.getItem('technology');
    console.log("get api results for "+this.technology)
    this.url =`/api/autotest/generate-api-details`;  
    const formData: FormData = new FormData();
    formData.append('baseUrl', baseUrl);
    formData.append('inputSource', this.technology);
    const req = new HttpRequest('POST',  this.ngrokUrl+this.url, formData,{
      reportProgress: true,
      responseType: 'json'
    });
   
    return this.httpClient.request(req);
  }

  public passDatatoResultsPage(data:any){
  this.content.next(data)
  }

  //Results Page Generate Report button
  public resendSelectedItems(selectedRowstoSend:Array<any>){  
    this.technology=localStorage.getItem('technology');
    const req = new HttpRequest('POST', this.ngrokUrl+`/api/autotest/generate-test-results?inputSource=`+this.technology, selectedRowstoSend, {
      reportProgress: true,
      responseType: 'json'
    });
   
    return this.httpClient.request(req);
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
