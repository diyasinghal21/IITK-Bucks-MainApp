import React, { useRef, useState } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardAvatar from "components/Card/CardAvatar.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";


import styles from "assets/jss/material-dashboard-react/views/iconsStyle.js";


const useStyles = makeStyles(styles);

export default function Icons() {
  const classes = useStyles();
  const Submit = async () => {
    try {

      const response = await fetch("http://localhost:5000/getBlock/" + document.getElementById("bno").value, {
        method: "GET",
      });

      const responseData = await response.blob();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      console.log(responseData);
      window.open("http://localhost:5000/getBlock/" + document.getElementById("bno").value);


    } catch (err) {
      console.log(err);

    }
  };




  return (
    <React.Fragment>
      <div>


        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Get a Block Data File</h4>
              <p className={classes.cardCategoryWhite}>Enter the index</p>
            </CardHeader>
            <CardBody>
              <GridContainer>
                <GridItem xs={12} sm={12} >
                  <CustomInput
                    labelText="Index"
                    id="bno"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      disabled: false,

                    }}


                  />
                  <CardFooter>

                    <Button color="primary" onClick={async () => {
                      await Submit();
                      console.log("working");

                    }}>Submit</Button>

                  </CardFooter>
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>

        </GridItem>




      </div >
    </React.Fragment >





  );
}