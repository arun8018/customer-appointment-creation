import React from "react";
import Webcam from "react-webcam";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import axios from "../../api/axios";


import { base64StringToBlob } from "blob-util";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));
export default function SelfieImage(props) {
  const classes = useStyles();
  const { scheduleDetails }=props
  const webcamRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const b64Data=imgSrc&&imgSrc.split(",")[1];
  const contentType = "image/jpeg";
  const blob = base64StringToBlob(b64Data, contentType);
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot({
      width: 320,
      height: 240,
    });
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);
  const handleButtonCick = () => {
    let formData = new FormData();
    let testFormData = new FormData();
    let uploadedImageName = "selfi.jpg";
    testFormData.append("image", blob,uploadedImageName);
    formData.append("photo", blob, uploadedImageName);
    formData.append("schedule_id", scheduleDetails && scheduleDetails.id);
    axios
      .post(
        "https://vc-oriflame-client.litmus7.com/appointment/check-image",
        // "http://65.0.247.253:5001/skin_analyzer",
        testFormData
      )
      .then((response) => {
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
                props.errorHandler("", true);
                console.log(response.data);
              });
      });
  }

  const clearCapure = () => {
    setImgSrc(null)
  }
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={6} style={{ textAlign: "center" }}>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="320"
              height="auto"
            ></Webcam>
            <Button variant="contained" color="primary" style={{width:"320px"}} onClick={capture}>Capture photo</Button>
        </Grid>
        <div style={{ textAlign: "center",margin:"10px" }}>
            {imgSrc ? (
              <img alt="SelfieImage" src={imgSrc} width="320" height="auto" />
            ) : (
              <Avatar
                variant="square"
                style={{ width: "320px", height: "240px", margin: "auto" }}
              >
                Image Preview
              </Avatar>
            )}
            <div style={{display:"flex",marginTop:"10px",justifyContent:'space-between'}}>
              <Button variant="outlined" color="primary" style={{width:"150px"}} onClick={clearCapure}>Take another</Button>
              <Button variant="contained" color="primary" style={{width:"160px"}} onClick={handleButtonCick}>Use This Photo</Button>
            </div>
        </div>
      </Grid>
    </div>
  );
}
