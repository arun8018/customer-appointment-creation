import React,{useState} from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import axios from "../../api/axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
}));
export default function UploadImage(props) {
  const classes = useStyles();
  const { imagePath, image, scheduleDetails } = props;
  const [progress,setProgress]=useState(false)
  console.log(scheduleDetails && scheduleDetails);
  const handleButtonCick = () => {
    setProgress(true)
    let testFormData = new FormData();
    testFormData.append("image", imagePath && imagePath);
    let formData = new FormData();
    formData.append("photo", imagePath && imagePath);
    formData.append("schedule_id", scheduleDetails && scheduleDetails.id);
    axios
      .post(
        "https://vc-oriflame-client.litmus7.com/appointment/check-image",
        // "http://65.0.247.253:5001/skin_analyzer",
        testFormData
      )
      .then((response) => {
        setProgress(false);
        console.log(response.data);
        response.data.error
          ? props.errorHandler("Please upload another image", false)
          : axios
              .put(
                `customer/${
                  scheduleDetails && scheduleDetails.customers[0].id
                }`,
                formData
              )
              .then((response) => {
                console.log(response.data);
                props.errorHandler("", true);
              });
      });

  };

  return (
    <div className={classes.root}>
      <Grid container spacing={3} style={{ justifyContent: "center" }}>
        <Grid item xs={12} md={6} sm={6} style={{ textAlign: "center" }}>
          <img src={image && image} alt="upload" width="320" height="340" />
          
            <Button
              variant="contained"
              color="primary"
              style={{ width: "320px",marginTop: "10px"}}
              onClick={handleButtonCick}
            >
              Use This Photo
            </Button>
          {progress ? <CircularProgress size={42} className={classes.buttonProgress} /> : null}
        </Grid>
      </Grid>
    </div>
  );
}
