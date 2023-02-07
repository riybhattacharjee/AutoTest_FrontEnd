import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/api-service.service';
import { Model } from 'src/model';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { DataSource } from '../results-page/results-page.component';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  articles: any;
  apiSpec: string = '';
  technology: string = '';
  upload_file:File | undefined;
  fileName = '';
  generateReportClicked: boolean = false;
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  baseUrl:string='';
  // fileUpload = require('express-fileupload');
  constructor(
    private router: Router,
    private apiService: ApiServiceService,
    
  ) {}

  states !: Observable<object>;
  ngOnInit(): void {
    //this.fileInfos = this.apiService.getFiles();
  }

  generateReport(f: NgForm) {
    this.generateReportClicked = true;
    console.log('generate btn is clicked');
    console.log(f.value['apiSpec']);
    localStorage.setItem("apiSpec", f.value['apiSpec'])
    localStorage.setItem("tech",f.value['technology'])
    this.router.navigateByUrl('app-results-page');
    /* this.apiService.getResults(f.value['apiSpec']).subscribe((data)=>{
        console.log("data",data);
        this.articles = data;
        localStorage.setItem("dataSource", this.articles)
        this.router.navigateByUrl('app-results-page',{ state: { request: this.articles } });
       // this.router.navigate(['app-results-page',{dataSource: this.articles}]);
     });*/

    // this.router.navigate(['app-results-page',{dataSource: this.articles}]);
  }

  generateReportforGraphQl(f: NgForm){
    this.apiService.getResultsforGraphQl(f.value['apiSpec']).subscribe((data:any)=>{
      console.log("data",data);
      this.articles = data;
      this.router.navigate(['app-results-page',{dataSource: this.articles}]);
       });
  }

  // generateReportIfJar(f: NgForm) {
  //   // console.log("generateReportIfJar",this.file)
    
  //   // this.apiService.sendFile(this.file).subscribe((data: any) => {
  //   //   //this.router.navigate(['app-results-page']);
  //   // });
  // }

  //new code trial
  model: Model = new Model('', '');
  
  
  @ViewChild('f') form: any;

  techs: string[] = ['Open Spec API', 'Jar File', 'GraphQL'];

  onSubmit(f: NgForm) {
    if (this.form.valid) {
      this.form.reset();
    }
  }

  // onFileSelected(event: any) {
  //   console.log(event)
  //   const file:File = event.target.files[0];

  //   if (file) {
  //     this.fileName = file.name;
      
  //     //localStorage.setItem(this.uploadFile,file)
  //     const formData = new FormData();

  //     formData.append('file', file);
  //     console.log(formData);
  // //     // const upload$ = this.http.post("/api/thumbnail-upload", formData);

  // //     // upload$.subscribe();

  //   }
  // }

  onFileSelected(event: any) {
    this.selectedFiles = event.target.files;
  }


  generateReportIfJar(f: NgForm): void {
    this.progress = 0;
    this.baseUrl=f.value['apiSpec'];
    console.log(this.baseUrl)
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.apiService.upload(this.currentFile,this.baseUrl).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              //this.fileInfos = this.apiService.getFiles();
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          }
        });
      }

      this.selectedFiles = undefined;
    }
  }
  
}
