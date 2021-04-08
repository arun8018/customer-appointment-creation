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
import SelfieImage from "../SelfiImage";
import UploadImage from "../UploadImage";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import { Link } from "react-scroll";
import PhotoCameraRoundedIcon from '@material-ui/icons/PhotoCameraRounded';
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';


import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
const DEFAULT_TIMEZONE = momentTZ.tz.guess();
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    border: "1px solid #ddd",
    padding: 20,
    marginBottom: 30,
  },
  mainHeading: {
    padding: 0,
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
  input: {
    display: "none",
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
  const [confirmMessage, setConfirmMessage] = useState({})
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [showResult,setShowResult]=useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [imagePath,setImagePath]=useState();
  const [message, setMessage] = useState('')
  const [accordianExpand, setAccordianExpand] = useState(true)
  const [hideInfo, setHideInfo] = useState(false)
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);
  
  
  const handleClickOpen = () => {
      setMessage('')
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
  };
  
      const handleConfirmClickOpen = () => {
        setConfirmOpen(true);
      };

      const handleConfirmClose = () => {
        setConfirmOpen(false);
  };
  
        const handleUpoadClickOpen = () => {
          setUploadOpen(true);
        };

        const handleUploadClose = () => {
          setUploadOpen(false);
        };

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
    // setScheduleSlot([]);
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

  const handleContinueButtonClick = () => {
    setExpanded(false)
    setAccordianExpand(false)
    handleConfirmClose()
    setShowResult(true)
  }

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
      ).format("YYYY-MM-DDTHH:mm:ss"), //2021-03-30T09:30:00+05:30,
      stop: moment(scheduleDate + " " + scheduleTime, "YYYY-MM-DD HH:mm A")
        .add(29, "minutes")
        .format("YYYY-MM-DDTHH:mm:ss"), // 2021-03-30T09:59:00+05:30,
      time_zone: scheduleTimeZone,
    };
    setScheduleDetails(scheduleInfo)
    handleConfirmClickOpen(true);
  };

  const handleImgButtonClick = (e) => {
    setMessage("")
    const data = e.target.files[0]
    setImagePath(data)
    setImgFile(URL.createObjectURL(e.target.files[0]));
    handleUpoadClickOpen()
  }

  const handleSubmitButtonClick = () => {
      setIsConfirmLoading(true);
    const dateValue = moment(scheduleDetails.start).format("YYYY-MM-DD");
    let offSetValue = moment(dateValue).tz(scheduleDetails.time_zone).format("Z")
    console.log(offSetValue)
    const postData = {
      title: scheduleDetails.title,
      customers: [{ name: name, email: email, phone: phone }],
      agent: scheduleDetails.agent,
      schedule_type: scheduleDetails.schedule_type,
      start: scheduleDetails.start+offSetValue, //2021-03-30T09:30:00+05:30,
      stop: scheduleDetails.stop+offSetValue, // 2021-03-30T09:59:00+05:30,
      time_zone: scheduleDetails.time_zone,
    };
    console.log(postData);
    axios.post("/schedule/", postData).then((response) => {
      response.data && setConfirmMessage(response.data)
      response.data && setShowConfirmation(true)
      if (typeof(response.data) == "string") {
        alert("Please reload your page and try again!")
      };
      setIsConfirmLoading(false)
    });
    setShowResult(false);
  }

  const handleError = (data, IsClose) => {
    setMessage(data)
    IsClose && handleUploadClose()
    IsClose && handleClose()
    IsClose && setHideInfo(true)
  }

  return (
    <div>
      <Paper
        elevation={0}
        className={classes.root}
        style={{ marginTop: "50px" }}
      >
        <Typography variant="h6" className={classes.mainHeading}>
          1. Choose Appointment
        </Typography>
        {accordianExpand && (
          <div>
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
                                    {moment(item.date).format("MM-DD-YYYY")}
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
                                        style={{
                                          width: "100%",
                                          minWidth: "150px",
                                        }}
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
          </div>
        )}
      </Paper>
      <div id="info">
        <Paper elevation={0} className={classes.root}>
          <Typography variant="h6" className={classes.mainHeading}>
            2.Your Information
          </Typography>
          {showResult ? (
            <div>
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
                  type="tel"
                  required
                  // style={{ margin: 10 }}
                  style={{ margin: "0px 10px 10px 20px" }}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
                <div style={{ textAlign: "end", margin: 10 }}>
                  <Link to="details" spy={true} smooth={true}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleSubmitButtonClick}
                    >
                      Continue
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </Paper>
      </div>
      <div id="details">
        <Paper elevation={0} className={classes.root}>
          <Typography variant="h6" className={classes.mainHeading}>
            3.Confirmation
          </Typography>

          {isConfirmLoading && isConfirmLoading ? (
            <LinearProgress color="primary" className={classes.loader} />
          ) : null}

          {showConfirmation ? (
            <div>
              <Card style={{ padding: 20 }}>
                <CardContent style={{ textAlign: "center" }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Appointment created successfully -
                    {confirmMessage && confirmMessage.title}
                  </Typography>
                  <Typography variant="h4" color="textPrimary" gutterBottom>
                    {confirmMessage.time &&
                      moment(confirmMessage.date).format("MM-DD-YYYY")}
                  </Typography>
                  <Typography variant="h5" color="textPrimary" gutterBottom>
                    {confirmMessage.time &&
                      moment(confirmMessage.time, "H:mm:ss").format("h:mm a")}
                  </Typography>
                </CardContent>
                {hideInfo && hideInfo ? null : (
                  <CardContent style={{ textAlign: "center" }}>
                    <Typography
                      variant="body1"
                      color="primary"
                      component="p"
                      style={{ fontWeight: "600",fontSize: "15px",
    paddingBottom: "20px" }}
                    >
                      Upload Your Picture
                    </Typography>
                    <Typography
                      variant="body1"
                      color="textSecondary"
                      component="p"
                    >
                      <p style={{ fontWeight: "500", textAlign: "left" }}>
                        Upload your picture will allow our skin analyzer engine
                        to analyze your skin and be ready with insights which
                        can assist our consultant during the consultation.
                      </p>
                      <p style={{ fontWeight: "500", textAlign: "left" }}>
                        Please take care of the below conditions before
                        uploading/taking a photo
                      </p>
                      <div>
                        <div style={{ textAlign: "left" }}>
                          <p>
                            1) Make sure that you are in a well lit room or area
                            and there is no extra lighting on your face.
                          </p>
                          <p>
                            2) Make sure that your frontal face is properly
                            visible and it is neither blurred nor over
                            illuminated.
                          </p>
                          <p>3) Make sure that there is no facial hair.</p>
                          <p>
                            4) Make sure that you are absolutely not wearing any
                            kind of makeup (no goggles as well).
                          </p>
                          <p>
                            5) Make sure that your hair does not fall on your
                            forehead (better if it is tied back).
                          </p>
                          <p>
                            6) Make sure that your face is not neither blurred
                            nor over illuminated.
                          </p>
                        </div>
                      </div>
                    </Typography>

                    <CardActions style={{ justifyContent: "center" }}>
                      <Button
                        startIcon={<PhotoCameraRoundedIcon />}
                        variant="contained"
                        color="primary"
                        onClick={handleClickOpen}
                      >
                        TAKE SELFIE
                      </Button>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"
                      >
                        Or
                      </Typography>
                      <input
                        style={{ display: "none" }}
                        accept="image/*"
                        className={classes.input}
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={handleImgButtonClick}
                        onClick={(e) => {
                          e.target.value = null;
                        }}
                      />
                      <label htmlFor="contained-button-file">
                        <Button
                          startIcon={<PublishRoundedIcon />}
                          variant="contained"
                          color="primary"
                          component="span"
                        >
                          UPLOAD IMAGE
                        </Button>
                      </label>
                    </CardActions>
                  </CardContent>
                )}
              </Card>
            </div>
          ) : null}
        </Paper>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
      >
        <DialogTitle id="form-dialog-title">
          Upload Your Selfie
          <Typography variant="body2" color="textSecondary">
            Please capture your selfie image.
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContentText>
          <DialogContent>
            <SelfieImage
              scheduleDetails={confirmMessage}
              errorHandler={(data, IsClose) => handleError(data, IsClose)}
            />
          </DialogContent>
        </DialogContentText>
        <Divider />
        <DialogActions>
          <Typography variant="body2" style={{ color: "red", margin: "auto" }}>
            {message && message}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmOpen}
        onClose={handleConfirmClose}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
      >
        <DialogTitle id="form-dialog-title">
          Confirm Your Schedule!
          <Typography variant="body2" color="textSecondary">
            Your Schedule details displayed below.Confirm your schedule by
            clicking the confirm button.
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <div
            style={{
              textAlign: "center",
              marginTop: "0.5rem",
            }}
          >
            <Typography variant="h6" color="textSecondary">
              {scheduleDetails &&
                moment(scheduleDetails.start).format("MM-DD-YYYY")}
            </Typography>
            <Typography variant="h6">
              {scheduleDetails && scheduleDetails.title}
            </Typography>

            <Typography variant="subtitle2">
              {scheduleDetails &&
                moment(scheduleDetails.start).format("hh:mm A")}
            </Typography>
          </div>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            onClick={handleConfirmClose}
            color="primary"
            variant="outlined"
          >
            Close
          </Button>
          <Link to="info" spy={true} smooth={true}>
            <Button
              onClick={handleContinueButtonClick}
              color="primary"
              variant="contained"
            >
              Confirm
            </Button>
          </Link>
        </DialogActions>
      </Dialog>

      <Dialog
        open={uploadOpen}
        onClose={handleUploadClose}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
      >
        <DialogTitle id="form-dialog-title">
          Upload Image Preview
          <Typography variant="body2" color="textSecondary">
            Please select PNG/JPG image format for upload.
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContentText>
          <DialogContent>
            <UploadImage
              image={imgFile}
              imagePath={imagePath}
              scheduleDetails={confirmMessage}
              errorHandler={(data, IsClose) => handleError(data, IsClose)}
            />
          </DialogContent>
        </DialogContentText>
        <Divider />

        <DialogActions style={{ justifyItems: "end" }}>
          <Typography variant="body2" style={{ color: "red", margin: "auto" }}>
            {message && message}
          </Typography>
          <label htmlFor="contained-button-file">
            <Button variant="outlined" color="primary" component="span">
              Upload another photo
            </Button>
          </label>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUploadClose}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

         
