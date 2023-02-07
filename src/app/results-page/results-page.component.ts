import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/api-service.service';
import { NgxSpinnerService } from "ngx-spinner";


  
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


export class ResultsPageComponent implements OnInit {
  dataSource:any;
  
  constructor(private router: Router,private apiService: ApiServiceService,private route:ActivatedRoute,private spinner: NgxSpinnerService) { }

  ngOnInit(): void { 
    this.spinner.show(); 
   this.route.queryParams.subscribe(params => {
      console.log(localStorage.getItem('apiSpec'),localStorage.getItem('tech'))
      if(localStorage.getItem('tech')==='Open Spec API'){
      this.apiService.getResults(localStorage.getItem('apiSpec')).subscribe((data)=>{
        console.log("data",data);
        this.dataSource = data;
        this.spinner.hide();
    });
    }
    else{
     // this.SpinnerService.show(); 
      if(localStorage.getItem('tech')==='GraphQL'){
       this.apiService.getResultsforGraphQl(localStorage.getItem('apiSpec')).subscribe((data)=>{
          console.log("data",data);
         // this.SpinnerService.hide();
          this.dataSource = data;
          this.spinner.hide();
      });
      }
      
    }
    });
  }
  
  goBack(){
    this.router.navigate(['']);
  }

  displayedColumns: string[] = ['className', 'method', 'baseUrl', 'path','payloadJson','pathParam','requestParam',
  'responseTime','expectedStatus','responseStatus','passedOrFailed','exceptionMessage'];
}
