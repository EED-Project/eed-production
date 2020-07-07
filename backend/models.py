from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, Column, String, Numeric, Date, LargeBinary, ForeignKey
from sqlalchemy.orm import relationship

db = SQLAlchemy()


class Country(db.Model):
    __tablename__ = "countrydb"

    country_id = Column(Integer, primary_key=True)
    country_name = Column(String)
    country_isoid = Column(String)
    country_flag = Column(String)
    country_map = Column(String)
    country_image = Column(String)
    country_description = Column(String)
    country_area = Column(Integer)
    country_language = Column(String)
    country_prev_election = Column(Date)
    country_next_election = Column(Date)
    country_capitalcity = Column(String)
    country_timezone = Column(Integer)

    indicators = relationship(lambda: Indicator)
    aggregates = relationship(lambda: Aggregate)

    def __str__(self):
        return self.country_name

    def res_dict(self):
        return {
            "country_name": self.country_name,
            "country_id": self.country_id,
            "language": self.country_language,
            "description": self.country_description,
            "iso_id": self.country_isoid,
            "prev_election": self.country_prev_election,
            "next_election": self.country_next_election,
            "capitalcity": self.country_capitalcity,
            "time_zone": self.country_timezone,
            "country_flag": self.country_flag,
            "country_map": self.country_map,
            "country_image": self.country_image,

        }


class Indicator(db.Model):
    __tablename__ = "indicatordb"

    indicator_id = Column(Integer, primary_key=True)
    indicator_api_code = Column(String)
    indicator_name = Column(String)
    indicator_description = Column(String)
    indicator_source = Column(String)
    indicator_topic = Column(String)
    country_id = Column(Integer, ForeignKey(Country.country_id), primary_key=True)
    year = Column(Integer, primary_key=True)
    indicator_value = Column(Numeric, primary_key=True)

    country = relationship(lambda: Country, back_populates="indicators")


class Aggregate(db.Model):
    __tablename__ = "aggregatedb"

    aggregate_id = Column(Integer, primary_key=True)
    aggregate_isoid = Column(String)
    aggregate_name = Column(String)
    aggregate_description = Column(String)
    aggregate_area = Column(Integer)
    country_id = Column(Integer, ForeignKey(Country.country_id))

    country = relationship(lambda: Country, back_populates="aggregates")
