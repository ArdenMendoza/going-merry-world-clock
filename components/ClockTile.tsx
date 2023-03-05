import { Box, Card, IconButton, Skeleton, Typography } from "@mui/material";
import React from "react";
import { Delete } from "@mui/icons-material";

export class ClockModel {
  constructor(
    public area: string,
    public location: string,
    public region?: string,
    public shortLabel?: string
  ) {}
}

interface ClockTileModel extends ClockModel {
  area: string;
  location: string;
  mainTimezoneCity: string;
  mainTimezoneUtcOffset: number;
  region?: string;
  shortLabel?: string;
  onDelete?: (location: string) => void;
}

export const ClockTile = ({
  area,
  location,
  region,
  shortLabel,
  mainTimezoneCity,
  mainTimezoneUtcOffset,
  onDelete,
}: ClockTileModel) => {
  const [fetchedTime, setFetchedTime] = React.useState<Date | undefined>();
  const [details, setDetails] = React.useState<{
    shortLabel?: string;
    city?: string;
    abbreviation?: string;
    utcOffset?: number;
  }>({});
  const [liveTime, setLiveTime] = React.useState<Date | undefined>();
  const [isDeleteShown, setIsDeleteShown] = React.useState(false);

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
    let intervalId: any;
    if (fetchedTime) {
      let seconds = 1;
      intervalId = setInterval(() => {
        let updatedTime = new Date(fetchedTime.toString());
        updatedTime.setSeconds(updatedTime.getSeconds() + seconds);
        setLiveTime(updatedTime);
        seconds++;
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [fetchedTime]);

  const mainTimeZoneDiff = (details.utcOffset ?? 0) - mainTimezoneUtcOffset;

  const height = "20em";
  const width = "20em";
  const cardStyles = {
    margin: "10px 0px 10px 0px",
    padding: "2em",
    height,
    width,
    display: "flex",
    flexDirection: "row",
    gap: 5,
  } as React.CSSProperties;

  return liveTime ? (
    <Card style={cardStyles}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        onMouseEnter={() => setIsDeleteShown(true)}
        onMouseLeave={() => setIsDeleteShown(false)}
      >
        <div style={{ marginBottom: 30, textAlign: "center" }}>
          <Typography
            variant={"h5"}
            style={{
              fontWeight: "bolder",
            }}
          >
            {location.replace("_", " ")}
          </Typography>
          <Typography
            variant={"subtitle1"}
            style={{ height: 0, marginTop: "-5px", fontStyle: "italic" }}
          >
            {shortLabel}
          </Typography>
        </div>

        <Box
          style={{
            flex: 1,
            display: "flex",
            flexWrap: "wrap",
            alignContent: "center",
          }}
        >
          <Typography variant={"h4"}>
            {liveTime.toLocaleTimeString("en-GB")}
          </Typography>
        </Box>

        <Typography variant={"h6"}>{details.abbreviation}</Typography>
        <Typography variant={"subtitle1"}>
          {`${Math.abs(mainTimeZoneDiff)} ${
            Math.abs(mainTimeZoneDiff) > 1 ? "hours" : "hour"
          } ${
            mainTimeZoneDiff > 0 ? "ahead" : "behind"
          } of ${mainTimezoneCity}`}
        </Typography>
      </div>
      <div style={{ width: 0 }}>
        <IconButton
          onMouseEnter={() => setIsDeleteShown(true)}
          onMouseLeave={() => setIsDeleteShown(false)}
          style={{ display: isDeleteShown ? "flex" : "none", left: -35 }}
          size={"medium"}
          onClick={() => onDelete && onDelete(location)}
        >
          <Delete fontSize={"medium"} />
        </IconButton>
      </div>
    </Card>
  ) : (
    <Skeleton
      style={{ ...cardStyles }}
      sx={{ bgcolor: "grey.500" }}
      variant="rounded"
    />
  );
};
