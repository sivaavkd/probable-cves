

function getDate( element ) {
    var date;
    try {
      date = $.datepicker.parseDate( CONST.dateFormat, element.value );
    } catch( error ) {
      date = null;
    }
    return date;
}

function strToDate(dateStr) {
    var format=CONST.dateFormat;
    if (format == "mm/dd/yy"){
         var parts = dateStr.split("/");
         return new Date(parts[2], parts[0] - 1, parts[1]);
    }
    if (format == "dd/mm/yy"){
         var parts = dateStr.split("/");
         return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    if (format == "dd-mm-yy"){
         var parts = dateStr.split("-");
         return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    if (format == "mm-dd-yy"){
        var parts = dateStr.split("-");
        return new Date(parts[2], parts[0] - 1, parts[1]);
    }
    if (format == "yy-mm-dd"){
        var parts = dateStr.split("-");
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    if (format == "yy-mm-dd"){
        var parts = dateStr.split("/");
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }

}

function resetDates(){
    from = $( "#from" )
        .datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1,
            dateFormat: CONST.dateFormat
        })
        .on( "change", function() {
            to.datepicker( "option", "minDate", getDate( this ) );
    });
    to = $( "#to" ).datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 1,
        dateFormat: CONST.dateFormat
        })
        .on( "change", function() {
        from.datepicker( "option", "maxDate", getDate( this ) );
    });
    $('#to').val(""); $("#from").val("");
    from.datepicker( "option", "maxDate", null );
    to.datepicker( "option", "minDate", null );
}

function setLoadEvents(){
    resetDates();
    $("#btnFilterData").on('click', function() { 
        if ($("#from").val() == "" || $('#to').val() == "") {return;}
        var table = $('#cveData').DataTable(); table.draw() ;
    });
    $("#btnClearFilters").on('click', function() { 
        //$('#to').val(""); $("#from").val("");
        resetDates();
        var reviewedYesNo = $('#showReviewedYesNo').is(":checked");
        if (reviewedYesNo) {$('#showReviewedYesNo').click();}
        var showDemoItems = $('#showDemoItemsOnly').is(":checked");
        if (showDemoItems) {$('#showDemoItemsOnly').click();}
        var oTable = $('#cveData').dataTable(); 
        oTable.fnFilter(CONST.notReviewed, CONST.statusCol,false,false);
        var table = $('#cveData').DataTable(); 
        table.draw() ;
    });
    $("#showReviewedYesNo").on('click', function() { 
        showFilteredData();
    });
    $("#showDemoItemsOnly").on('click', function() { 
        showFilteredData();
    });

    $("#aboutpageicon").on('click', function() {
        toggleAbout();
    });
}

function showFilteredData(){
    var showDemoItems = $('#showDemoItemsOnly').is(":checked");
    var reviewedYesNo = $('#showReviewedYesNo').is(":checked");
    var table = $('#cveData').DataTable();
    if (showDemoItems && reviewedYesNo){
        table.search('').columns().search('').draw();
        table.columns(CONST.idCol).search(CONST.demoRows, true, false, true).draw();
    }
    else if (showDemoItems){
        table.search('').columns().search('').draw();
        table.columns(CONST.idCol).search(CONST.demoRows, true, false, true).draw();
        table.columns(CONST.statusCol).search(CONST.notReviewed, false, false, true).draw();
    }
    else if (reviewedYesNo){
        table.search('').columns().search('').draw();
    }
    else {
        table.search('').columns().search('').draw();
        table.columns(CONST.statusCol).search(CONST.notReviewed, false, false, true).draw();
    }
}

function setDateFilters(){
    /* Custom filtering function which will search data in column four between two values */
    $.fn.dataTable.ext.search.push(
        function( settings, data, dataIndex ) {
            var fromDate = $("#from").val() || "1100/01/01";
            var toDate = $('#to').val() || "9999/12/31";
            var rowDate = data[CONST.dateCol] || "1100/01/01";
            if ( strToDate(rowDate) < strToDate(fromDate) || strToDate(rowDate) > strToDate(toDate) )
            {
                return false;
            }
            return true;
        }
    );
}

function setTableEvents(cveTable){
    
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
                    reloadData(cveTable);
                 }
             });
         } 
    );
}