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
import { HttpClient } from '@angular/common/http';

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
  file: File |undefined;
  
  // fileUpload = require('express-fileupload');
  constructor(
    private router: Router,
    private apiService: ApiServiceService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  generateReport(f: NgForm) {
    this.generateReportClicked = true;
    console.log('generate btn is clicked');
    console.log(f.value['apiSpec']);
    //  this.apiService.getResults(f.value['apiSpec']).subscribe((data:any)=>{
    //     console.log("data",data);
    //     this.articles = data['articles'];
    //  this.router.navigate(['app-results-page']);
    //  });

    this.router.navigate(['app-results-page']);
  }

  generateReportIfJar(f: NgForm) {
    console.log("generateReportIfJar",this.file)
    
    this.apiService.sendFile(this.file).subscribe((data: any) => {
      //this.router.navigate(['app-results-page']);
    });
  }

  //new code trial
  model: Model = new Model('', '');
  
  
  @ViewChild('f') form: any;

  techs: string[] = ['Open Spec API', 'Jar File', 'GraphQL'];

  onSubmit(f: NgForm) {
    if (this.form.valid) {
      this.form.reset();
    }
  }

  onFileSelected(event: any) {
    console.log(event)
     this.file = event.target.files[0];

    if (this.file) {
      this.fileName = this.file.name;
      console.log(this.file);
      //localStorage.setItem(this.uploadFile,file)
      // const formData = new FormData();

      // formData.append("thumbnail", file);

      // const upload$ = this.http.post("/api/thumbnail-upload", formData);

      // upload$.subscribe();

    }
  }
}
