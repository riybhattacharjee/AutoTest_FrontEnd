import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ApiServiceService } from 'src/api-service.service';
import { Model } from 'src/model';


@Component({
  selector: 'app-popup-form',
  templateUrl: './popup-form.component.html',
  styleUrls: ['./popup-form.component.css']
})
export class PopupFormComponent implements OnInit {

  
  

  constructor(private matDialogRef: MatDialogRef<PopupFormComponent> , private apiService:ApiServiceService) { }

  ngOnInit(): void {
    
  }

  @ViewChild('f') form: any;

  // firstComponentFunction(email:string){    
  //   this.apiService.onFirstComponentButtonClick(email);    
  // } 
  
  send(f:NgForm) {
    console.log("Send email logic");
    console.log(f.value['email'])
    this.apiService.onFirstComponentButtonClick(f.value['email']);    
  }

  onSubmit(f: NgForm) {
    console.log(f.value['email'])
    if (this.form.valid) {
      //this.spinner.show();
    }
  }

  model: Model = new Model('', '','');
}
