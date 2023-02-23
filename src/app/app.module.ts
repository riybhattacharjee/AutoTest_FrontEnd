import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ResultsPageComponent } from './results-page/results-page.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FormsModule } from '@angular/forms';
import { AllMaterials } from './all-materials';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AgGridModule } from 'ag-grid-angular';
import { NumericCellEditorComponent } from './numeric-cell-editor/numeric-cell-editor.component';
import { HeaderComponent } from './header/header.component';
import { PopupFormComponent } from './popup-form/popup-form.component';

@NgModule({
  declarations: [
    AppComponent,
    ResultsPageComponent,
    LandingPageComponent,
    NumericCellEditorComponent,
    HeaderComponent,
    PopupFormComponent
    
  ],
  
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AllMaterials,
    HttpClientModule,
   NgxSpinnerModule ,
   BrowserAnimationsModule,
   AgGridModule,
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
