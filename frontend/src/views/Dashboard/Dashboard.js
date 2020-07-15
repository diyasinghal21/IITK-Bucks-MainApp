import React, { useState, useRef } from "react";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { bugs, website, server } from "variables/general.js";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

export default function Dashboard() {
  const classes = useStyles();

  const [privatekey, setPrivate] = useState("");
  const [numout, setNum] = useState(0);
  const [publickey, setPublic] = useState("");
  const [trans, setTrans] = useState([]);
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);

  const newPublicKeyChosen = (e) => {
    var reader = new FileReader();
    reader.onload = function () {
      var text = reader.result;
      setPublicKey(text);
    };
    reader.readAsText(e.target.files[0]);
  };

  const newPrivateKeyChosen = (e) => {
    var reader = new FileReader();
    reader.onload = function () {
      var text = reader.result;
      setPrivateKey(text);
    };
    reader.readAsText(e.target.files[0]);
  };

  const Submit = async () => {
    var statecopy = [];
    for (var i = 0; i < parseInt(numout); i++) {
      statecopy.push({
        alias: document.getElementById("alias" + i).value,
        coins: document.getElementById("coins" + i).value,
      });
    }
    var obj = {};
    obj["privatekey"] = privateKey;
    obj["publickey"] = publicKey;
    obj["numout"] = numout;
    obj["transdata"] = statecopy;
    try {

      const response = await fetch("http://localhost:5000/createTransaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(obj)
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.log(response);
      }


      return responseData;


    } catch (err) {
      console.log(err);
    }



  };
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={12}>
          <CustomTabs
            title="CREATE A TRANSACTION"
            headerColor="primary"
            tabs={[
              {
                tabName: "ADD YOUR PRIVATE KEY",
                tabIcon: BugReport,
                tabContent: (
                  <div>
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={8}>
                        <Card>
                          <CardHeader color="primary">
                            <h4 className={classes.cardTitleWhite}>
                              Your private and public key
                            </h4>
                            <p className={classes.cardCategoryWhite}>
                              Add the details
                            </p>
                          </CardHeader>
                          <CardBody>
                            <GridContainer>

                              <GridItem xs={12} sm={12} md={8}>
                                <GridItem>
                                  <input
                                    accept="*"
                                    className={classes.input}
                                    id="aa-choose-public-key"
                                    type="file"
                                    onChange={newPublicKeyChosen}
                                    hidden={true}
                                  />
                                  <label htmlFor="aa-choose-public-key">
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      component="span"
                                    >
                                      Choose Public Key
                                    </Button>
                                  </label>
                                </GridItem>

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
                              {/* <GridItem xs={12} sm={12} >
                                <CustomInput
                                  labelText="Public Key"
                                  id="Public"
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    multiline: true,
                                    rows: 10
                                  }}
                                />
                              </GridItem> */}
                              <GridItem xs={12} sm={12} md={8}>
                                <GridItem>
                                  <input
                                    accept="*"
                                    className={classes.input}
                                    id="aa-choose-private-key"
                                    type="file"
                                    onChange={newPrivateKeyChosen}
                                    hidden={true}
                                  />
                                  <label htmlFor="aa-choose-private-key">
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      component="span"
                                    >
                                      Choose Private Key
                                    </Button>
                                  </label>
                                </GridItem>
                              </GridItem>
                              <GridItem xs={12} sm={12} >
                                <CustomInput
                                  labelText={
                                    privateKey === null ? "PrivateKey" : ""
                                  }
                                  id="Pri"
                                  formControlProps={{
                                    fullWidth: true
                                  }}
                                  inputProps={{
                                    multiline: true,
                                    rows: 10,
                                    value: privateKey,
                                    disabled: true

                                  }}
                                />

                              </GridItem>

                              <GridItem xs={12} sm={12}>
                                <CustomInput
                                  labelText="No of outputs you want to choose?"
                                  id="numout"
                                  formControlProps={{
                                    fullWidth: true,
                                  }}
                                />
                              </GridItem>
                            </GridContainer>
                          </CardBody>
                          <CardFooter>
                            <Button
                              color="primary"
                              onClick={() => {
                                setNum(document.getElementById("numout").value);
                                console.log(numout);
                                var list = [];
                                for (var i = 0; i < numout; i++) {
                                  list.push({
                                    alias: "null",
                                    coins: "null",
                                  });
                                }
                                console.log(list);
                                setTrans(list);
                                console.log(trans);
                              }}
                            >
                              Submit
                            </Button>
                          </CardFooter>
                        </Card>
                      </GridItem>
                    </GridContainer>
                  </div>
                ),
              },
              {
                tabName: "CHOOSE YOUR OUPUTS",
                tabIcon: Code,
                tabContent: trans.map((transaction, index) => {
                  return (
                    <GridContainer>
                      <GridItem xs={12} sm={12}>
                        <CardBody>
                          <CustomInput
                            labelText={"Alias" + index}
                            id={"alias" + index}
                            formControlProps={{
                              fullWidth: true,
                            }}
                          />
                        </CardBody>
                      </GridItem>
                      <GridItem xs={12} sm={12}>
                        <CardBody>
                          <CustomInput
                            labelText={"Coins" + index}
                            id={"coins" + index}
                            formControlProps={{
                              fullWidth: true,
                            }}
                          />
                        </CardBody>
                        {index == numout - 1 && (
                          <CardFooter>
                            <Button
                              color="primary"
                              onClick={async () => {
                                await Submit();
                              }}
                            >
                              Submit
                            </Button>
                          </CardFooter>
                        )}
                      </GridItem>
                    </GridContainer>
                  );
                }),
              },
            ]}
          />
        </GridItem>
      </GridContainer>
    </div>
  );
}
