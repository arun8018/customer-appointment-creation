import React from "react";
import MainAccordion from "./Components/MainAccordion";
import { makeStyles } from "@material-ui/core/styles";
import { createMuiTheme } from "@material-ui/core/styles";
import { MuiThemeProvider } from "@material-ui/core/styles";
const fontSize = 14;
const htmlFontSize = 12;
const coef = fontSize / 14;
const theme = createMuiTheme({
  typography: {
    pxToRem: (size) => `${(size / htmlFontSize) * coef}rem`,
  },
  overrides: {
    MuiTableCell: {
      root: {
        borderBottom: "none",
      },
      body: {
        wordBreak: "unset",
      },
    },
    MuiPaper: {
      elevation2: {
        boxShadow: "none",
      },
    },
  },
});
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 900,
    margin: "auto",
    paddingTop: 50,
  },
}));
function App() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <MuiThemeProvider theme={theme}>
        <MainAccordion />
      </MuiThemeProvider>
    </div>
  );
}

export default App;
