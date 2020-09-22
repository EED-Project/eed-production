import csv
import datetime
import json
import os
import sys

import psycopg2
import wbdata
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Global Variables
Country_table = []
Indicator_table = []
Aggregates_table = []
country_list = list()
indicator_list = list()
aggregate_list = list()
results = list()

SCRIPT_PATH = os.path.dirname(os.path.realpath(__file__))

# Configure by environment variables
ROOTDB_NAME = os.getenv('EED_ROOTDB_NAME', 'df9egclbrc07pm')
DB_NAME = os.getenv('EED_DB_NAME', 'df9egclbrc07pm')
DB_HOST = os.getenv('EED_DB_HOST', 'ec2-54-160-202-3.compute-1.amazonaws.com')
DB_USER = os.getenv('EED_DB_USER', 'ompjvgphfcccsl')
DB_PASS = os.getenv('EED_DB_PASS', '12aac0929be8a501efc293dda0bb31d3c3263d0a267704ac8a5a852eab637564')

START_YEAR = int(os.getenv('EED_START_YEAR', '2010'))
END_YEAR = int(os.getenv('EED_END_YEAR', '2012'))

# Function that returns the country_id corresponding to the country name
def country_translation(name):
    for item in country_list:
        for value in item.values():
            if name == value:
                return item['country_id']

# Function that returns the country_region_id corresponding to the country name
def find_region(name):
    for item in country_list:
        for value in item.values():
            if name == value:
                return item['country_region_ISOid']

# Function that returns the indicator id,api_code, description, source, topic corresponding to the indicator name
def indicator_translation(name):
    for item in indicator_list:
        for value in item.values():
            if name == value:
                indicator_id = item['indicator_id']
                indicator_api_code = item['indicator_api_code']
                indicator_description = item['indicator_description']
                indicator_source = item['indicator_source']
                indicator_topic = item['indicator_topic']
                return indicator_id, indicator_api_code, indicator_description, indicator_source, indicator_topic

# Function that returns the indicator id,api_code, description, source, topic corresponding to the indicator name
def aggregate_translate(name):
    for item in aggregate_list:
        for value in item.values():
            if name == value:
                aggregate_name = item['aggregate_name']
                return aggregate_name

# Function that pull data from .csv files and put them in global variables Indicator_tbale, Country_table, country_list, indicator_list
def init_dataset():
    # create global Indicator_table from indicator.cfg
    with open(os.path.join(SCRIPT_PATH, 'Mindicators.csv'), newline='') as f:
        reader = csv.reader(f)
        data = list(reader)
        global Indicator_table
        Indicator_table = data[1:]

    # create global Country_table from indicator.cfg
    with open(os.path.join(SCRIPT_PATH, 'Mcountries.csv'), newline='') as f:
        reader = csv.reader(f)
        data = list(reader)
        global Country_table
        Country_table = data[1:]

    # create global Aggregate_table from aggregates.csv
    with open(os.path.join(SCRIPT_PATH, 'Maggregates.csv'), newline='') as f:
        reader = csv.reader(f)
        data = list(reader)
        global Aggregates_table
        Aggregates_table = data[1:]

    for idx, aggregate in enumerate(Aggregates_table):
        aggregate_dict = dict()
        # country_dict must this format: {'country_id': '', 'country_name': '', 'country_ISOid': ''}
        aggregate_dict['aggregate_isoid'] = aggregate[0]
        aggregate_dict['aggregate_name'] = aggregate[1]
        aggregate_dict['aggregate_description'] = aggregate[2]
        aggregate_list.append(aggregate_dict)

    for idx, country in enumerate(Country_table):
        country_dict = dict()  # country_dict must this format: {'country_id': '', 'country_name': '', 'country_ISOid': ''}
        country_dict['country_id'] = idx + 1
        country_dict['country_name'] = country[2]
        country_dict['country_ISOid'] = country[1]
        country_dict['country_capitalcity'] = country[3]
        country_dict['country_language'] = country[4]
        country_dict['country_timezone'] = country[5]
        country_dict['country_description'] = country[6]
        country_dict['country_region_ISOid'] = country[7]
        country_dict['country_flag'] = "./img/flags/flag" + country[1] + ".svg"
        country_dict['country_map'] = "./img/maps/map" + country[1] + ".svg"
        country_dict['country_image'] = "./img/countryimage/ci" + country[1] + ".png"
        country_list.append(country_dict)

    for indicator in Indicator_table:
        indicator_dict = dict()
        # indicator_dict must this format: {'indicator_id': '', 'indicator_api_code': '', 'indicator_name': '' , 'indicator_description': '', 'indicator_source' :'', 'indicator_topic' :''}
        indicator_dict['indicator_id'] = indicator[2]
        indicator_dict['indicator_api_code'] = indicator[0]
        indicator_dict['indicator_name'] = indicator[1]
        indicator_dict['indicator_description'] = indicator[3]
        indicator_dict['indicator_source'] = indicator[4]
        indicator_dict['indicator_topic'] = indicator[5]
        indicator_list.append(indicator_dict)

# Function that get datas from World Bank API
def retrieve_external_data(start_year=START_YEAR, end_year=END_YEAR):
    print('Getting data.......', start_year, '-', end_year)
    data_date = (datetime.datetime(start_year, 1, 1), datetime.datetime(end_year, 1, 1))
    indicators = dict()
    for i in Indicator_table:
        indicators[i[0]] = i[1]

    countries = [country[0] for country in Country_table]

    res = wbdata.get_dataframe(indicators, country=countries, data_date=data_date)
    print("fetched...")
    json_res = res.to_dict('index')

    none_countries = []
    for key, value in json_res.items():
        country_id = country_translation(key[0])
        if country_id is None:
            none_countries.append(key)
            continue

        year = key[1]
        for k, v in value.items():
            indicator_dict = dict()  # {'indicator_id': '', 'indicator_api_code': '', 'indicator_name': '' , 'indicator_description': '', 'indicator_source' :'', 'indicator_topic' :''}
            indicator_id, indicator_api_code, indicator_description, indicator_source, indicator_topic = indicator_translation(k)
            indicator_dict['indicator_id'] = indicator_id
            indicator_dict['country_id'] = country_id
            indicator_dict['year'] = year
            indicator_dict['indicator_name'] = k
            indicator_dict['indicator_api_code'] = indicator_api_code
            indicator_dict['indicator_description'] = indicator_description
            indicator_dict['indicator_source'] = indicator_source
            indicator_dict['indicator_topic'] = indicator_topic
            indicator_dict['indicator_value'] = v
            results.append(indicator_dict)


    # export json if countries is none
    with open('none_countries.json', 'w') as outfile:
        json.dump(none_countries, outfile)

    insert_table('countryDB', country_list)
    truncate_table('indicatorDB')

    for result in results:
        if result['indicator_value'] is None:
            result['indicator_value'] = 0
        if str(result['indicator_value']) == 'nan':
            result['indicator_value'] = 0

    with open('results.json', 'w') as outfile:
        json.dump(results, outfile)

    insert_table('indicatorDB', results)

    listregions = list()
    for item in country_list:
        region_dict = dict()
        c_id = item['country_id']
        r_ISOid = item['country_region_ISOid']

        for regions in aggregate_list:
            if r_ISOid == regions['aggregate_isoid']:
                r_nm = regions['aggregate_name']

        region_dict['aggregate_isoid'] = r_ISOid
        region_dict['aggregate_name'] = r_nm
        region_dict['aggregate_map'] = ''
        region_dict['aggregate_description'] = r_nm+' Aggregate'
        region_dict['aggregate_area'] =  1
        region_dict['country_id'] = c_id
        listregions.append(region_dict)

    # export json if countries is none
    truncate_table('aggregateDB')
    insert_table('aggregateDB', listregions)

    print("Data Loading FINISHED.")

# Function that creates the PostGreSQL DB
def create_db():
    con = psycopg2.connect(dbname=ROOTDB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST)
    #con = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST)
    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = con.cursor()
    try:
        sql = '''CREATE database {} '''.format(DB_NAME)
        cur.execute(sql)
        cur.close()
        con.commit()
    except psycopg2.ProgrammingError as e:
        print(e)
    finally:
        if con is not None:
            con.close()

# Function that creates the DB_NAME table
def create_table():
    con = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST)
    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = con.cursor()
    try:
        commands = [
            '''
                CREATE TABLE countryDB (
                    country_id SERIAL PRIMARY KEY,
                    country_name VARCHAR,
                    country_ISOid VARCHAR,
                    country_flag TEXT,
                    country_map TEXT,
                    country_image TEXT,
                    country_description TEXT,
                    country_area INT,
                    country_language VARCHAR,
                    country_prev_election DATE,
                    country_next_election DATE,
                    country_timezone INT,
                    country_region_ISOid VARCHAR,
                    country_capitalcity VARCHAR
                )
            ''',
            '''
                CREATE TABLE indicatorDB (
                    indicator_id BIGINT,
                    indicator_api_code VARCHAR,
                    indicator_name VARCHAR,
                    indicator_description VARCHAR,
                    indicator_source VARCHAR,
                    indicator_topic VARCHAR,
                    country_id INTEGER REFERENCES countryDB(country_id),
                    year INT,
                    indicator_value DECIMAL
                )
            ''',
            '''
               CREATE TABLE aggregateDB (
                   aggregate_id SERIAL PRIMARY KEY,
                   aggregate_isoid VARCHAR,
                   aggregate_name VARCHAR,
                   aggregate_map BYTEA,
                   aggregate_description VARCHAR,
                   aggregate_area INT,
                   country_id INTEGER REFERENCES countryDB(country_id)
               )
            ''',
        ]
        for sql in commands:
            cur.execute(sql)
        cur.close()
        con.commit()

    except psycopg2.ProgrammingError as e:
        print(e)
    finally:
        if con is not None:
            con.close()


def truncate_table(table_name):
    con = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST)
    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = con.cursor()
    try:
        sql = '''  truncate table {}  '''.format(table_name)
        cur.execute(sql)
        cur.close()
        con.commit()

    except psycopg2.ProgrammingError as e:
        print(e)
    finally:
        if con is not None:
            con.close()


def insert_table(table_name, list_data):
    with psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST) as con:
        con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        for item in list_data:
            cur = con.cursor()
            column_name = str(tuple(item.keys()))
            value = tuple(item.values())

            # formatting quote for db values
            a = list(value)
            for idx, i in enumerate(a):
                if isinstance(i, str):
                    i = i.replace("'", "''")
                    a[idx] = i
            value = str(tuple(a))

            try:
                commands = [
                    '''
                        INSERT INTO {} {} VALUES {} ;
                    '''.format(table_name, column_name.replace('\'', ''), value.replace('"', '\'')),
                ]
                for sql in commands:
                    cur.execute(sql)
                cur.close()
                con.commit()

            except psycopg2.ProgrammingError as e:
                print(commands)
                print(e)

            except psycopg2.DataError as e:
                print(commands)
                print(e)

            except psycopg2.IntegrityError as e:
                if 'duplicate key value violates unique constraint' in str(e):
                    print(commands)
                    continue


def read_table(commands):
    con = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST)
    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = con.cursor()
    datas = list()
    try:
        cur.execute(commands)
        records = cur.fetchall()
        column_names = [row[0] for row in cur.description]
        for record in records:
            zipp = zip(column_names, record)
            mapping = dict(map(list, zipp))
            datas.append(mapping)

    except psycopg2.ProgrammingError as e:
        print(e)
    finally:
        if con is not None:
            con.close()

    return datas


def drop_db():
    con = psycopg2.connect(dbname=ROOTDB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST)
    #con = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST)
    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = con.cursor()
    try:
        sql = '''DROP database {} '''.format(DB_NAME)
        cur.execute(sql)
        cur.close()
        con.commit()
    except psycopg2.ProgrammingError as e:
        print(e)
    finally:
        if con is not None:
            con.close()

def drop_tb(table_name):
    con = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST)
    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = con.cursor()
    try:
        sql = '''DROP table {} '''.format(table_name)
        cur.execute(sql)
        cur.close()
        con.commit()
    except psycopg2.ProgrammingError as e:
        print(e)
    finally:
        if con is not None:
            con.close()

def delete_country(country_id):
    con = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST)
    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = con.cursor()
    try:
        sql = '''delete from aggregatedb where country_id = {}'''.format(country_id)
        cur.execute(sql)
        sql = '''delete from indicatordb where country_id = {}'''.format(country_id)
        cur.execute(sql)
        sql = '''delete from countrydb where country_id = {}'''.format(country_id)
        cur.execute(sql)
        cur.close()
        con.commit()

        print('country deleted')

    except psycopg2.ProgrammingError as e:
        print(e)
    finally:
        if con is not None:
            con.close()


def country_id_in_aggregate_checker(country_id):
    commands = '''
                SELECT * FROM aggregateDB
                WHERE country_id = {}
            '''.format(country_id)

    datas = read_table(commands=commands)
    return datas


def add_aggregate(data=dict()):
    country_id_list = [item['country_id'] for item in country_id_in_aggregate_checker(data['country_id'])]
    if data['country_id'] not in country_id_list:
        insert_table('aggregateDB', [data])
        print(data['country_id'])
        print('country in aggregatedb added')
    else:
        print('country in aggregatedb already exists')


def get_countries_from_aggregate(name):
    commands = '''
                    SELECT country_id FROM aggregateDB
                    WHERE aggregate_name = '{}'
                '''.format(name)

    datas = read_table(commands=commands)
    return datas

if __name__ == '__main__':
    answer = input('Input type: \n'
                   'Y: Create the database and populate data from wbdata,\n'
                   'N: Delete database\n'
                   'Input: ')

    # Create database, table and retrieve data from wbdata
    if answer == 'Y':
        create_db()
        create_table()
        init_dataset()
        retrieve_external_data()

    # Drop table
    elif answer == 'N':
        drop_tb('aggregateDB')
        drop_tb('indicatorDB')
        drop_tb('countryDB')

    else:
        sys.exit()
