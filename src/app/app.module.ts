import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ResultsPageComponent } from './results-page/results-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FormsModule } from '@angular/forms';
//import {MatInputModule} from '@angular/material/input';
//import * as angularMat from '@angular/material';
import { AllMaterials } from './all-materials';
import { HttpClientModule } from '@angular/common/http';
//import { NgHttpLoaderModule } from 'ng-http-loader';
// import { NgxSpinnerModule } from "ngx-spinner";
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent,
    ResultsPageComponent,
    LandingPageComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AllMaterials,
    HttpClientModule,
   NgxSpinnerModule ,
   BrowserAnimationsModule
  // NgHttpLoaderModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
