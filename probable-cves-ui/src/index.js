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
     });
     finalStr = finalStr.substr(0,finalStr.length-2);
     return finalStr;
}

function parseFilesChanged(rowData){
     var filesChanged = rowData.files_changed == null ? '' : rowData.files_changed;
     var additionalInfo = rowData.additional_info == null ? '' : rowData.additional_info;
     var filesArray = '';
     var finalStr = '';
     if (filesChanged != ''){
          if (filesChanged.indexOf(',') == -1) {filesArray = filesChanged;}
          else {filesArray = filesChanged.split(',');}
          filesArray.forEach(element => {
               finalStr = finalStr + getFileHTML(element);
          });
     }
     if (additionalInfo != ''){ finalStr = getRepoPath(additionalInfo) + finalStr;}
     return finalStr;
}

function getRepoPath(moreInfo){
     var repopath = moreInfo[DETAILS.repoPathJSON];
     if (repopath == undefined || repopath == null || repopath == '') {
          repopath=''; 
     }
     else {
          repopath = '<tr><td><b>' + DETAILS.repoPath + '</b></td><td>' + repopath + '</td></tr>';
     }
     return repopath;
}

function getFileHTML(str){
     if (str.indexOf('.patch') == -1){
          return '<tr><td><i>' + DETAILS.FileName + '</i></td><td>' + str + '</td></tr>';
     }
     else {
          return '<tr><td><b>' + DETAILS.Patch + '</b></td><td>' + getURLHTML(str,13) + '</td></tr>';
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
          if (CONST.demoRows == '') {
               $('#showDemoItemsOnly').hide();
               $('#showDemoItemsSpan').text('');
           }
     }
}

function  toggleAbout(){
     var aboutText = setAboutText();
     if (aboutText == '') {return;}
     if ($('#aboutpage-div').is(":visible")){
          $('#aboutpage-div').hide();
     }
     else{
          $('#aboutpage-div').show();
     }
}

function getUpdateData(row){
     var autocveid = row.data()["id"];
     var changedVal = CONST.StatusCode[$('#cveoptions'+ autocveid + ' :selected').text()];
     if (changedVal == undefined) { showStatusMsg('error',CONST.selectActionMsg,false); return '';}
     var updatedBy= $('#useremail-div').text();
     var updateComments = $('#reviewcomments'+autocveid).val();
     var reviewedAt = new Date($.now());
     return JSON.stringify({'status':changedVal,'id':autocveid,'reviewed_by':updatedBy,'review_comments':updateComments,'reviewed_at':reviewedAt});
}

function showStatusMsg(Msgtype = 'success', message = '',isReload = true, autoHide = true, isShow = true){
     var $statusdiv;
     if(Msgtype == 'success') {
          $statusdiv = $("#status-msg");
          $statusdiv.text((message === '') ? CONST.successMsg : message);
     }
     else if(Msgtype == 'error'){
          $statusdiv = $("#status-err");
          $statusdiv.text((message === '') ? CONST.failedMsg : message);
     }
     else if(Msgtype == 'info'){
          $statusdiv = $("#status-info");
          $statusdiv.text((message === '') ? CONST.infoMsg : message);
     }
     if (isShow) {$statusdiv.show();}
     else {$statusdiv.hide(); return;}
     if (autoHide) {
          setTimeout(function(){
               $statusdiv.hide();
               if (isReload) {location.reload();}
          },CONST.timeoutReload);
     }
}

function showCVECause(rowData,bDate=false){
     if (rowData.cause_type == 'Issue'){
          if (bDate){ return rowData.issue_date; }
          else {return parseURLs(rowData.issue_url,0,1,rowData.cause_type);}
     }
     else if (rowData.cause_type == 'PR' || rowData.cause_type == 'Pull Request'){
          if (bDate){ return rowData.fixed_date; }
          else { return parseURLs(rowData.fixed_url,0,1,rowData.cause_type);}
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
     return (Math.floor(parseFloat(score) * 100)).toString() + '%';
}

function showInfoIcon(rowData){
     var iconStr = '';
     if (rowData.cve_id != null && rowData.cve_id != '') 
     { iconStr = iconStr + '<i title="' + rowData.cve_id + '" class="fa fa-info-circle"></i>';}
     return iconStr;
}

function setDefaults(){
     $("#from").datepicker("option", "maxDate", new Date());
     $("#to").datepicker("option", "maxDate", new Date());
     $('#showReviewedYesNo').prop('checked', false);
     $('#showDemoItemsOnly').prop('checked', false);
     $('#filter-div').hide(); 
     $('#aboutpage-div').hide();
     setHeading();
     setUserInfo();
     $('#filterecosystem').text(GRID.filterEcosystem);
     $('#filtereco1').text(GRID.filtereco1);
     $('#filterfromdate').text(GRID.filterFrom);
     $('#filtertodate').text(GRID.filterTo);
     $('#btnFilterData').text(GRID.btnFilter);
     $('#showReviewedSpan').text(GRID.includeReviewed);
     $('#showDemoItemsSpan').text(GRID.onlyDemoRows);
     $('#btnClearFilters').text(GRID.btnClear);
}

function loadData(){
     $.ajax({
          type:"GET",
          dataType: "json",
          url: getAPIPrefix() + "cveapi/pCVE",
          beforeSend: function() {
               showStatusMsg('info','',false,false,true);
          },
          success: function(result){
              var cveTable = setTableData(result);
              setTableEvents(cveTable);
              setDateFilters();
              var oTable = $('#cveData').dataTable();
              oTable.fnFilter( CONST.notReviewed, CONST.statusCol,false,false);
          },
          complete: function(){
              showStatusMsg('info','',false,true,false);
          }
      });
}

function reloadData(cveTable){
     $.ajax({
          type:"GET",
          dataType: "json",
          url: getAPIPrefix() + "cveapi/pCVE",
          beforeSend: function() {
               showStatusMsg('info','',false,false,true);
          },
          success: function(result){
               cveTable.clear();
               cveTable.rows.add(result);
               if ($('#showReviewedYesNo').is(":checked")){
                    cveTable.search('').columns().search('').draw();
               }
               if ($('#showDemoItemsOnly').is(":checked")){
                    cveTable.columns(CONST.idCol).search(CONST.demoRows, true, false, true).draw();
               }
               else if (! $('#showReviewedYesNo').is(":checked")){
                    cveTable.columns(CONST.statusCol).search(CONST.notReviewed, false, false, true).draw();
               }
          },
          complete: function(){
              showStatusMsg('info','',false,true,false);
          }
      });
}

function setAboutText(){
     //return '';
     var aboutText = '<b>Red Hat</b> is an enterprise software company with an open source development model. ' +
       ' <br/> The result is better, more reliable, and more adaptable technologies. ' + 
       ' <br/> More information about this can be found <a target=”_blank” href="https://drive.google.com/drive/u/1/folders/1HYgMvdC3zseNTMzUlhJ1OiwA4a5OD_NU">here</a>';
       $("#aboutpage-div").html(aboutText);
       return aboutText;
}

function setUserInfo(){
     $("#user-div").html('<i class="fa fa-user-o"></i> ');
     $("#user-div").append('Siva Kumar');
     $("#useremail-div").text('sadhikar@redhat.com');
}

function actionAllowed(rowdata){
     if (rowdata.cve_id == undefined || rowdata.cve_id == null || rowdata.cve_id == ''){
          return true;
     }
     return false;  // to do - implement logic to validate if the logged in user is allowed to take action or not.
 }

function setHeading(){
     $("#heading-div").html(CONST.heading);
     if (setAboutText() == '') {return;}
     $("#heading-div").append(' <i class="fa fa-question-circle" id="aboutpageicon" aria-hidden="true" title="About"></i> ');
}

function getAPIPrefix(){
     if (CONST.env == 'local'){
          return "http://localhost:5000/";
     }
     else if (CONST.env == 'devcluster'){
          return "http://probable-cve-api-probable-cve.devtools-dev.ext.devshift.net/";
     }
     else if (CONST.env == 'system'){
          if (APIENV.env == null) {
               return "http://localhost:5000/";
          }
          else {
               return "http://" + APIENV.env + "/";
          }
     }
}