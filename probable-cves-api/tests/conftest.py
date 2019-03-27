"""Configuration for tests."""

import pytest
from cve import app


@pytest.fixture
def client():
    """Provide the client session used by tests."""
    with app.app.test_client() as client:
        yield client
