import React, { useRef, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Quote from "components/Typography/Quote.js";
import Muted from "components/Typography/Muted.js";
import Primary from "components/Typography/Primary.js";
import Info from "components/Typography/Info.js";
import Success from "components/Typography/Success.js";
import Warning from "components/Typography/Warning.js";
import Danger from "components/Typography/Danger.js";

import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import SnackbarContent from "components/Snackbar/SnackbarContent.js";
import Snackbar from "components/Snackbar/Snackbar.js";
import AddAlert from "@material-ui/icons/AddAlert";

const styles = {
  typo: {
    paddingLeft: "25%",
    marginBottom: "40px",
    position: "relative"
  },
  note: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    bottom: "10px",
    color: "#c0c1c2",
    display: "block",
    fontWeight: "400",
    fontSize: "13px",
    lineHeight: "13px",
    left: "0",
    marginLeft: "20px",
    position: "absolute",
    width: "260px"
  },
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};

const useStyles = makeStyles(styles);
var response;
var data;
var info;

export default function TypographyPage() {
  const i1 = useRef("");
  const i2 = useRef("");
  const [error, setError] = useState(null);
  const [err, setErr] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const classes = useStyles();
  const [bl, setBL] = React.useState(false);
  const [publicKey, setPublicKey] = useState(null);

  // React.useEffect(() => {
  //   // Specify how to clean up after this effect:
  //   return function cleanup() {
  //     // to stop the warning of calling setState of unmounted component
  //     var id = window.setTimeout(null, 0);
  //     while (id--) {
  //       window.clearTimeout(id);
  //     }
  //   };
  // });
  const showNotification = place => {
    switch (place) {


      case "bl":
        if (!bl) {
          setBL(true);
          setTimeout(function () {
            setBL(false);
          }, 6000);
        }
        break;


      default:
        break;
    }
  };
  const newPublicKeyChosen = e => {
    var reader = new FileReader();
    reader.onload = function () {
      var text = reader.result;
      setPublicKey(text);
    };
    reader.readAsText(e.target.files[0]);
  }



  const Submit = async () => {
    try {

      const response = await fetch("http://localhost:5000/balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alias: document.getElementById("alias").value,

        }),
      });

      const responseData = await response.json();


      return responseData;


    } catch (err) {
      console.log(err);

    }

  };

  const subpub = async () => {

    try {

      const response = await fetch("http://localhost:5000/balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicKey: publicKey,

        }),
      });

      const responseData = await response.json();


      return responseData;


    } catch (err) {
      console.log(err);

    }

  }

  return (
    <div>
      < div >
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Check your Balance</h4>
                <p className={classes.cardCategoryWhite}>ALIAS METHOD</p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} >
                    <CustomInput
                      labelText="Alias"
                      id="alias"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        disabled: false
                      }}
                    />
                  </GridItem>
                  {/* <GridItem xs={12} sm={12} >
                <CustomInput
                  labelText="Public Key"
                  id="public Key"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    multiline: true,
                    rows: 10
                  }}
                />
              </GridItem> */}

                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="primary" onClick={async () => {
                  response = await Submit();
                  data = "Your balance is" + response.balance;
                  showNotification("bl")
                }}>Submit</Button>

              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div >
      < div >
        <GridContainer>
          <GridItem xs={12} sm={12} md={8}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Check your Balance</h4>
                <p className={classes.cardCategoryWhite}>PUBLIC KEY METHOD </p>
              </CardHeader>
              <GridItem>
                <input accept="*" className={classes.input} id="aa-choose-public-key"
                  type="file" onChange={newPublicKeyChosen} hidden={true} />
                <label htmlFor="aa-choose-public-key">
                  <Button variant="contained" color="primary" component="span">
                    Choose Public Key
              </Button>
                </label>
              </GridItem>
              <GridItem xs={12} sm={12} >
                <CustomInput
                  labelText={
                    publicKey === null ? "PublicKey" : ""
                  }
                  id="Pub"
                  formControlProps={{
                    fullWidth: true
                  }}
                  inputProps={{
                    multiline: true,
                    rows: 10,
                    value: publicKey,
                    disabled: true

                  }}
                />

              </GridItem>

              <CardFooter>
                <Button color="primary" onClick={async () => {
                  response = await subpub();
                  if (response.balance === "ERR")
                    data = "User not Found";
                  else
                    data = "Your balance is" + response.balance;

                  showNotification("bl")
                }}>Submit</Button>
                <Snackbar
                  place="bl"
                  color={data === 'User not Found' ? 'danger' : 'success'}
                  icon={AddAlert}
                  message={data}
                  open={bl}
                  closeNotification={() => setBL(false)}
                  close
                />
              </CardFooter>
            </Card>
          </GridItem>

        </GridContainer>
      </div >

    </div>

  )
}
