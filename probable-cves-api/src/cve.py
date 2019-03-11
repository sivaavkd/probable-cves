"""
This is the people module and supports all the ReST actions for the
PEOPLE collection
"""

# System modules
from datetime import datetime
import json
import sys
import cvedb
from flask import request
from flask_cors import CORS

# 3rd party modules
from flask import make_response, abort, jsonify
import connexion

def get_timestamp():
    return datetime.now().strftime(("%Y-%m-%d %H:%M:%S"))

def read_all():
    """ This function responds to a request for /api/cve with the complete lists of CVE  """
    return cvedb.getDataFromDB()

def updatestatus():
    """ This function updates an existing CVE in the CVE structure """
    cveobj = request.get_json()
    status = cveobj["status"]
    reviewed_by = cveobj["reviewed_by"]
    review_comments = cveobj["review_comments"]
    autocveid = cveobj["id"]
    if (autocveid == '' or status == ''):
        print ('Invalid args to Update')
        return
    return cvedb.updateStatusToDB(status,autocveid,reviewed_by,review_comments)

def update():
    """ This function updates an existing CVE in the CVE structure """
    cveobj = request.get_json()
    autocveid = cveobj["id"]
    if (autocveid == ''):
        print ('Invalid args to Update')
        return False
    return cvedb.updateDataToDB(cveobj)

def delete():
    """ This function updates an existing CVE in the CVE structure """
    cveobj = request.get_json()
    autocveid = cveobj["id"]
    if (autocveid == ''):
        print ('Invalid args to Update')
        return
    return cvedb.deleteDataFromDB(autocveid)

def create():
    """ This function creates a new CVE into the CVE structure """
    cveobj = request.get_json()
    ecosystem = cveobj["ecosystem"]
    package = cveobj["package"]
    commit = cveobj["commit"]
    causeddate = cveobj["causeddate"]
    confidence = cveobj["confidence"]
    status = cveobj["status"]
    if not (package != '' and commit != '' and causeddate != '' and confidence != '' and ecosystem != '' and status != ''):
        print ("Insert data missing")
        return
    return cvedb.insertDataToDB(ecosystem,package,commit,causeddate,confidence,status)

# Data to serve with our API
#CVE_DATA = json.loads(open('./src/gridData.json').read())

# Create the application instance
app = connexion.App(__name__, specification_dir='.')
CORS(app.app)
# Read the swagger.yml file to configure the endpoints
app.add_api('config-files/swagger.yml')
app.run()



