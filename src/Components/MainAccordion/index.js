import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Paper from "@material-ui/core/Paper";
import axios from "../../api/axios";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";
import momentTZ from "moment-timezone";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import moment from "moment";
import SelfieImage from "../SelfiImage"
const DEFAULT_TIMEZONE = momentTZ.tz.guess();
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    border: "1px solid #ddd",
    padding: 20,
    paddingBottom: 30,
    marginBottom: 30,
  },
  mainHeading: {
    paddingBottom: 8,
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    paddingBottom: 5,
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(14),
    color: theme.palette.text.secondary,
  },
  loader: {
    margin: 30,
  },
  circularLoader: {
    margin: "auto",
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function MainAccordion() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const [scheduleTypes, setScheduleType] = useState([]);
  const [scheduleSlots, setScheduleSlot] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgess] = useState(false);
  const [timeZone, selectedTimeZone] = useState(DEFAULT_TIMEZONE);
  const [scheduleId, setScheduleId] = useState();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("");
  const [scheduleDetails, setScheduleDetails] = useState()
  const [confirmMessage,setConfirmMessage]=useState({})

  // schedule type and description API call
  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/schedule_type/")
      .then((response) => {
        setScheduleType(response.data);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  //schedule timeslots API call
  useEffect(() => {
    setProgess(true);
    scheduleId &&
      axios
        .get(
          `/schedule-availablilty/?schedule_type=${scheduleId}&time_zone=${timeZone}`
        )
        .then((response) => {
          setScheduleSlot(response.data);
          setProgess(false);
        })
        .catch((error) => console.log(error));
  }, [scheduleId, timeZone]);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    setScheduleId(panel);
    setScheduleSlot([]);
    if (isExpanded) {
      selectedTimeZone(DEFAULT_TIMEZONE);
    }
  };

  const handleTimeZoneChange = (e, value) => {
    setScheduleSlot([]);
    if (value) {
      selectedTimeZone(value);
    }
  };

  const onHandleButtonClick = (
    scheduleTime,
    scheduleTimeZone,
    scheduleType,
    scheduleDate,
    agentId,
    scheduleId
  ) => {
    // console.log(scheduleTime + scheduleTimeZone + scheduleType+scheduleDate+agentId+scheduleId);
    const scheduleInfo = {
      title: scheduleType,
      agent: agentId,
      schedule_type: scheduleId,
      start: moment(
        scheduleDate + " " + scheduleTime,
        "YYYY-MM-DD HH:mm A"
      ).format("YYYY-MM-DDTHH:mm:ssZ"), //2021-03-30T09:30:00+05:30,
      stop: moment(scheduleDate + " " + scheduleTime, "YYYY-MM-DD HH:mm A")
        .add(29, "minutes")
        .format("YYYY-MM-DDTHH:mm:ssZ"), // 2021-03-30T09:59:00+05:30,
      time_zone: scheduleTimeZone,
    };
    setScheduleDetails(scheduleInfo)


  };

  const handleSubmitButtonClick = () => {
    const postData = {
      title: scheduleDetails.title,
      customers: [{ name: name, email: email, phone: phone }],
      agent: scheduleDetails.agent,
      schedule_type: scheduleDetails.schedule_type,
      start: scheduleDetails.start, //2021-03-30T09:30:00+05:30,
      stop: scheduleDetails.stop, // 2021-03-30T09:59:00+05:30,
      time_zone: scheduleDetails.time_zone,
    };
    axios.post("/schedule/", postData).then((response) => {
      response.data && setConfirmMessage(response.data)
    });
  }

  return (
    <div>
      <Paper elevation={0} className={classes.root}>
        <Typography variant="h6" className={classes.mainHeading}>
          1. Choose Appointment
        </Typography>
        {isLoading ? (
          <LinearProgress color="primary" className={classes.loader} />
        ) : null}
        {scheduleTypes.map((items, index) => {
          return (
            <Accordion
              key={index}
              expanded={expanded === items.id}
              onChange={handleChange(items.id)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <div>
                  <Typography className={classes.heading}>
                    {items.name}
                  </Typography>
                  <Typography className={classes.secondaryHeading}>
                    {items.description}
                  </Typography>
                </div>
              </AccordionSummary>
              <AccordionDetails
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Autocomplete
                  options={momentTZ.tz.names()}
                  getOptionLabel={(option) => option}
                  value={timeZone}
                  style={{ width: 300 }}
                  onChange={handleTimeZoneChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Your Timezone"
                      variant="outlined"
                    />
                  )}
                />

                {progress ? (
                  <CircularProgress
                    style={{ justifyContent: "center" }}
                    color="primary"
                    className={classes.circularLoader}
                  />
                ) : null}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  {scheduleSlots.map((item, index) => {
                    return (
                      <div key={index}>
                        <Grid container spacing={1}>
                          <Grid container item xs={12} spacing={1}>
                            <Grid
                              item
                              xs={8}
                              style={{
                                textAlign: "center",
                              }}
                            >
                              <Paper
                                className={classes.paper}
                                style={{
                                  width: "100%",
                                  minWidth: "150px",
                                  backgroundColor: "#3f51b5",
                                  color: "white",
                                  marginTop: 20,
                                  marginBottom: 5,
                                }}
                              >
                                {item.weekday}
                                <br></br>
                                {item.date}
                              </Paper>
                            </Grid>
                          </Grid>
                        </Grid>
                        {item.timerange.map((t, i) => {
                          return (
                            <Grid container spacing={1}>
                              <Grid
                                container
                                item
                                xs={12}
                                spacing={2}
                                direction="column"
                              >
                                <Grid item xs={8}>
                                  <Paper
                                    className={classes.paper}
                                    style={{ width: "100%", minWidth: "150px" }}
                                  >
                                    <Button
                                      style={{ width: "100%" }}
                                      onClick={() =>
                                        onHandleButtonClick(
                                          t[1],
                                          timeZone,
                                          items.name,
                                          item.date,
                                          t[0],
                                          items.id
                                        )
                                      }
                                    >
                                      {t[1]}
                                    </Button>
                                  </Paper>
                                </Grid>
                              </Grid>
                            </Grid>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Paper>
      <Paper elevation={0} className={classes.root}>
        <Typography variant="h6" className={classes.mainHeading}>
          2.Your Information
        </Typography>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <TextField
            required
            id="name"
            label="Name"
            style={{ margin: "0px 10px 10px 20px" }}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <TextField
            id="email"
            label="Email"
            value={email}
            required
            // style={{ margin: 10 }}
            style={{ margin: "0px 10px 10px 20px" }}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <TextField
            id="phone"
            label="Phone Number"
            value={phone}
            type="number"
            required
            // style={{ margin: 10 }}
            style={{ margin: "0px 10px 10px 20px" }}
            onChange={(e) => {
              setPhone(e.target.value);
            }}
          />
          <div style={{ textAlign: "end", margin: 10 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitButtonClick}
            >
              Continue
            </Button>
          </div>
        </div>
      </Paper>
      <Paper elevation={0} className={classes.root}>
        <Typography variant="h6" className={classes.mainHeading}>
          3.Confirmation
        </Typography>
        <div>
          {confirmMessage && confirmMessage.title}
          {confirmMessage.time&&moment(confirmMessage.time, "H:mm:ss").format(
            "h:mm a"
          )}
        </div>
      </Paper>
    </div>
  );
}

          // <SelfieImage />;
