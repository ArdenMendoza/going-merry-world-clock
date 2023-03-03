import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [fetchedMainTime, setFetchedMainTime] = React.useState<
    Date | undefined
  >();
  const [utcOffset, setUtcOffset] = React.useState<number>(0);
  const [liveTime, setLiveTime] = React.useState<Date | undefined>();

  const area = 'Asia';
  const location = 'Manila';

  React.useEffect(() => {
    const asyncFetch = async () => {
      let fetchUrl = 'https://worldtimeapi.org/api/timezone';
      fetchUrl = `${fetchUrl}/${area}/${location}`;
      await fetch(fetchUrl)
        .then((res) => res.json())
        .then((res: any) => {
          setFetchedMainTime(new Date(res['utc_datetime']));
          setUtcOffset(parseInt(res['utc_offset']));
        });
    };
    asyncFetch(); // Execute only once (if there is no myCityTime value)
  }, []);

  React.useEffect(() => {
    if (fetchedMainTime) {
      let seconds = 1;
      setInterval(() => {
        let updatedTime = new Date(fetchedMainTime.toString());
        updatedTime.setSeconds(updatedTime.getSeconds() + seconds);
        setLiveTime(updatedTime);
        seconds++;
      }, 1000);
    }
  }, [fetchedMainTime]);

  return (
    <div className={styles.container}>
      <div>
        <div>{location}</div>
        {liveTime && <div>{liveTime.toLocaleTimeString()}</div>}
        <div>{utcOffset}</div>
      </div>
      <ClockTile
        area={'Asia'}
        location={'Chita'}
        mainTimezoneCity={location}
        mainTimezoneUtcOffset={utcOffset}
      />
      <ClockTile
        area={'Asia'}
        location={'Magadan'}
        mainTimezoneCity={location}
        mainTimezoneUtcOffset={utcOffset}
      />
      <ClockTile
        area={'America'}
        location={'Mexico_City'}
        mainTimezoneCity={location}
        mainTimezoneUtcOffset={utcOffset}
      />
    </div>
  );
};

export default Home;

const ClockTile = ({
  area,
  location,
  region,
  shortLabel: shortLabel,
  mainTimezoneCity,
  mainTimezoneUtcOffset,
}: {
  area: string;
  location: string;
  region?: string;
  shortLabel?: string;
  mainTimezoneCity: string;
  mainTimezoneUtcOffset: number;
}) => {
  const [fetchedTime, setFetchedTime] = React.useState<Date | undefined>();
  const [details, setDetails] = React.useState<{
    shortLabel?: string;
    city?: string;
    abbreviation?: string;
    utcOffset?: number;
  }>({});
  const [liveTime, setLiveTime] = React.useState<Date | undefined>();

  React.useEffect(() => {
    const asyncFetch = async () => {
      let fetchUrl = 'https://worldtimeapi.org/api/timezone';
      fetchUrl = `${fetchUrl}/${area}/${location}${region ? '/' + region : ''}`;
      await fetch(fetchUrl)
        .then((res) => res.json())
        .then((res: any) => {
          setFetchedTime(new Date(res['datetime'].slice(0, -6)));
          setDetails({
            shortLabel,
            city: location,
            abbreviation: res['abbreviation'],
            utcOffset: parseInt(res['utc_offset']),
          });
        });
    };
    asyncFetch(); // Execute only once (if there is no myCityTime value)
  }, []);

  React.useEffect(() => {
    if (fetchedTime) {
      let seconds = 1;
      console.log(location, fetchedTime.toLocaleString());
      setInterval(() => {
        let updatedTime = new Date(fetchedTime.toString());
        updatedTime.setSeconds(updatedTime.getSeconds() + seconds);
        setLiveTime(updatedTime);
        seconds++;
      }, 1000);
    }
  }, [fetchedTime]);

  const mainTimeZoneDiff = (details.utcOffset ?? 0) - mainTimezoneUtcOffset;

  return (
    <div style={{ margin: '10px 0px 10px 0px' }}>
      <div>{location}</div>
      {liveTime && <div>{liveTime.toLocaleTimeString('en-GB')}</div>}
      <div>{details.abbreviation}</div>
      {`${Math.abs(mainTimeZoneDiff)} ${
        Math.abs(mainTimeZoneDiff) > 1 ? 'hours' : 'hour'
      } ${mainTimeZoneDiff > 0 ? 'ahead' : 'behind'} of ${mainTimezoneCity}`}
    </div>
  );
};
