
const CONST = {
    env: 'devcluster',
    successMsg: 'Status updated successfully',
    statusCol : 6,
    orderCol : 3,  
    dateCol : 3,  
    dateFormat : 'mm/dd/yy',  
    idCol : 10,
    demoRows : '23,21,87,6,111,166,65,41,190,136,27', // '',
    StatusCode : {"Hmm, Not sure":"Not Reviewed","Yes, Security issue":"Reviewed - Probable CVE","Nah, Not a Security issue":"Reviewed - Not a CVE","Not Reviewed":"Not Reviewed"},
    successMsg : 'Status updated successfully',
    failedMsg : 'Error while updating Status',
    selectActionMsg: 'Please select an Action !',
    infoMsg : 'Please wait...',
    noDataMsg  : '-- No data available --',
    heading: 'Golang for OCP - Potential Security Vulnerabilities',
    timeoutReload: 2000,
    notReviewed: 'Not Reviewed',
    pageTitle: 'Golang for OCP - Potential CVEs'
}

const GRID = {
    Details: 'Details',
    Repository: 'Repository',
    IdentifiedBy : 'Identified by',
    IdentifiedDate : 'Identified date',  
    FilesChanged : 'Files changed',  
    Confidence : 'Confidence',  
    StatusNumber : 'Status Number',
    Status : 'Status',
    Actions : 'Actions',
    SNo : 'S.No',
    btnExport: 'Export',
    btnPrint: 'Print',
    btnPDF: 'PDF',
    btnCopy: 'Copy',
    btnCSV: 'CSV',
    ExportColumns: [9,1,2,3,5,7],
    btnFilters: 'Filters',
    Search: 'Search'
}

const DETAILS = {
    Ecosystem: 'Ecosystem:',
    Repository: 'Repository:',
    Package: 'Package:',
    Issue: 'Issue:',
    PR: 'PR:',
    Commit: 'Commit:',
    CVEID: 'CVE ID:',
    CVEDate: 'CVE Published Date:',
    sysID: 'System ID:',
    FileName: 'File name',
    Patch: 'Patch link',
    Comments: 'Comments',
    CommentsOptional: '(Optional)',
    action: 'Action:',
    ActionsOptions0: 'Is this a Security issue?',
    ActionsOptions1: 'Yes, Security issue',
    ActionsOptions2: 'Nah, Not a Security issue',
    ActionsOptions3: 'Hmm, Not sure',
    actionsSave: 'Save'
}