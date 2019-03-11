from configparser import ConfigParser
from os import path

def readconfig(filename='Files/db.ini', section='devcluster'):
    # create a parser
    parser = ConfigParser()
    # read config file
    filename = path.dirname(__file__)+'/'+filename
    parser.read(filename)
    print(parser)
    
    db = {}
    if parser.has_section(section):
        params = parser.items(section)
        for param in params:
            db[param[0]] = param[1]
    else:
        raise Exception('Section {0} not found in the {1} file'.format(section, filename))

    return db