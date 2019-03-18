

function getDate( element ) {
    var date;
    try {
      date = $.datepicker.parseDate( CONST.dateFormat, element.value );
    } catch( error ) {
      date = null;
    }

    return date;
}

function strToDate(dateStr,format) {
    format = format || "mm/dd/yy";
    if (format == "mm/dd/yy"){
         var parts = dateStr.split("/");
         return new Date(parts[1], parts[2] - 1, parts[0]);
    }
    if (format == "dd/mm/yy"){
         var parts = dateStr.split("/");
         return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    if (format == "dd-mm-yyyy"){
         var parts = dateStr.split("-");
         return new Date(parts[2], parts[1] - 1, parts[0]);
    }
}

function toDate(selector) {
    var from = $(selector).val().split("-");
    return new Date(from[1], from[2] - 1, from[0]);
}

function setLoadEvents(){
    from = $( "#from" )
        .datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1
        })
        .on( "change", function() {
            to.datepicker( "option", "minDate", getDate( this ) );
        }),
        to = $( "#to" ).datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1
        })
        .on( "change", function() {
        from.datepicker( "option", "maxDate", getDate( this ) );
        });
    $("#btnShowData").on('click', function() { 
        if ($("#from").val() == "" || $('#to').val() == "") {return;} 
        var table = $('#cveData').DataTable(); table.draw() ; 
    });
    $("#btnClearFilters").on('click', function() { 
        $("#from").val(""); $('#to').val(""); 
        $('#showReviewedYesNo').prop('checked', false);
        $('#showDemoItemsOnly').prop('checked', false);
        var oTable = $('#cveData').dataTable(); 
        oTable.fnFilter(CONST.notReviewed, CONST.statusCol,false,false);
        var table = $('#cveData').DataTable(); 
        table.draw() ;
    });
    $("#showReviewedYesNo").on('click', function() { 
        var reviewedYesNo = $('#showReviewedYesNo').is(":checked");
        if (! reviewedYesNo) {
            var table = $('#cveData').dataTable();
            table.fnFilter(CONST.notReviewed, CONST.statusCol,false,false);
        } else {
            var oTable = $('#cveData').DataTable();
            oTable.search('').columns().search('').draw();
        }
    });
    $("#showDemoItemsOnly").on('click', function() { 
        var showDemoItems = $('#showDemoItemsOnly').is(":checked");
        var table = $('#cveData').dataTable();
        if (showDemoItems) {
            showSpecificRows(CONST.demoRows,table,CONST.idCol,true);
        } else {
            table.fnFilter(CONST.notReviewed, CONST.statusCol,false,false);
        }
    });
    $("#aboutpageicon").on('click', function() {
        toggleAbout();
    });
}

function setFilters(){
    /* Custom filtering function which will search data in column four between two values */
    $.fn.dataTable.ext.search.push(
        function( settings, data, dataIndex ) {
            var fromDate = $("#from").val() ;
            var toDate = $('#to').val();
            
            var rowDate = data[CONST.dateCol] || "1/1/1990";
            if ( new Date(rowDate) < new Date(fromDate) || new Date(rowDate) > new Date(toDate) )
            {
                return false;
            }
            return true;
        }
    );
}

function setTableEvents(cveTable){
    
    $('#cveData tbody').on(
         'click', '.filespopup', function () {
         var toptr = $(this).closest('tr').parents('tr');  //this is the top tr of the child row
         var tr = toptr.prev('tr')[0];
         var row = cveTable.row( tr );
         showFilesPopup(row);
     });
    $('#cveData tbody').on(
        'click', '.filespopupclose', function () {
        closeFilesPopup();
    });
    
    $('#cveData tbody').on(
        'click', 'td.files-control', function () {
            var tr = $(this).closest('tr');
            var row = cveTable.row( tr );
            toggleChildTable(tr,row,'Files');
        }
    );
    $('#cveData tbody').on(
        'click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var row = cveTable.row( tr );
            toggleChildTable(tr,row,'Details');
        } 
    );
    $('#cveData tbody').on(
        'click', 'td.actions-control', function () {
            var tr = $(this).closest('tr');
            var row = cveTable.row( tr );
            toggleChildTable(tr,row,'Actions');
        }
    );
    $('#cveData tbody').on(
         'click', 'td button', function () {
             var toptr = $(this).closest('tr').parents('tr');  //this is the top tr of the child row
             var tr = toptr.prev('tr')[0];  //this is the row of the parent data
             var row = cveTable.row( tr );
             var updateData = getUpdateData(row);
             if (updateData == ''){return;}
             var saveData = $.ajax({
                 type: 'PUT',
                 url: getAPIPrefix() + "cveapi/pCVE/Status",
                 data: updateData,
                 dataType: 'json',
                 headers: { 
                     'Accept': 'application/json',
                     'Content-Type': 'application/json' 
                 },
                 beforeSend: function(resultData) {
                     showStatusMsg('info','',false,false);
                 },
                 success: function(resultData) {
                     showStatusMsg('info','',false,false,false);
                     showStatusMsg();
                 }
             });
         } 
    );
}