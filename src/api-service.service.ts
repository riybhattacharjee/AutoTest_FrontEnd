import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  API_KEY = 'YOUR_API_KEY';

  constructor(private httpClient: HttpClient) {}

  public getResults(api: any) {
    return this.httpClient.get(
      `https://3b2d-2401-4900-1cbc-9230-72-ddc9-21fb-cb9c.in.ngrok.io/openApi/java/url?apiUrl=`+api);
  }

  public getResultsforGraphQl(api:any){
    return this.httpClient.get(
      `http://localhost:8082/graphql/apiTest?baseUrl=`,api);
  }

  // public viewResults() {
  //   //return this.httpClient.get(`https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=${this.API_KEY}`);
  // }

  public sendFile(file: File | undefined) {
    return this.httpClient.get(
      ``,
      { responseType: 'text' }
    );
    //return file;
  }

  
}
