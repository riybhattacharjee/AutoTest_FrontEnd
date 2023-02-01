import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceService } from 'src/api-service.service';

// const ELEMENT_DATA: DataSource[] = [
//   {class: 'org.testng.test.GenericTest', method: 'POST', baseURL: 'http://localhost:9010/', path: '/newUser',payload:'{"firstName":"Harii","lastName":"K","password":"password","role":"ADMIN","userName":"HariiK","userId":"usr3"}',pathParam:'{}',requestParam:'{}',responseTime:'5106',expectedStatus:'200',responseStatus:'200',passOrFail:'Passed'},
//   {class: 'org.testng.test.GenericTest', method: 'POST', baseURL: 'http://localhost:9010/',path: '/newUser',payload:'{"firstName":"Harii","lastName":"K","password":"password","role":"ADMIN","userName":"HariiK","userId":"usr3"}',pathParam:'{}',requestParam:'{}',responseTime:'5106',expectedStatus:'200',responseStatus:'200',passOrFail:'Passed'},
//   {class: 'org.testng.test.GenericTest', method: 'POST', baseURL: 'http://localhost:9010/',path: '/newUser',payload:'{"firstName":"Harii","lastName":"K","password":"password","role":"ADMIN","userName":"HariiK","userId":"usr3"}',pathParam:'{}',requestParam:'{}',responseTime:'5106',expectedStatus:'200',responseStatus:'200',passOrFail:'Passed'},
//   {class: 'org.testng.test.GenericTest', method: 'POST', baseURL: 'http://localhost:9010/',path: '/newUser',payload:'{"firstName":"Harii","lastName":"K","password":"password","role":"ADMIN","userName":"HariiK","userId":"usr3"}',pathParam:'{}',requestParam:'{}',responseTime:'5106',expectedStatus:'200',responseStatus:'200',passOrFail:'Passed'},
//   {class: 'org.testng.test.GenericTest', method: 'POST', baseURL: 'http://localhost:9010/',path: '/newUser',payload:'{"firstName":"Harii","lastName":"K","password":"password","role":"ADMIN","userName":"HariiK","userId":"usr3"}',pathParam:'{}',requestParam:'{}',responseTime:'5106',expectedStatus:'200',responseStatus:'200',passOrFail:'Passed'},
//   ];

  /*const data:DataSource[]=[
    {
      "className": "com.hashedin.broadcast.autotest.GenericTest",
      "method": "POST",
      "baseUrl": "http://localhost:8095",
      "path": "/user/createUser",
      "payloadJson": "{firstName=vT3wx, lastName=KPX4W, emailID=Og2pS, userID=558}",
      "pathParam": "{}",
      "requestParam": "{}",
      "responseTime": "317",
      "expectedStatus": "200",
      "responseStatus": "200",
      "passedOrFailed": "Passed"
    }]*/
  
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

}
@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.css']
})


export class ResultsPageComponent implements OnInit {
  dataSource:any;

  constructor(private router: Router,private apiService: ApiServiceService,private route:ActivatedRoute) { }

  ngOnInit(): void { 
    //console.log(this.router)
  //  this.dataSource = localStorage.getItem("dataSource");
   this.route.queryParams.subscribe(params => {
      console.log(localStorage.getItem('apiSpec'))
      this.apiService.getResults(localStorage.getItem('apiSpec')).subscribe((data)=>{
        console.log("data",data);
        this.dataSource = data;
     });
    });
  }
  
  goBack(){
    this.router.navigate(['']);
  }

  loadResults(){
     
  }
  

  displayedColumns: string[] = ['className', 'method', 'baseUrl', 'path','payloadJson','pathParam','requestParam',
  'responseTime','expectedStatus','responseStatus','passedOrFailed'];
  //dataSource = ELEMENT_DATA;
  //dataSource=data ;
}
