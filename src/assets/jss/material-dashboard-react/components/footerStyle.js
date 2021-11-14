import {
  defaultFont,
  container,
  primaryColor,
} from "assets/jss/material-dashboard-react.js";

const footerStyle = {
  block: {
    color: "inherit",
    padding: "15px",
    textTransform: "uppercase",
    borderRadius: "3px",
    textDecoration: "none",
    position: "relative",
    display: "block",
    ...defaultFont,
    fontWeight: "500",
    fontSize: "12px"
  },
  left: {
    float: "left!important",
    display: "block"
  },
  right: {
    padding: "15px 0",
    margin: "0",
    fontSize: "14px",
    float: "right!important"
  },
  footer: {
    bottom: "0",
    borderTop: "4px solid #e7e7e7",
    padding: "15px 0",
    lineHeight: "1.5em"
  },
  container,
  a: {
    color: primaryColor,
    textDecoration: "none",
    backgroundColor: "transparent"
  },
  list: {
    marginBottom: "0",
    padding: "0",
    marginTop: "0",
    display: 'flex',
    flexDirection: 'row',
    width: "fit-content"
  },
  inlineBlock: {
    display: "contents",
    padding: "0px",
    width: "auto",
  },
  gridLaFlotaDer: {
    padding: "15px 20px",
    textAlign: "end",
    fontSize: "14px",
    float: "right !important"
  }
};
export default footerStyle;
