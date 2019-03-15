function childActionsFormat ( rowData ) {
    var id = rowData.id;
    if (! actionAllowed()){ return '';}
    return '<table class="actionstable">'+
              '<tr>'+
                   '<td><b>Comments</b></td>'+
                   '<td><textarea maxLength = "50" id="reviewcomments' + id + 
                   '" rows="2" cols="30"></textarea></td>' +
                   '<td>(optional)</td>'+
              '</tr>' +
              '<tr>'+
                   '<td><b>Action:</b></td><td><select class="cveoptions" id="cveoptions' + id + '" value="cveoptions' + 
                   id + '"><option id="cveoption' + id + '" value="cveoption' + id + 
                   '">Is this a Security issue?</option>' + '<option id="cveYes' + id + 
                   '" value="cveYes' + id + '">Yes, Security issue</option>' + '<option id="cveNo' + 
                   id + '" value="cveNo' + id + '">Nah, Not a Security issue</option>' + 
                   '<option id="cveNotSure' + id + '" value="cveNotSure' + id + 
                   '">Hmm, Not sure</option></div>' + '</select></td>'+
                   '<td><button id="reviewbtn' + id + '" class="reviewbtn"><b>Save</b></button></td>' +
              '</tr>' +
         '</table>';
}
function childDetailsFormat ( rowData ) {
    return '<table class="detailstable">'+
              '<tr>'+
                   '<td><b>Ecosystem:</b></td>'+
                   '<td>'+rowData.ecosystem+'</td>'+
                   '<td><b>Repository:</b></td>'+
                   '<td>'+getURLHTML(rowData.repo_url,0,0)+'</td>'+
                   '<td><b>Package:</b></td>'+
                   '<td>'+rowData.package+'</td>'+
              '</tr>'+
              '<tr>'+
                   '<td><b>Issue:</b></td>'+
                   '<td>'+parseURLs(rowData.issue_url)+'</td>'+
                   '<td><b>PR:</b></td>'+
                   '<td>'+parseURLs(rowData.fixed_url)+'</td>'+
                   '<td><b>Commit:</b></td>'+
                   '<td>'+parseURLs(rowData.commit_url,7)+'</td>'+
              '</tr>'+  
              '<tr>'+
                   '<td><b>CVE ID:</b></td>'+
                   '<td>'+getURLHTML(rowData.cve_id)+'</td>'+
                   '<td><b>CVE Published Date:</b></td>'+
                   '<td>'+maskNull(rowData.cve_date)+'</td>'+
                   '<td><b>System ID:</b></td>'+
                   '<td>'+rowData.id+'</td>'+
              '</tr>'+
         '</table>';
}

function childFilesFormat ( rowData ) {
    if (rowData.files_changed == undefined || rowData.files_changed == null || rowData.files_changed == ''){
         return noDataMsg;
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
                 titleAttr: 'Copy',
                 exportOptions: {columns: [9,1,2,3,5,7]}
             },
             {
                 extend:    'csvHtml5',
                 text:      '<i class="fa fa-file-text-o"></i>',
                 titleAttr: 'CSV',
                 exportOptions: {columns: [9,1,2,3,5,7]}
             },
             {
                 extend:    'pdfHtml5',
                 text:      '<i class="fa fa-file-pdf-o"></i>',
                 titleAttr: 'PDF',
                 exportOptions: {columns: [9,1,2,3,5,7]}
             },
             {
                 text: 'Filter options', className: 'filterbutton',
                 action: function ( e, dt, node, config ) {
                     toggleFilters();
                 }
             }
         ],
         language: {
            searchPlaceholder: "Search",
            search: "",
          },
         columns: [
            {   title: 'Details',
                    className: 'details-control',
                    data: null,
                    sortable: false,
                    defaultContent: '',
                    render: function (data, type, row, meta) {
                        return '<i class="fa fa-list"></i>';
                    }
                },
                {   title: "Repository",
                    render: function (data, type, full, meta) {
                        return getURLHTML(data,0,0);
                    },
                    data: "repo_url"
                },
                {   title: "Identified by", data: "commit_url",
                    render: function (data, type, row, meta) {
                        return showCVECause(row);
                    } 
                },
                {   title: "Identified date", data: "commit_date", type: "date",
                    render: function (data, type, row, meta) {
                        return showCVECause(row,true);
                    }
                },
                {   title: "Files changed", data: null,
                    className: 'files-control',
                    defaultContent: '',
                    sortable: false,
                    render: function (data, type, row, meta) {
                        return '<i class="fa fa-file-code-o"></i>';
                    }
                },
                
                {   title: "Confidence", data: "flagged_score",
                    render: function (data, type, row, meta) {
                        return showScore(data);
                    }
                },
                {   title: "StatusNumber", data: "review_status", visible: false },
                {   title: "Status", data: "review_status" },
                {   title: "Actions", data: null,
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
                {   title: "S.No", data: "id", visible: false }
         ],
         data: cvedata, 
         order: [[orderCol, "desc"]]
     });
     return cvetable;
}