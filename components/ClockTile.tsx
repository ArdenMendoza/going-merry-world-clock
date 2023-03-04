import { Card } from "@mui/material";
import React from "react";

export class ClockModel {
  constructor(
    public area: string,
    public location: string,
    public region?: string,
    public shortLabel?: string
  ) {}
}

class ClockTileModel extends ClockModel {
  constructor(
    area: string,
    location: string,
    public mainTimezoneCity: string,
    public mainTimezoneUtcOffset: number,
    region?: string,
    shortLabel?: string
  ) {
    super(area, location, region, shortLabel);
  }
}
export const ClockTile = ({
  area,
  location,
  region,
  shortLabel,
  mainTimezoneCity,
  mainTimezoneUtcOffset,
}: ClockTileModel) => {
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
      let fetchUrl = "https://worldtimeapi.org/api/timezone";
      fetchUrl = `${fetchUrl}/${area}/${location}${region ? "/" + region : ""}`;
      await fetch(fetchUrl)
        .then((res) => res.json())
        .then((res: any) => {
          setFetchedTime(new Date(res["datetime"].slice(0, -6)));
          setDetails({
            shortLabel,
            city: location,
            abbreviation: res["abbreviation"],
            utcOffset: parseInt(res["utc_offset"]),
          });
        });
    };
    asyncFetch(); // Execute only once (if there is no myCityTime value)
  }, []);

  React.useEffect(() => {
    if (fetchedTime) {
      let seconds = 1;
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
    <Card style={{ margin: "10px 0px 10px 0px", padding: 10 }}>
      <div>{location}</div>
      <div>{shortLabel}</div>
      {liveTime && <div>{liveTime.toLocaleTimeString("en-GB")}</div>}
      <div>{details.abbreviation}</div>
      {`${Math.abs(mainTimeZoneDiff)} ${
        Math.abs(mainTimeZoneDiff) > 1 ? "hours" : "hour"
      } ${mainTimeZoneDiff > 0 ? "ahead" : "behind"} of ${mainTimezoneCity}`}
    </Card>
  );
};
