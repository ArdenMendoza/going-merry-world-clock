import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <ClockTile area={'Asia'} location={'Manila'} />
    </div>
  );
};

export default Home;

const ClockTile = ({
  area,
  location,
  region,
}: {
  area?: string;
  location?: string;
  region?: string;
}) => {
  const [fetchedTime, setFetchedTime] = React.useState<Date | undefined>();
  const [liveTime, setLiveTime] = React.useState<Date | undefined>();

  React.useEffect(() => {
    const asyncFetch = async () => {
      let fetchUrl = 'https://worldtimeapi.org/api/timezone';
      if (area) {
        fetchUrl = `${fetchUrl}/${area}`;
        if (location) {
          fetchUrl = `${fetchUrl}/${location}`;
          if (region) {
            fetchUrl = `${fetchUrl}/${region}`;
          }
        }
      }
      await fetch(fetchUrl)
        .then((res) => res.json())
        .then((res: any) => setFetchedTime(new Date(res['utc_datetime'])));
    };
    asyncFetch(); // Execute only once (if there is no myCityTime value)
  }, []);

  React.useEffect(() => {
    if (fetchedTime) {
      let seconds = 1;
      setInterval(() => {
        let updatedTime = new Date(fetchedTime);
        updatedTime.setSeconds(updatedTime.getSeconds() + seconds);
        setLiveTime(updatedTime);
        seconds++;
      }, 1000);
    }
  }, [fetchedTime]);

  return <div>{liveTime && <div>{liveTime.toLocaleTimeString()}</div>}</div>;
};
