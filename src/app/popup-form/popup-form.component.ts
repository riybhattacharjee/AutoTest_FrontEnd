import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ApiServiceService } from 'src/api-service.service';
import { Model } from 'src/model';


@Component({
  selector: 'app-popup-form',
  templateUrl: './popup-form.component.html',
  styleUrls: ['./popup-form.component.css']
})
export class PopupFormComponent implements OnInit {

  submitted = false;
  registerForm!: FormGroup;

  constructor(private matDialogRef: MatDialogRef<PopupFormComponent> , private apiService:ApiServiceService) { }

  ngOnInit(): void {  
  }

emailValidFlag:boolean=false;

  @ViewChild('f') form: any;

  
  send(f:NgForm) {
    if(f.value['email'].split('@')[1]=='deloitte.com'){
      this.apiService.onFirstComponentButtonClick(f.value['email']);    
    }
    else{
      alert('invalid email id')
    }  
  }

  onSubmit(f: NgForm) {
   f.reset()
  }

  model: Model = new Model('', '','');
}
