import json
import psycopg2
from cveconfig import readconfig

def updateDataToDB(cveobj):
    """ Connect to the PostgreSQL database server """
    retVal = False
    if (cveobj["id"] == ''):
        print ('Invalid args to Update')
        return retVal
    conn = None
    resultData = None
    try:
        params = readconfig()
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        
        sql_update_query = """UPDATE probable_cves set repository = COALESCE(%s,repository),
            repo_url = COALESCE(%s,repo_url),package = COALESCE(%s,package), 
            cause_type = COALESCE(%s,cause_type), issue_date = COALESCE(%s,issue_date),
            issue_url = COALESCE(%s,issue_url),fixed_date = COALESCE(%s,fixed_date),
            fixed_url = COALESCE(%s,fixed_url),commit_date = COALESCE(%s,commit_date),
            commit_url = COALESCE(%s,commit_url),identified_date = COALESCE(%s,identified_date),
            identified_url = COALESCE(%s,identified_url),files_changed = COALESCE(%s,files_changed),
            cve_id = COALESCE(%s,cve_id),cve_date = COALESCE(%s,cve_date),
            flagged_score = COALESCE(%s,flagged_score),flagged_comments = COALESCE(%s,flagged_comments),flagged_at = COALESCE(%s,flagged_at),
            additional_info = COALESCE(%s,additional_info)
            where id = %s"""
        # cur.execute(sql_update_query,cveobj)
        #review_status = COALESCE(%s,review_status),reviewed_by = COALESCE(%s,reviewed_by),reviewed_at = COALESCE(%s,reviewed_at),review_comments = COALESCE(%s,review_comments), 
        cur.execute(sql_update_query,[cveobj["repository"],cveobj["repo_url"],cveobj["package"],cveobj["cause_type"],cveobj["issue_date"],cveobj["issue_url"],cveobj["fixed_date"],cveobj["fixed_url"],cveobj["commit_date"],cveobj["commit_url"],cveobj["identified_date"],cveobj["identified_url"],cveobj["files_changed"],cveobj["cve_id"],cveobj["cve_date"],cveobj["flagged_score"],cveobj["flagged_comments"],cveobj["flagged_at"],cveobj["additional_info"],cveobj["id"]])
        conn.commit()
        resultData = cur.rowcount
        print('Updated rows ' + str(resultData))
        cur.close()
        retVal = True
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')
    return retVal

def updateStatusToDB(status,autoid,reviewed_by,review_comments):
    """ Connect to the PostgreSQL database server """
    retVal = False
    if (autoid == ''):
        print ('Invalid args to Update')
        return retVal
    conn = None
    cvedata = None
    try:
        params = readconfig()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        sql_update_query = """UPDATE probable_cves set review_status = %s ,reviewed_by = %s,  
                            review_comments = ( 
                                CASE WHEN review_comments IS NULL THEN '[]'::jsonb ELSE review_comments END
                                )|| %s::jsonb ,
                            reviewed_at = now() where id = %s"""
        cur.execute(sql_update_query,[status,reviewed_by, review_comments, autoid])
        conn.commit()
        cvedata = cur.rowcount
        print('Updated rows ' + str(cvedata))
        cur.close()
        if (cvedata > 0):
            retVal = True
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')
    return retVal

def deleteDataFromDB(autoid):
    """ Connect to the PostgreSQL database server """
    retVal = False
    if (autoid == ''):
        print ('Invalid args to Delete')
        return retVal
    conn = None
    cvedata = None
    try:
        params = readconfig()
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        
        sql_update_query = """DELETE FROM cveinfo2 where id = %s"""
        cur.execute(sql_update_query,[autoid])
        conn.commit()
        cvedata = cur.rowcount
        print('Deleted rows ' + str(cvedata))
        retVal = True
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if (conn):
            cur.close()
            conn.close()
            print('Database connection closed.')
    return retVal

def insertDataToDB(ecosystem,package,commit,causeddate,confidence,status):
    """ Connect to the PostgreSQL database server """
    if not (package != '' and commit != '' and causeddate != '' and confidence != '' and ecosystem != '' and status != ''):
        return "Insert data missing"
    conn = None
    cvedata = None
    retVal = False
    try:
        params = readconfig()
        print('insert - connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        print ('insert connection opened')
        sql_insert_query = """INSERT INTO cveinfo2(ecosystem,package,commit,causeddate,confidence,status) VALUES (%s,%s,%s,%s,%s,%s)  """
        #{ "causeddate": "1/1/2019", "commit": "8c6fb41f92375ff82df7b54c7c5e3e9fb76267a6", "confidence": "67%", "ecosystem": "Golang", "package": "fabric8-analytics/f8a-3scale-connect-api", "status": "Not Reviewed" }
        cur.execute(sql_insert_query,[ecosystem,package,commit,causeddate,confidence,status])
        conn.commit()
        cvedata = cur.rowcount
        retVal = True
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if (conn):
            cur.close()
            conn.close()
            print('Database connection closed.')
    return retVal

def getDataFromDB():
    """ Connect to the PostgreSQL database server """
    conn = None
    cvedata = ""
    try:
        params = readconfig()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        
        sql_select_query = """select array_to_json(array_agg(row_to_json(temp))) from (
            select id, ecosystem, repository, repo_url, package, cause_type, 
            issue_date, issue_url, fixed_date, fixed_url, commit_date, commit_url, identified_date, identified_url,
            files_changed, review_status, reviewed_at, reviewed_by, cve_id, cve_date,
            flagged_score, flagged_at, flagged_comments, additional_info, review_comments from probable_cves) temp"""
        cur.execute(sql_select_query)
        cvedata = cur.fetchall()
        # print(cvedata)
        cvedata = json.dumps(cvedata).lstrip('[').rstrip(']')
        cvedata = "[" + cvedata + "]"
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if (conn):
            cur.close()
            conn.close()
            print('Database connection closed.')
    return json.loads(cvedata)
