import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ResultsPageComponent } from './results-page/results-page.component';

const routes: Routes = [
  // { path: '', redirectTo: 'app-landing-page', pathMatch: 'full' },
  { path: '', component: LandingPageComponent },
  
  { path: 'app-results-page', component: ResultsPageComponent }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
