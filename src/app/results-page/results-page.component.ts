import { NONE_TYPE } from '@angular/compiler';
import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/api-service.service';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';

export interface DataSource {
  className: string;
  method: string;
  baseUrl: string;
  path: string;
  payloadJson: string;
  responseTime: string;
  expectedStatus: string;
  responseStatus: string;
  passedOrFailed: string;
  pathParam: string;
  requestParam: string;
  responsePayload: string;
  apiName: string;
}

@Component({
  selector: 'app-results-page',
  templateUrl: './results-page.component.html',
  styleUrls: ['./results-page.component.css'],
})
@Injectable({
  providedIn: 'root',
})
export class ResultsPageComponent implements OnInit {
  goBack() {
    this.router.navigate(['app-results-page']);
    this.rowData = this.lastRowData;
  }

  goToHome() {
    this.router.navigate(['']);
  }

  // Each Column Definition results in one Column.
  public columnDefs: ColDef[] = [
    {
      field: 'apiName',
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { field: 'method' },
    { field: 'baseUrl' },
    { field: 'path' },
    { field: 'payloadJson' },
    { field: 'pathParam' },
    { field: 'requestParam' },
    { field: 'responseTime' },
    { field: 'expectedStatus' },
    { field: 'responseStatus' },
    { field: 'passedOrFailed' },
    { field: 'responsePayload' },
  ];

  public columnDefsforGraphQl: ColDef[] = [
    {
      field: 'apiName',
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { field: 'payloadJson' },
    { field: 'pathParam' },
    { field: 'passedOrFailed' },
    { field: 'responsePayload' },
    { field: 'expectedStatus' },
    { field: 'responseStatus' },
    { field: 'responseTime' },
  ];

  // DefaultColDef sets props common to all Columns
  public defaultColDef: ColDef = {
    editable: true,
    sortable: true,
    filter: true,
  };

  public selectedRowstoSend: Array<any> = [];
  // Data that gets displayed in the grid
  public rowData = <any>[];
  public lastRowData = <any>[];

  // For accessing the Grid's API
  @ViewChild(AgGridAngular) agGrid!: AgGridAngular;

  progress = 0;
  message = '';
  articles: any;
  count = 0;
  nodes: any;
  technology: any;
  constructor(
    private http: HttpClient,
    private router: Router,
    private apiService: ApiServiceService,
    private spinner: NgxSpinnerService
  ) {}

  onGridReady(params: GridReadyEvent) {
    this.technology = localStorage.getItem('technology');
    this.apiService.content.subscribe((data) => {
      this.rowData = data;
    });
  }
  possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]=-)(*&^%$#@!~`";

  // Example of consuming Grid Event
  onCellClicked(e: CellClickedEvent): void {}

  // Example using Grid's API
  duplicateRowsSelected(): void {
    let text = '';
    for (let i = 0; i < 7; i++) {
      text += this.possible.charAt(
        Math.floor(Math.random() * this.possible.length)
      );
    }

    const nodes = this.agGrid.api.getSelectedNodes();
    //let count=0;

    for (let node of nodes) {
      const data = JSON.parse(JSON.stringify(node['data']));
      let splitString;
      if (data['apiName'].split('_')) {
        splitString = data['apiName'].split('_')[0];
        data['apiName'] = splitString + '_dup_' + text;
      } else {
        data['apiName'] = data['apiName'] + '_dup_' + text;
      }
      if (node.rowIndex != null) {
        this.rowData.splice(node.rowIndex + this.count, 0, data);
        this.agGrid.api.setRowData(this.rowData);
      }
    }
  }


  ngOnInit(): void {}

  regenerateReport() {
    this.spinner.show();
    this.lastRowData = this.rowData;
    this.progress = 0;
    var i;
    //console.log(this.agGrid.api.getSelectedNodes());
    if(this.agGrid.api.getSelectedNodes().length== 0) {
      console.log('inside if');
      this.apiService.content.subscribe((data) => {
        this.rowData = data;
      });
      this.selectedRowstoSend = this.rowData;
      //this.selectedRowstoSend.push(this.nodes);
    } 
    else {
      console.log("in else")
      this.nodes = this.agGrid.api.getSelectedNodes();
    
    console.log(this.nodes);
    for (let node of this.nodes) {
      const data = JSON.parse(JSON.stringify(node['data']));
      this.selectedRowstoSend.push(data);
    }
  }
    this.apiService.resendSelectedItems(this.selectedRowstoSend).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((100 * event.loaded) / event.total);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
          this.articles = event;
          this.rowData = this.articles['body'];
          this.router.navigate(['app-results-page']);
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
      },
    });
    this.selectedRowstoSend = [];
  }
}
