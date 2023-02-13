import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
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
import { DataSource, ResultsPageComponent } from '../results-page/results-page.component';
import { Observable } from 'rxjs/internal/Observable';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})

@Injectable({
  providedIn: 'root',
})
export class LandingPageComponent implements OnInit {
  articles: any;
  apiSpec: string = '';
  technology: string = '';
  upload_file:File | undefined;
  fileName = '';
  generateReportClicked: boolean = false;
  selectedFiles?: FileList;
  selectedFilesJar?:FileList;
  //selectedFiles?: File;
  currentFile?: File;
  //currentFile:any;
  currentJar?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  baseUrl:string='';
  tech:string='';
   
  constructor(
    private router: Router,
    private apiService: ApiServiceService,
   // private resultPage:ResultsPageComponent,
    private route:ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {}

  states !: Observable<object>;
  ngOnInit(): void {
    //this.fileInfos = this.apiService.getFiles();
  }

  // generateReport(f: NgForm) {
  //   this.generateReportClicked = true;
  //   console.log('generate btn is clicked');
  //   console.log(f.value['apiSpec']);
  //   localStorage.setItem("apiSpec", f.value['apiSpec'])
  //   localStorage.setItem("tech",f.value['technology'])
  //   this.router.navigate(['app-results-page']);
  // }

  // generateReportforGraphQl(f: NgForm){
  //   this.apiService.getResultsforGraphQl(f.value['apiSpec']).subscribe((data:any)=>{
  //     console.log("data",data);
  //     this.articles = data;
  //     this.router.navigate(['app-results-page',{dataSource: this.articles}]);
  //      });
  // }


  //new code trial
  model: Model = new Model('', '');
  
  
  @ViewChild('f') form: any;

  techs: string[] = ['Open Spec API', 'Jar File', 'GraphQL'];

  onSubmit(f: NgForm) {
   if (this.form.valid) {
      this.spinner.show();
      //this.form.reset();
    }
    
  }


  onFileSelected(event: any) {
    this.selectedFilesJar = event.target.files;
  }

  onExcelFileSelected(event: any) {
    this.selectedFiles = event.target.files;
  }



  //trial for api spec

  generateReport(f: NgForm): void {
    
    localStorage.setItem("technology",f.value['technology'])
    this.progress = 0;
    this.baseUrl=f.value['apiSpec'];
    if (this.selectedFiles) {
     // this.spinner.show();
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.apiService.getResults(this.currentFile,this.baseUrl).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              //this.fileInfos = this.apiService.getFiles();
              this.articles = event.body;
            this.router.navigate(['app-results-page']);
            
            this.apiService.passDatatoResultsPage(this.articles);
           this.spinner.hide();
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
    // else{
    //   this.spinner.show();
    //   console.log("in else")
    //  this.apiService.getResultswithoutFile(this.baseUrl).subscribe((event: any) => {
    //   console.log(event)
    //    this.articles = event.body;
    //    console.log(this.articles)
    //    this.router.navigate(['app-results-page']);
           
    //   this.apiService.passDatatoResultsPage(this.articles);
    //   this.spinner.hide();
    //  }

    //  );
    // }



    else{
      this.spinner.show();
      console.log("in else")
     this.apiService.getResultswithoutFile(this.baseUrl).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          //this.fileInfos = this.apiService.getFiles();
          this.articles = event.body;
        this.router.navigate(['app-results-page']);
        
        this.apiService.passDatatoResultsPage(this.articles);
       this.spinner.hide();
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
  }



  generateReportIfJar(f: NgForm): void {
    this.progress = 0;
    this.baseUrl=f.value['apiSpec'];
    if (this.selectedFiles &&this.selectedFilesJar) {
      const file: File | null = this.selectedFiles.item(0); //excel file
       const fileJar:File|null=this.selectedFilesJar.item(0); //jar file
      if (file && fileJar) {
        this.currentFile = file;
        this.currentJar=fileJar;
        this.apiService.upload(this.currentFile,this.baseUrl,this.currentJar).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              
              this.articles = event;
              
              this.router.navigate(['app-results-page'])
              this.apiService.passDatatoResultsPage(this.articles['body']);
              this.spinner.hide();
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
            this.currentJar = undefined;
          }
        });
      }
      this.selectedFilesJar=undefined;
      this.selectedFiles = undefined;
    }
  }
  
}
