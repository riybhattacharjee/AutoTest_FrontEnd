import { NONE_TYPE } from '@angular/compiler';
import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
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
  //potentialParent: any = null;
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
//trial
  

//trial end

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
    { field: 'requestParam' ,editable: false },
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
    private matDialog: MatDialog
  ) {}

  private gridApi!: GridApi;

  onGridReady(params: GridReadyEvent) {
    this.technology = localStorage.getItem('technology');
    console.log(this.technology)
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
    console.log("send email function called")

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

//   public groupDefaultExpanded = -1;

//   public getDataPath: GetDataPath = (data: any) => {
//     return data.filePath;
//   };
//   public getRowId: GetRowIdFunc = (params: GetRowIdParams) => {
//     return params.data.id;
//   };

//   onRowDragMove(event: RowDragMoveEvent) {
//     setPotentialParentForNode(event.api, event.overNode);
//   }

//   onRowDragLeave(event: RowDragLeaveEvent) {
//     // clear node to highlight
//     setPotentialParentForNode(event.api, null);
//   }

//   onRowDragEnd(event: RowDragEndEvent) {
//     if (!this.potentialParent) {
//       return;
//     }
//     var movingData = event.node.data;
//     // take new parent path from parent, if data is missing, means it's the root node,
//     // which has no data.
//     var newParentPath = this.potentialParent.data
//       ? this.potentialParent.data.filePath
//       : [];
//     var needToChangeParent = !arePathsEqual(newParentPath, movingData.filePath);
//     // check we are not moving a folder into a child folder
//     var invalidMode = isSelectionParentOfTarget(event.node, this.potentialParent);
//     if (invalidMode) {
//       console.log('invalid move');
//     }
//     if (needToChangeParent && !invalidMode) {
//       var updatedRows: any[] = [];
//       moveToPath(newParentPath, event.node, updatedRows);
//       this.gridApi.applyTransaction({
//         update: updatedRows,
//       });
//       this.gridApi.clearFocusedCell();
//     }
//     // clear node to highlight
//     setPotentialParentForNode(event.api, null);
//   }

//    valueFormatter = function (params: ValueFormatterParams) {
//     return params.value ? params.value + ' MB' : '';
//   };
//    cellClassRules = {
//     'hover-over': (params: CellClassParams) => {
//       return params.node === this.potentialParent;
//     },
//   };
    
//    moveToPath(
//     newParentPath: string[],
//     node: IRowNode,
//     allUpdatedNodes: any[]
//   ) {
//     // last part of the file path is the file name
//     var oldPath = node.data.filePath;
//     var fileName = oldPath[oldPath.length - 1];
//     var newChildPath = newParentPath.slice();
//     newChildPath.push(fileName);
//     node.data.filePath = newChildPath;
//     allUpdatedNodes.push(node.data);
//     if (node.childrenAfterGroup) {
//       node.childrenAfterGroup.forEach(function (childNode) {
//         moveToPath(newChildPath, childNode, allUpdatedNodes);
//       });
//     }
//   }
//   function isSelectionParentOfTarget(selectedNode: IRowNode, targetNode: any) {
//     var children = selectedNode.childrenAfterGroup || [];
//     for (var i = 0; i < children.length; i++) {
//       if (targetNode && children[i].key === targetNode.key) return true;
//       isSelectionParentOfTarget(children[i], targetNode);
//     }
//     return false;
//   }
//   function arePathsEqual(path1: string[], path2: string[]) {
//     if (path1.length !== path2.length) {
//       return false;
//     }
//     var equal = true;
//     path1.forEach(function (item, index) {
//       if (path2[index] !== item) {
//         equal = false;
//       }
//     });
//     return equal;
//   }
//   function setPotentialParentForNode(
//     api: GridApi,
//     overNode: IRowNode | undefined | null
//   ) {
//     var newPotentialParent;
//     if (overNode) {
//       newPotentialParent =
//         overNode.data.type === 'folder'
//           ? // if over a folder, we take the immediate row
//             overNode
//           : // if over a file, we take the parent row (which will be a folder)
//             overNode.parent;
//     } else {
//       newPotentialParent = null;
//     }
//     var alreadySelected = potentialParent === newPotentialParent;
//     if (alreadySelected) {
//       return;
//     }
//     // we refresh the previous selection (if it exists) to clear
//     // the highlighted and then the new selection.
//     var rowsToRefresh = [];
//     if (potentialParent) {
//       rowsToRefresh.push(potentialParent);
//     }
//     if (newPotentialParent) {
//       rowsToRefresh.push(newPotentialParent);
//     }
//     potentialParent = newPotentialParent;
//     refreshRows(api, rowsToRefresh);
//   }
//   function refreshRows(api: GridApi, rowsToRefresh: IRowNode[]) {
//     var params: RefreshCellsParams = {
//       // refresh these rows only.
//       rowNodes: rowsToRefresh,
//       // because the grid does change detection, the refresh
//       // will not happen because the underlying value has not
//       // changed. to get around this, we force the refresh,
//       // which skips change detection.
//       force: true,
//     };
//     api.refreshCells(params);
//   }

  


// function moveToPath(newChildPath: string[], childNode: IRowNode<any>, allUpdatedNodes: any[]) {
//   throw new Error('Function not implemented.');
// }

}