import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import styles from "../styles/Home.module.css";
import { Card } from "@mui/material";
import { ClockModel, ClockTile } from "../components/ClockTile";

const Home: NextPage = () => {
  const [fetchedMainTime, setFetchedMainTime] = React.useState<
    Date | undefined
  >();
  const [utcOffset, setUtcOffset] = React.useState<number>(0);
  const [liveTime, setLiveTime] = React.useState<Date | undefined>();
  const [clocks, setClocks] = React.useState<ClockModel[]>([
    new ClockModel("Asia", "Chita", undefined, "Chita label"),
    new ClockModel("Asia", "Magadan", undefined, "Magadan label"),
    new ClockModel("America", "Mexico_City", undefined, "Mexico_City label"),
  ]);

  const area = "Asia";
  const location = "Manila";

  React.useEffect(() => {
    const asyncFetch = async () => {
      let fetchUrl = "https://worldtimeapi.org/api/timezone";
      fetchUrl = `${fetchUrl}/${area}/${location}`;
      await fetch(fetchUrl)
        .then((res) => res.json())
        .then((res: any) => {
          setFetchedMainTime(new Date(res["utc_datetime"]));
          setUtcOffset(parseInt(res["utc_offset"]));
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
      {clocks.map((m) => (
        <ClockTile
          area={m.area}
          location={m.location}
          shortLabel={m.shortLabel}
          mainTimezoneCity={location}
          mainTimezoneUtcOffset={utcOffset}
        />
      ))}
    </div>
  );
};

export default Home;
