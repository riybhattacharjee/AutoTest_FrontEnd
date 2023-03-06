import { NONE_TYPE } from '@angular/compiler';
import { Component, EventEmitter, Injectable, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServiceService } from 'src/api-service.service';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClassParams, CellClickedEvent, ColDef, GetDataPath, GetRowIdFunc, GetRowIdParams, GridApi, GridReadyEvent, IRowDragItem, IRowNode, RefreshCellsParams, RowDragEndEvent, RowDragLeaveEvent, RowDragMoveEvent, ValueFormatterParams } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { PopupFormComponent } from '../popup-form/popup-form.component';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs/internal/Subscription'; 

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
  itemsToUpdate:any[];
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
  // @Output() newItemEvent = new EventEmitter<string>();
   
  @Input() childProperty = ''; 

  fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';
  potentialParent: any;
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
      field: 'apiName', editable: false ,rowDrag: true ,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { field: 'method' ,editable: false },
    { field: 'baseUrl' ,editable: false },
    { field: 'path' ,editable: false },
    { field: 'payloadJson' },
    { field: 'pathParam' },
    { field: 'requestParam'},
    { field: 'responseTime' ,editable: false },
    { field: 'expectedStatus' },
    { field: 'responseStatus' ,editable: false },
    { field: 'passedOrFailed' ,editable: false },
    { field: 'responsePayload' , editable: false },
  ];

  public columnDefsforGraphQl: ColDef[] = [
    {
      field: 'apiName',editable: false ,rowDrag: true ,
      checkboxSelection: true,
      headerCheckboxSelection: true,
    },
    { field: 'payloadJson' },
    { field: 'pathParam' },
    { field: 'passedOrFailed',editable: false  },
    { field: 'responsePayload' ,editable: false },
    { field: 'expectedStatus' },
    { field: 'responseStatus' ,editable: false },
    { field: 'responseTime' ,editable: false },
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
    private spinner: NgxSpinnerService,
    private matDialog: MatDialog,
    
  ) {}

    

  private gridApi!: GridApi;

  onGridReady(params: GridReadyEvent) {
    this.technology = localStorage.getItem('technology');
    this.apiService.content.subscribe((data) => {
      this.rowData = data;
    });
    
  }

  onRowDragEnd(event:any) {
    let itemsToUpdate: any[] = []
   
    const updatedRows = this.agGrid.api.getModel().forEachNode((rowNode, index) =>{
      itemsToUpdate.push(rowNode.data)
    })
    this.rowData = itemsToUpdate
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

 

  ngOnInit(): void {
    if (this.apiService.subsVar==undefined) {  
      this.apiService.subsVar = this.apiService.    
      invokeFirstComponentFunction.subscribe((email:string) => {   
        this.callSendEmailApi(email);    
      });    
    } 
  }

  callSendEmailApi(email:string){
this.apiService.emailApi(email,this.rowData).subscribe({
  next: (event: any) => {
    if (event.type === HttpEventType.UploadProgress) {
      this.progress = Math.round((100 * event.loaded) / event.total);
    } else if (event instanceof HttpResponse) {
      this.message = event.body.message;
      this.articles = event;
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
}

  regenerateReport() {
    this.spinner.show();
    this.lastRowData = this.rowData;
    this.progress = 0;
    var i;
    if(this.agGrid.api.getSelectedNodes().length== 0) {
      this.apiService.content.subscribe((data) => {
        this.rowData = data;
      });
      this.selectedRowstoSend = this.rowData;
    } 
    else {
      this.nodes = this.agGrid.api.getSelectedNodes();
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

  sendEmail(){
    this.matDialog.open(PopupFormComponent, {
      width: '300px',
      height: '300px',
    });
  }

  public exportExcel(): void {
    const fileName = "ApiTestReport";
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.rowData);
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, fileName);
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: this.fileType});
    FileSaver.saveAs(data, fileName + this.fileExtension);
  }

}