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


import avatar from "assets/img/faces/marc.jpg";

const styles = {
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



export default function UserProfile() {
  const classes = useStyles();
  const [publicKey, setPublicKey] = useState(null);
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

      const response = await fetch("http://localhost:5000/addAlias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          alias: document.getElementById("alias").value,
          publicKey: publicKey,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      console.log(responseData);


    } catch (err) {
      console.log(err);

    }
  };




  return (
    <React.Fragment>
      <div>
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={8}>
              <Card>
                <CardHeader color="primary">
                  <h4 className={classes.cardTitleWhite}>Not a Blockchain Member!</h4>
                  <p className={classes.cardCategoryWhite}>Add your details</p>
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
                        id="public_Key"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          multiline: true,
                          rows: 10
                        }}

                      />
                    </GridItem> */}
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
                  </GridContainer>
                </CardBody>
                <CardFooter>
                  <Button color="primary" onClick={async () => {
                    await Submit();
                  }}>Sign up</Button>
                </CardFooter>
              </Card>
            </GridItem>
          </GridContainer>
        </div>


      </div >
    </React.Fragment >
  );
}
