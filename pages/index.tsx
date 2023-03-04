import { AddCircleOutline } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent, DialogTitle,
  IconButton,
  MenuItem,
  Select
} from "@mui/material";
import type { NextPage } from "next";
import React from "react";
import { ClockModel, ClockTile } from "../components/ClockTile";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [fetchedMainTime, setFetchedMainTime] = React.useState<
    Date | undefined
  >();
  const [utcOffset, setUtcOffset] = React.useState<number>(0);
  const [liveTime, setLiveTime] = React.useState<Date | undefined>();
  const [clocks, setClocks] = React.useState<ClockModel[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

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
        {liveTime && <div>{liveTime.toLocaleTimeString('en-GB')}</div>}
        <div>{utcOffset}</div>
      </div>
      <div style={{ display: "flex", gap: 20}}>
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
      {clocks.length < 4 && (
        <>
          <IconButton onClick={() => setIsAddModalOpen(true)}>
            <AddCircleOutline />
          </IconButton>
          <AddClockDialog
            key={JSON.stringify(clocks)}
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onConfirm={(newClock: ClockModel) => {
              return setClocks([...clocks, newClock]);
            }}
            existingClocks={clocks}
          />
        </>
      )}
    </div>
  );
};

export default Home;

const AddClockDialog = ({
  isOpen,
  onClose,
  onConfirm,
  existingClocks,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newClock: ClockModel) => void;
  existingClocks: ClockModel[];
}) => {
  const allowedCities = React.useMemo(
    () =>
      [
        {
          value: { area: "Asia", city: "Singapore" },
          label: "Singapore (Asia/Singapore)",
        },
        { value: { area: "Asia", city: "Tokyo" }, label: "Tokyo (Asia/Tokyo)" },
        { value: { area: "Asia", city: "Seoul" }, label: "Seoul (Asia/Seoul)" },
        {
          value: { area: "Australia", city: "Melbourne" },
          label: "Melbourne (Australia/Melbourne)",
        },
        {
          value: { area: "Australia", city: "Sydney" },
          label: "Sydney (Australia/Sydney)",
        },
        {
          value: { area: "Europe", city: "London" },
          label: "London (Europe/London)",
        },
        {
          value: { area: "Europe", city: "Paris" },
          label: "Paris (Europe/Paris)",
        },
        {
          value: { area: "Europe", city: "Berlin" },
          label: "Berlin (Europe/Berlin)",
        },
        {
          value: { area: "America", city: "New_York" },
          label: "New York (America/New_York)",
        },
        {
          value: { area: "America", city: "Los_Angeles" },
          label: "Los Angeles (America/Los_Angeles)",
        },
      ].filter(
        (f) => !existingClocks.map((m) => m.location).includes(f.value.city)
      ),
    [existingClocks]
  );

  const [newClock, setNewClock] = React.useReducer(
    (current: ClockModel, update: Partial<ClockModel>) => ({
      ...current,
      ...update,
    }),
    new ClockModel(allowedCities[0].value.area, allowedCities[0].value.city)
  );

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth>
      <DialogTitle>{"Add a new clock"}</DialogTitle>
      <DialogContent>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          placeholder={"City"}
          value={newClock.location ?? allowedCities[0].value.city}
          onChange={(selected) => {
            const selectedCity = allowedCities.find(
              (f) => f.value.city === selected.target.value
            )?.value;
            selectedCity &&
              setNewClock({
                area: selectedCity.area,
                location: selectedCity.city,
              });
          }}
          fullWidth
        >
          {allowedCities.map((m) => (
            <MenuItem key={m.label} value={m.value.city}>
              {m.label}
            </MenuItem>
          ))}
        </Select>
        {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" value={} /> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            onConfirm(newClock);
            setNewClock(allowedCities[0].value);
            onClose();
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};
