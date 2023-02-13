import { HttpClient, HttpEvent, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LandingPageComponent } from './app/landing-page/landing-page.component';
import { ResultsPageComponent } from './app/results-page/results-page.component';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  url:string|undefined;
  name: any=null;
  public content = new BehaviorSubject<any>(this.name);  
  public share = this.content.asObservable();
  constructor(private httpClient: HttpClient,
    ) {}

  getResults(file: File,baseUrl:string): Observable<HttpEvent<any>> {
    console.log("called")
    if(localStorage.getItem("technology")=='Open Spec API'){
 this.url =`https://777c-2401-4900-1cbc-58fa-31ee-c1bd-1184-2589.in.ngrok.io/openApi/java/urlWithFile?apiUrl=`;
    }
    else{
      if(localStorage.getItem("technology")=='GraphQL'){
        this.url =`https://777c-2401-4900-1cbc-58fa-31ee-c1bd-1184-2589.in.ngrok.io/graphql/apiTest=`;
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
 this.url =`https://777c-2401-4900-1cbc-58fa-31ee-c1bd-1184-2589.in.ngrok.io/openApi/java/urlWithFile?apiUrl=`;
    }
    else{
      if(localStorage.getItem("technology")=='GraphQL'){
        this.url =`https://777c-2401-4900-1cbc-58fa-31ee-c1bd-1184-2589.in.ngrok.io/graphql/apiTest=`;
      }
    }

    const formData: FormData = new FormData();
    formData.append('baseUrl',baseUrl);
     const req = new HttpRequest('POST',  'https://777c-2401-4900-1cbc-58fa-31ee-c1bd-1184-2589.in.ngrok.io/graphql/apiTest', formData, {
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
      `http://localhost:8082/graphql/apiTest?baseUrl=`,api);
  }

  
  // getResults(baseUrl:any,file: File): Observable<HttpEvent<any>> {
  //   const formData: FormData = new FormData();

  //   formData.append('file', file);

  //   const req = new HttpRequest('POST', `https://859c-2401-4900-1cbc-9230-72-ddc9-21fb-cb9c.in.ngrok.io/openApi/java/urlWithFile?apiUrl=${baseUrl}`, formData, {
  //     reportProgress: true,
  //     responseType: 'json'
  //   });

  //   return this.httpClient.request(req);
  // }

  public sendFile(file: File | undefined) {
    return this.httpClient.get(
      ``,
      { responseType: 'text' }
    );
    //return file;
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

  // getFiles(): Observable<any> {
  //   return this.httpClient.get(`${this.baseUrl}/files`);
  // }
}
