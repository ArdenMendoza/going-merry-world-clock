import { AddCircleOutline } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
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
  const [clocks, setClocks] = React.useState<ClockModel[]>([
    // new ClockModel("Asia", "Chita", undefined, "Chita label"),
    // new ClockModel("Asia", "Magadan", undefined, "Magadan label"),
    // new ClockModel("America", "Mexico_City", undefined, "Mexico_City label"),
  ]);
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
      {clocks.length < 4 && (
        <>
          <IconButton onClick={() => setIsAddModalOpen(true)}>
            <AddCircleOutline />
          </IconButton>
          <AddClockDialog
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onConfirm={(newClock: ClockModel) => console.log({ newClock })}
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
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newClock: ClockModel) => void;
}) => {
  const [newClock, setNewClock] = React.useReducer(
    (current: ClockModel, update: Partial<ClockModel>) => ({
      ...current,
      ...update,
    }),
    new ClockModel("", "")
  );
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{"Add a new clock"}</DialogTitle>
      <DialogContent>
        <TextInput
          label={"Continent"}
          value={newClock.area}
          onChange={(newValue) => setNewClock({ area: newValue })}
          autoFocus
        />
        <TextInput
          label={"City"}
          value={newClock.location}
          onChange={(newValue) => setNewClock({ location: newValue })}
        />
        <TextInput
          label={"Region"}
          value={newClock.region}
          onChange={(newValue) => setNewClock({ region: newValue })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            onConfirm(newClock);
            setNewClock(new ClockModel());
            onClose();
          }}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const TextInput = ({
  label,
  value,
  onChange,
  autoFocus,
}: {
  label: string;
  value: string | undefined;
  onChange: (newValue: string) => void;
  autoFocus?: boolean;
}) => {
  return (
    <TextField
      autoFocus={autoFocus}
      margin="normal"
      id="area"
      label={label}
      type="text"
      fullWidth
      variant="standard"
      value={value ?? ""}
      onChange={(newValue) => onChange(newValue.currentTarget.value)}
    />
  );
};
