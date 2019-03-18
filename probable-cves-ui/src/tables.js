function childActionsFormat ( rowData ) {
    var id = rowData.id;
    if (! actionAllowed()){ return '';}
    return '<table class="actionstable">'+
              '<tr>'+
                   '<td><b>' + DETAILS.Comments + '</b></td>'+
                   '<td><textarea maxLength = "100" id="reviewcomments' + id + 
                   '" rows="2" cols="30"></textarea></td>' +
                   '<td>' + DETAILS.CommentsOptional + '</td>'+
              '</tr>' +
              '<tr>'+
                   '<td><b>' + DETAILS.action + '</b></td><td><select class="cveoptions" id="cveoptions' + id + '" value="cveoptions' + 
                   id + '"><option id="cveoption' + id + '" value="cveoption' + id + 
                   '">' + DETAILS.ActionsOptions0 + '</option>' + '<option id="cveYes' + id + 
                   '" value="cveYes' + id + '">' + DETAILS.ActionsOptions1 + '</option>' + '<option id="cveNo' + 
                   id + '" value="cveNo' + id + '">' + DETAILS.ActionsOptions2 + '</option>' + 
                   '<option id="cveNotSure' + id + '" value="cveNotSure' + id + 
                   '">' + DETAILS.ActionsOptions3 + '</option></div>' + '</select></td>'+
                   '<td><button id="reviewbtn' + id + '" class="reviewbtn"><b>' + DETAILS.actionsSave + '</b></button></td>' +
              '</tr>' +
         '</table>';
}
function childDetailsFormat ( rowData ) {
    return '<table class="detailstable">'+
              '<tr>'+
                   '<td><b>' + DETAILS.Ecosystem + '</b></td>'+
                   '<td>'+rowData.ecosystem+'</td>'+
                   '<td><b>' + DETAILS.Repository + '</b></td>'+
                   '<td>'+getURLHTML(rowData.repo_url,0,0)+'</td>'+
                   '<td><b>' + DETAILS.Package + '</b></td>'+
                   '<td>'+rowData.package+'</td>'+
              '</tr>'+
              '<tr>'+
                   '<td><b>' + DETAILS.Issue + '</b></td>'+
                   '<td>'+parseURLs(rowData.issue_url)+'</td>'+
                   '<td><b>' + DETAILS.PR + '</b></td>'+
                   '<td>'+parseURLs(rowData.fixed_url)+'</td>'+
                   '<td><b>' + DETAILS.Commit + '</b></td>'+
                   '<td>'+parseURLs(rowData.commit_url,7)+'</td>'+
              '</tr>'+  
              '<tr>'+
                   '<td><b>' + DETAILS.CVEID + '</b></td>'+
                   '<td>'+getURLHTML(rowData.cve_id)+'</td>'+
                   '<td><b>' + DETAILS.CVEDate + '</b></td>'+
                   '<td>'+maskNull(rowData.cve_date)+'</td>'+
                   '<td><b>' + DETAILS.sysID + '</b></td>'+
                   '<td>'+rowData.id+'</td>'+
              '</tr>'+
         '</table>';
}

function childFilesFormat ( rowData ) {
    if (rowData.files_changed == undefined || rowData.files_changed == null || rowData.files_changed == ''){
         return CONST.noDataMsg;
    }
    return  '<table class="filestable">'+
              parseFilesChanged(rowData) +
            '</table>';
}

function toggleChildTable (tr,row,childType){
    if (row.child.isShown()) {
         // This row is already open - close it
        row.child.hide();
        tr.removeClass('shown');
    }
    else {
    // Open this row
    if (childType == 'Actions'){
         row.child( childActionsFormat(row.data()) ).show();
    }
    else if (childType == 'Details'){
         row.child( childDetailsFormat(row.data()) ).show();
    }
    else if (childType == 'Files'){
         row.child( childFilesFormat(row.data()) ).show();
    }
    tr.addClass('shown');
    }
}

function setTableData(cvedata){
    var cvetable = $('#cveData').DataTable({
         dom: 'Bfrtip',
         buttons: [
             {
                 extend:    'copyHtml5',
                 text:      '<i class="fa fa-files-o"></i>',
                 titleAttr: GRID.btnCopy,
                 exportOptions: {columns: GRID.ExportColumns}
             },
             {
                 extend:    'csvHtml5',
                 text:      '<i class="fa fa-file-text-o"></i>',
                 titleAttr: GRID.btnCSV,
                 exportOptions: {columns: GRID.ExportColumns}
             },
             {
                 extend:    'pdfHtml5',
                 text:      '<i class="fa fa-file-pdf-o"></i>',
                 titleAttr: GRID.btnPDF,
                 exportOptions: {columns: GRID.ExportColumns}
             },
             {
                 titleAttr: GRID.btnFilters, 
                 className: 'filterbutton',
                 text: '<i class="fa fa-filter"></i> ' + GRID.btnFilters,
                 action: function ( e, dt, node, config ) {
                     toggleFilters();
                 }
             }
         ],
         language: {
            searchPlaceholder: GRID.Search,
            search: "",
          },
         //pageLength: 15,
         columns: [
            {   title: GRID.Details,
                    className: 'details-control',
                    data: null,
                    sortable: false,
                    defaultContent: '',
                    render: function (data, type, row, meta) {
                        return '<i class="fa fa-list"></i>';
                    }
                },
                {   title: GRID.Repository,
                    render: function (data, type, full, meta) {
                        return getURLHTML(data,0,0);
                    },
                    data: "repo_url"
                },
                {   title: GRID.IdentifiedBy, data: "commit_url",
                    render: function (data, type, row, meta) {
                        return showCVECause(row);
                    } 
                },
                {   title: GRID.IdentifiedDate, data: "commit_date", type: "date",
                    render: function (data, type, row, meta) {
                        return showCVECause(row,true);
                    }
                },
                {   title: GRID.FilesChanged, data: null,
                    className: 'files-control',
                    defaultContent: '',
                    sortable: false,
                    render: function (data, type, row, meta) {
                        return '<i class="fa fa-file-code-o"></i>';
                    }
                },
                
                {   title: GRID.Confidence, data: "flagged_score",
                    render: function (data, type, row, meta) {
                        return showScore(data);
                    }
                },
                {   title: GRID.StatusNumber, data: "review_status", visible: false },
                {   title: GRID.Status, data: "review_status" },
                {   title: GRID.Actions, data: null,
                    render: function (data, type, row, meta) {
                        return '<i class="fa fa-ellipsis-v"></i>';
                    },
                    className: 'actions-control',
                    defaultContent: '',
                    sortable: false 
                },
                {   data: null,
                sortable: false,
                defaultContent: '',
                render: function (data, type, row, meta) {
                    return showInfoIcon(row);
                }
                },
                {   title: GRID.SNo, data: "id", visible: false }
         ],
         data: cvedata, 
         order: [[CONST.orderCol, "desc"]]
     });
     return cvetable;
}