import React from 'react';
import MainAccordion from "./Components/MainAccordion"
import { makeStyles } from "@material-ui/core/styles";
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 900,
    margin: "auto",
    paddingTop:50
  },
}));
function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <MainAccordion />
    </div>
  );
}

export default App;