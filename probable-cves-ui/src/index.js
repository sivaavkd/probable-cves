function getURLHTML(urlStr, shortDescLength = 0, slashLastIndex = 1, shortDesc = '',addStr = ''){
     if (urlStr == undefined || urlStr == null) {return '';}
     if (shortDesc == '')
     {
          urlTempStr = urlStr + addStr;
          if (slashLastIndex == 1){slashIsAt = urlTempStr.lastIndexOf('/');}
          else {
               urlTempStr = urlTempStr.substr(urlTempStr.indexOf('://')+3);
               slashIsAt = urlTempStr.indexOf('/'); 
          }
          if (slashIsAt == 0) {return '';} else {slashIsAt = slashIsAt + 1;}
          
          if (shortDescLength == 0){ shortDesc = urlTempStr.substr(slashIsAt);}
          else { shortDesc = urlTempStr.substr(slashIsAt,shortDescLength);}
          ;
     }
     return '<a target=”_blank” href="' + urlStr + '">' + shortDesc + '</a>';
}

function parseURLs(urlStrings,shortDescLength = 0,slashLastIndex = 1, shortDesc = '',addStr = ''){
     if (urlStrings == undefined || urlStrings == null) {return '';}
     var finalStr = '';
     var urlStrArray = '';
     if (urlStrings.indexOf(',') == -1) {urlStrArray = urlStrings;}
     else {urlStrArray = urlStrings.split(',');}
     urlStrArray.forEach(element => {
          finalStr = finalStr + getURLHTML(element,shortDescLength,slashLastIndex,shortDesc) + ', ';
          //alert(finalStr);
     });
     finalStr = finalStr.substr(0,finalStr.length-2);
     return finalStr;
}

function parseFilesChanged(rowData){
     filesChanged = rowData.files_changed;
     var filesArray = '';
     var finalStr = '';
     if (filesChanged.indexOf(',') == -1) {filesArray = filesChanged;}
     else {filesArray = filesChanged.split(',');}
     filesArray.forEach(element => {
          finalStr = finalStr + getFileHTML(element);
     });
     return finalStr;
}

function getFileHTML(str){
     if (str.indexOf('.patch') == -1){
          return '<tr><td><i>File name</i></td><td>' + str + '</td></tr>';
     }
     else {
          return '<tr><td><b>Patch link</b></td><td>' + getURLHTML(str,13) + '</td></tr>';
     }
}

function maskNull(val, replaceChar= '-',replaceEmpty = 0)
{
     if (replaceEmpty != 0){
          return ((val === '') ? replaceChar : val);
     }
     return ((val === null) ? replaceChar : val);
}

function  toggleFilters(){
     if ($('#filter-div').is(":visible")){
          $('#filter-div').hide();
     }
     else{
          $('#filter-div').show();
          if (demoRows == '') {
               $('#showDemoItemsOnly').hide();
               $('#showDemoItemsSpan').text('');
           }
     }
}

function getUpdateData(row){
     var autocveid = row.data()["id"];
     var changedVal = StatusCode[$('#cveoptions'+ autocveid + ' :selected').text()];
     if (changedVal == undefined) { showStatusMsg('error','Please select an Action !',false); return '';}
     var updatedBy= $('#useremail-div').text();
     var updateComments = $('#reviewcomments'+autocveid).val();
     var reviewedAt = new Date($.now());
     return JSON.stringify({'status':changedVal,'id':autocveid,'reviewed_by':updatedBy,'review_comments':updateComments,'reviewed_at':reviewedAt});
}

function showStatusMsg(Msgtype = 'success', message = '',isReload = true, autoHide = true, isShow = true){
     var $statusdiv;
     if(Msgtype == 'success') {
          $statusdiv = $("#status-msg");
          $statusdiv.text((message === '') ? successMsg : message);
     }
     else if(Msgtype == 'error'){
          $statusdiv = $("#status-err");
          $statusdiv.text((message === '') ? failedMsg : message);
     }
     else if(Msgtype == 'info'){
          $statusdiv = $("#status-info");
          $statusdiv.text((message === '') ? infoMsg : message);
     }
     if (isShow) {$statusdiv.show();}
     else {$statusdiv.hide(); return;}
     if (autoHide) {
          setTimeout(function(){
               $statusdiv.hide();
               if (isReload) {location.reload();}
          },2000);
     }
}

function showCVECause(rowData,bDate=false){
     if (rowData.cause_type == 'Issue'){
          if (bDate){ return rowData.issue_date; }
          else {return parseURLs(rowData.issue_url,0,1,rowData.cause_type);}
     }
     else if (rowData.cause_type == 'PR'){
          if (bDate){ return rowData.fixed_date; }
          else { return parseURLs(fixed_url,0,1,rowData.cause_type);}
     }
     else if (rowData.cause_type == 'Commit'){
          if (bDate){ return rowData.commit_date; }
          else { return parseURLs(rowData.commit_url,7,1,rowData.cause_type);}
     }
     else{
          if (bDate){ return rowData.identified_date; }
          else { return parseURLs(rowData.identified_url,7,1,rowData.cause_type);}
     }
}

function showScore(score){
     //return (parseFloat(score) * 100).toFixed(2);
     return (Math.floor(parseFloat(score) * 100)).toString() + '%';
}

function showInfoIcon(rowData){
     var iconStr = '';
     if (rowData.cve_id != null && rowData.cve_id != '') 
     { iconStr = iconStr + '<i title="' + rowData.cve_id + '" class="fa fa-info-circle"></i>';}
     //iconStr = iconStr + '<i class="fa fa-info-circle"></i>';
     return iconStr;
}

function showSpecificRows(values, table, colIndex, match){
     $.fn.dataTableExt.afnFiltering.push(
          function(settings, data, dataIndex) {
               for (i=0;i<values.length;i++) {
                    if (match) {
                         if (data[colIndex] == values[i]) return true;
                    } else {
                         if (data[colIndex].indexOf(values[i])>=0) return true;
                    }     
               }
               return false;
          }     
     );
     table.fnDraw();
     $.fn.dataTableExt.afnFiltering.pop();
}