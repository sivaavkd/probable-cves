from configparser import ConfigParser
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


def readconfig(filename='config-files/db.ini', section='devcluster'):
    # create a parser
    parser = ConfigParser()
    # read config file
    filename = os.path.dirname(__file__)+'/'+filename
    parser.read(filename)
    
    db = {}
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            db[param[0]] = param[1]
    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, filename))

    return db

def readconfigEnv():
    db = {}
    db['host'] = os.getenv('PGBOUNCER_SERVICE_HOST', 'bayesian-pgbouncer')
    db['database'] = os.getenv('POSTGRESQL_DATABASE')
    db['user'] = os.getenv('POSTGRESQL_USER')
    db['password'] = os.getenv('POSTGRESQL_PASSWORD')
    db['port'] = os.getenv('PGBOUNCER_SERVICE_PORT', '5432')    
    return db


class Postgres:
    """Postgres connection session handler."""

    def __init__(self):
        """Initialize the connection to Postgres database."""
        self.connection = 'postgresql://{user}:{password}@{pgbouncer_host}:{pgbouncer_port}' \
                          '/{database}?sslmode=disable'. \
            format(user=os.getenv('POSTGRESQL_USER'),
                   password=os.getenv('POSTGRESQL_PASSWORD'),
                   pgbouncer_host=os.getenv('PGBOUNCER_SERVICE_HOST', 'bayesian-pgbouncer'),
                   pgbouncer_port=os.getenv('PGBOUNCER_SERVICE_PORT', '5432'),
                   database=os.getenv('POSTGRESQL_DATABASE'))
        engine = create_engine(self.connection)

        self.Session = sessionmaker(bind=engine)
        self.session = self.Session()

    def session(self):
        """Return the established session."""
        return self.session