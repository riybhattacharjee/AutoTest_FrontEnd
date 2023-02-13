import { NONE_TYPE } from '@angular/compiler';
import { Component, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/api-service.service';
import { NgxSpinnerService } from "ngx-spinner";
import { LandingPageComponent } from '../landing-page/landing-page.component';
import { map, Observable } from 'rxjs';


  
  export interface DataSource {
  className: string;
  method: string;
  baseUrl: string;
  path:string;
  payloadJson:string;
  responseTime:string;
  expectedStatus:string;
  responseStatus:string;
  passedOrFailed:string;
  pathParam:string;
  requestParam:string;
  exceptionMessage:string;
}

@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.css']
})
@Injectable({
  providedIn: 'root',
})

export class ResultsPageComponent implements OnInit {
  dataSource:any;
  Globalfile?: FileList
  newFile?: FileList;
  newFile2?: FileList;
  sub:any;
  
  constructor(private router: Router,private apiService: ApiServiceService,
    private route:ActivatedRoute,private spinner: NgxSpinnerService,
    private landingPage:LandingPageComponent
    ) {}

  ngOnInit(): void { 
    //uncomment
    // this.spinner.show();  
    //   if(localStorage.getItem('tech')==='Open Spec API'){ 
    //   this.apiService.getResults(localStorage.getItem('apiSpec')).subscribe((data)=>{
    //     console.log("data",data);
    //     this.dataSource = data;
    //     this.spinner.hide();
    // });
    // }
    // else{
    //   if(localStorage.getItem('tech')==='GraphQL'){
    //    this.apiService.getResultsforGraphQl(localStorage.getItem('apiSpec')).subscribe((data)=>{
    //       console.log("data",data);
        
    //       this.dataSource = data;
    //       this.spinner.hide();
    //   });
    //   }
    // }  
     //uncomment till here

     //trial
     //const result = this.route.snapshot.queryParamMap.get('result');
    // this.dataService.getLogoutStatus.subscribe((data) => {
      this.apiService.content.subscribe((data) => {
        this.dataSource=data;
      })
      
  }



  goBack(){
    this.router.navigate(['']);
  }

  filetransfer(file?: FileList){
    
    this.Globalfile=file;
   
  }
  
  displayedColumns: string[] = ['className', 'method', 'baseUrl', 'path','payloadJson','pathParam','requestParam',
  'responseTime','expectedStatus','responseStatus','passedOrFailed','exceptionMessage'];
}
