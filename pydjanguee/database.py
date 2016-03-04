'''
Created on 30 janv. 2016

@author: serge
'''
import sqlalchemy
from pandas.core.frame import DataFrame

def get_connection(username,password,host,dbname):
    return sqlalchemy.create_engine("mysql+pymysql://{username}:{password}@{host}/{dbname}".format(username=username,password=password,host=host,dbname=dbname)).raw_connection()

def run_query(con, query, params):
    cursor = con.cursor()
    print('query = ' + format(query))
    print('params = ' + format(params))
    qexec = cursor.execute(query, params)
    result_list = [list(elem) for elem in list(cursor.fetchall())]
    column_list = tuple([i[0] for i in cursor.description])
    con.commit()
    cursor.close()
    #con.close() 
    return DataFrame(result_list,columns = column_list)

def run_insert_query(con, query, params):
    cursor = con.cursor()
    print('query = ' + format(query))
    print('params = ' + format(params))
    cursor.execute(query, params)
    con.commit()
    id = cursor.lastrowid
    cursor.close()
    return format(id)
 
if __name__ == '__main__':
    pass