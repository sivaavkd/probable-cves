"""Test cve.py"""

import json
from unittest.mock import patch


@patch("cve.cvedb.updateStatusToDB")
def test_cve_update_status(mocker, client):
    mocker.return_value = True
    payload = {
        "status": "Haha",
        "reviewed_by": "Aagam",
        "review_comments": "Reviewed",
        "id": 5
    }
    response = client.put("cveapi/pCVE/Status", content_type='application/json', data=json.dumps(payload))
    assert response.status_code == 200
