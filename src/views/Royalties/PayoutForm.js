import React, { useRef, useState, useEffect } from "react";
import useForm from '../../customHooks/useForm';
import { Grid, Typography, Divider, Link, Card, InputAdornment, CardMedia, ButtonBase } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { Paid, AccountBalance, AccountBalanceWallet } from '@mui/icons-material';
import SimpleReactValidator from 'simple-react-validator';
import ReauthenticateDialog from "../../components/Dialogs/ReauthenticateDialog";

import CardTemplate from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";
import { useForceUpdate, toWithOutError, truncateFloat, formatPeriodComma, formatThousandsPoint } from 'utils';
import { userDataUpdateRedux } from "redux/actions/UserDataActions";
import ProgressButton from 'components/CustomButtons/ProgressButton';
import TextFieldWithInfo from 'components/TextField/TextFieldWithInfo';
import { fugaGreen } from "variables/colors";
import BasicCheckbox from 'components/Checkbox/BasicCheckbox';
import { mediosDePagoWithInfo } from '../../variables/financial';
import { getArtistsAccountingValuesFS } from "services/FirestoreServices";
import { getLastPayoutForUser } from "services/BackendCommunication";
import useWindowDimensions from '../../customHooks/useWindowDimensions';

const PayoutForm = () => {

  const validator = useRef(new SimpleReactValidator());
  const forceUpdate = useForceUpdate();
  const dispatch = useDispatch();
  const windowDimensions = useWindowDimensions();
  let windowWidth = windowDimensions.width;
  let cardMediaWidth = windowWidth > 1200 ? 200 : 100;

  const userData = useSelector(store => store.userData);
  const addingPayout = useSelector(store => store.payouts.addingPayout);
  const userPayouts = useSelector(store => store.payouts.payouts);
  const errorHandler = useSelector(store => store.errorHandler);
  const artists = useSelector(store => store.artists.artists);
  const artistsNames = artists.map(artist => artist.name);

  const [openChangeCredentialsDialog, setOpenChangeCredentialsDialog] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [medioDePago, setMedioDePago] = useState({ name: "ARS", id: "ars", account: 'bank' });
  const [confirmAccountValue, setConfirmAccountValue] = useState("");
  const [ownerAccount, setOwnerAccount] = useState(true);
  const [usdToArsRate, setUsdToArsRate] = useState(0);
  const [totalRoyaltiesAndPayed, setTotalRoyaltiesAndPayed] = useState({ royalties: 0, payed: 0, loading: true, available: 0 });

  let requestURL = 'https://api.exchangerate.host/convert?from=USD&to=ARS';
  let request = new XMLHttpRequest();
  request.open('GET', requestURL);
  request.responseType = 'json';
  request.send();

  request.onload = () => setUsdToArsRate(request.response.result);

  useEffect(() => {
    const getTotalRoyalties = async () => {
      let royalties = await getArtistsAccountingValuesFS(artistsNames, dispatch);
      let payed = await getLastPayoutForUser(userData.email, dispatch);
      let available = parseFloat(truncateFloat(parseFloat(royalties) - parseFloat(payed), 2, '.'));
      setTotalRoyaltiesAndPayed({ payed, royalties, loading: false, available });
      setForm({ target: { name: 'transferTotalUsd', value: available } });
    }

    getTotalRoyalties();
  }, [])

  let defaultData = {
    userName: userData.nombre || "",
    userLastName: userData.apellido || "",
    telefono: userData.telefono || "",
    ciudad: userData.ciudad || "",
    userCuit: userData.cuit,
    userEmail: userData.email,
    stats: userData.stats,
    userId: userData.id,
    paypalEmail: "",
    payoneerEmail: "",
    cbuOrCvu: "",
    transferTotalUsd: 0,
    transferTotalAskedCurrency: 0,
  };

  const [formData, setForm] = useForm(defaultData);
  let { userName, userLastName, userCuit, telefono, paypalEmail, transferTotalAskedCurrency, payoneerEmail, cbuOrCvu, transferTotalUsd } = formData;

  const handleSubmit = async () => {
    if (checkFields()) {
      setOpenLoader(true);
      let resultEdit = await toWithOutError(dispatch(userDataUpdateRedux({ ...formData })));
      setEditState(resultEdit);
      setOpenLoader(false);
    }
  }

  const checkFields = () => {
    forceUpdate();
    if (validator.current.allValid()) return true;
    else {
      console.log(validator.current);
      validator.current.showMessages();
      forceUpdate();
      return false;
    }
  }

  const [editState, setEditState] = useState("none");
  const [buttonText, setButtonText] = useState("Solicitar Regalías");

  useEffect(() => {
    if (editState === "success") setButtonText("Regalías Solicitadas");
  }, [editState, errorHandler]);

  const cuitHelperLink = <Link sx={{ fontSize: '0.75rem' }} href="https://www.cuitonline.com/" target="_blank" variant="body2" underline="hover">
    Si no lo sabés hacé click acá.
  </Link>

  let borderHeight = 7;
  const cardStylePesos = {
    width: medioDePago.id === "ars" ? cardMediaWidth - borderHeight * 2 : cardMediaWidth,
    height: medioDePago.id === "ars" ? cardMediaWidth - borderHeight * 2 : cardMediaWidth,
    borderRadius: "1em", border: medioDePago.id === "ars" ? 7 : 0, borderColor: fugaGreen,
  };

  const cardStyleUsd = {
    width: medioDePago.id === "usd" ? cardMediaWidth - borderHeight * 2 : cardMediaWidth,
    height: medioDePago.id === "usd" ? cardMediaWidth - borderHeight * 2 : cardMediaWidth,
    borderRadius: "1em", border: medioDePago.id === "usd" ? 7 : 0, borderColor: fugaGreen,
  };

  const onClickCurrency = currency => {
    setMedioDePago({
      name: currency === "dolar" ? "USD" : "ARS",
      id: currency === "dolar" ? "usd" : "ars",
      account: currency === "dolar" ? "paypal" : "bank",
      accountName: currency === "dolar" ? "PayPal" : "bank",
    })
  }

  const onCheckMedioDePago = medioDePagoName => setMedioDePago({ ...medioDePago, account: medioDePagoName.id, accountName: medioDePagoName.label })
  const handleConfirmAccountValue = event => setConfirmAccountValue(event.target.value);
  const onCheckOwnerAccount = checked => setOwnerAccount(checked);

  const handleCbu = event => {
    const onlyNums = event.target.value.replace(/[^0-9]/g, '');
    setForm({ target: { name: 'cbuOrCvu', value: onlyNums } });
  }

  const handleUsdToWithdraw = event => {
    const onlyNums = event.target.value.replace(/[^0-9]/g, '');
    setForm({ target: { name: 'transferTotalUsd', value: onlyNums } });
  }

  const helperTextAvailable = totalRoyaltiesAndPayed.available < 10 ? "No puede retirar un monto menor a 10 USD" : "Ingresa la cantidad de Dólares (USD) a retirar."

  return (
    <Grid container justifyContent="center">

      <ReauthenticateDialog isOpen={openChangeCredentialsDialog} setIsOpen={setOpenChangeCredentialsDialog}
        textName={userData.nombre} />

      <Grid item xs={12} md={11} lg={10}>
        <CardTemplate>

          <CardHeader color="primary" style={{ background: fugaGreen }}>
            <Typography sx={cardTitleWhiteStyles}>Solicita tus Regalías</Typography>
            <p style={cardCategoryWhiteStyles}>Todos los datos que proporciones deben ser correctos, por favor revisa el formulario antes de enviarlo.</p>
            <p style={cardCategoryWhiteStyles}>Las transferencias se realizan durante los próximos 5 días hábiles.</p>
            <p style={cardCategoryWhiteStyles}>Si solicitas un cupón de crédito, el mismo te llegará por e-mail.</p>
          </CardHeader>

          <CardBody>
            <Grid container justifyContent="center">

              <Grid item xs={4} textAlign="center" paddingTop={2}>
                <Typography sx={moneyTextStyle} >
                  {`Regalías Totales: USD ${totalRoyaltiesAndPayed.loading
                    ? "..."
                    : formatThousandsPoint(formatPeriodComma(truncateFloat(totalRoyaltiesAndPayed.royalties, 2, '.')))}`}
                </Typography>
              </Grid>

              <Grid item xs={4} textAlign="center" paddingTop={2}>
                <Typography sx={moneyTextStyle} >
                  {`Regalías ya Solicitadas: USD ${totalRoyaltiesAndPayed.loading
                    ? "..."
                    : formatThousandsPoint(formatPeriodComma(truncateFloat(totalRoyaltiesAndPayed.payed, 2, '.')))}`}</Typography>
              </Grid>

              <Grid item xs={4} textAlign="center" paddingBottom={4} paddingTop={2}>
                <Typography sx={moneyTextStyle} >
                  {`Disponible a Retirar: USD ${formatThousandsPoint(formatPeriodComma(truncateFloat(totalRoyaltiesAndPayed.available, 2, '.')))}`}
                </Typography>
              </Grid>

              <Grid item xs={12} textAlign='center'>
                <TextFieldWithInfo
                  name="transferTotalUsd"
                  required
                  disabled={totalRoyaltiesAndPayed.available < 10}
                  error={(parseFloat(transferTotalUsd) > parseFloat(totalRoyaltiesAndPayed.available))}
                  label="Dolares a Retirar"
                  helperTextDown={helperTextAvailable}
                  value={transferTotalUsd}
                  onChange={handleUsdToWithdraw}
                  startAdormentObject={<InputAdornment position="start">USD</InputAdornment>}
                  validatorProps={{
                    restrictions: 'required|numeric',
                    message: "Ingresa un monto válido, debe ser menor que la cantidad de regalías disponibles.", validator: validator
                  }}
                />
              </Grid>

              <Grid item xs={12} textAlign="-moz-center" paddingTop={2} paddingBottom={2}>
                <Divider sx={{ borderWidth: '3px' }} />
              </Grid>

              <Grid item xs={8} textAlign="center" paddingBottom={2}>
                <Typography sx={subtitlesStyles} >{`Moneda de retiro: ${medioDePago.id === 'ars' ? "ARS" : "USD"}`}</Typography>
              </Grid>

              <Grid item xs={4} textAlign="center" paddingBottom={2}>
                <Typography sx={subtitlesStyles} >Medio de pago</Typography>
              </Grid>

              <Grid container>
                <Grid item xs={4} textAlign="-moz-center">
                  <ButtonBase>
                    <Card sx={cardStylePesos} raised={true}>
                      <CardMedia
                        onClick={() => onClickCurrency('pesos')}
                        sx={{ height: "100%" }}
                        component="img"
                        height={cardMediaWidth}
                        image={'/images/pesos.jpg'}
                        alt="pesos"
                      />
                    </Card>
                  </ButtonBase>
                </Grid>

                <Grid item xs={4} textAlign="-moz-center">
                  <ButtonBase>
                    <Card sx={cardStyleUsd} raised={true}>
                      <CardMedia
                        onClick={() => onClickCurrency('dolar')}
                        sx={{ height: "100%" }}
                        component="img"
                        height="200"
                        image={'/images/dolar.png'}
                        alt="dolares"
                      />
                    </Card>
                  </ButtonBase>

                </Grid>

                <Grid container item xs={4} sx={{ height: '100px' }}>
                  {mediosDePagoWithInfo.filter(mp => mp.currency === medioDePago.id).map(medioDePagoConInfo =>
                    <Grid item xs={12} textAlign="left">
                      <BasicCheckbox
                        label={medioDePagoConInfo.label}
                        onChecked={() => onCheckMedioDePago(medioDePagoConInfo)}
                        checked={medioDePago.account === medioDePagoConInfo.id}
                        color={fugaGreen}
                      />
                    </Grid>
                  )}

                </Grid>
              </Grid>

              {medioDePago.account !== 'cupon' &&
                <>
                  <Grid item xs={12} textAlign="-moz-center" paddingTop={3} paddingBottom={2}>
                    <Divider sx={{ borderWidth: '3px' }} />
                  </Grid>

                  <Grid item xs={12} textAlign="center" paddingBottom={2}>
                    <Typography sx={subtitlesStyles} >Datos de la Cuenta</Typography>
                  </Grid>
                </>
              }

              {medioDePago.id === "usd" &&
                <Grid container item >
                  <Grid item xs={6} paddingRight={2}>
                    <TextFieldWithInfo
                      fullWidth
                      name={medioDePago.id}
                      required
                      label={`Mail de ${medioDePago.accountName}`}
                      helperTextDown={`Ingresá el e-mail de tu cuenta de ${medioDePago.accountName} a donde recibirás tus regalías.`}
                      value={medioDePago.id === "paypalEmail" ? paypalEmail : payoneerEmail}
                      onChange={setForm}
                      validatorProps={{ restrictions: 'required|email', message: "Ingresa un email válido.", validator: validator }}
                    />
                  </Grid>
                  <Grid item xs={6} paddingLeft={2}>
                    <TextFieldWithInfo
                      fullWidth
                      required
                      error={confirmAccountValue !== (medioDePago.id === "paypal" ? paypalEmail : payoneerEmail)}
                      name="confirmEmail"
                      label={`Confirmar Mail de ${medioDePago.accountName}`}
                      value={confirmAccountValue}
                      helperTextDown="Confirma el Email."
                      onChange={handleConfirmAccountValue}
                      validatorProps={{ restrictions: 'required|email', message: "Ingresa un email válido", validator: validator }}
                    />
                  </Grid>
                </Grid>}

              {medioDePago.account === "bank" &&
                <>
                  <Grid item xs={6} textAlign="center">
                    <BasicCheckbox
                      label={"La cuenta me pertenece"}
                      onChecked={(event) => onCheckOwnerAccount(event.target.checked)}
                      checked={ownerAccount}
                      color={fugaGreen}
                    />
                  </Grid>
                  <Grid item xs={6} textAlign="center">
                    <BasicCheckbox
                      label={"La cuenta es de otra persona"}
                      onChecked={(event) => onCheckOwnerAccount(!event.target.checked)}
                      checked={!ownerAccount}
                      color={fugaGreen}
                    />
                  </Grid>

                  <Grid item xs={6} paddingRight={2}>
                    <TextFieldWithInfo
                      fullWidth
                      name="cbuOrCvu"
                      required
                      label="CBU/CVU"
                      helperTextDown="Ingresá el CBU/CVU de la Cuenta Bancaria donde enviaremos el dinero. Son 22 números."
                      value={cbuOrCvu}
                      onChange={handleCbu}
                      validatorProps={{
                        restrictions: 'required|numeric|min:22|max:22',
                        message: "Ingresa un CBU/CVU válido, debe tener 22 números.", validator: validator
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} paddingRight={2}>
                    <TextFieldWithInfo
                      fullWidth
                      error={confirmAccountValue !== cbuOrCvu}
                      name="cbuOrCvu"
                      required
                      helperTextDown={confirmAccountValue !== cbuOrCvu ? "Los CBU/CVU no coinciden." : ""}
                      label="Confirmar CBU/CVU"
                      value={confirmAccountValue}
                      onChange={handleConfirmAccountValue}
                      validatorProps={{
                        restrictions: 'required|numeric|min:22|max:22',
                        message: "Ingresa un CBU/CVU válido, debe tener 22 números.", validator: validator
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} textAlign="center" paddingBottom={2}>
                    <Typography sx={moneyTextStyle} >{`Cotización USD/ARS: 
                    ${formatThousandsPoint(formatPeriodComma(truncateFloat(usdToArsRate, 2, '.')))}`}</Typography>
                  </Grid>

                  <Grid item xs={12} textAlign="center" paddingBottom={2}>
                    <Typography sx={moneyTextStyle} >{`Retiro en Pesos: 
                    ${formatThousandsPoint(formatPeriodComma(truncateFloat(parseFloat(transferTotalUsd) * parseFloat(usdToArsRate), 2, '.')))}`}</Typography>
                  </Grid>
                </>
              }

              <Grid item xs={12} textAlign="-moz-center" paddingTop={3} paddingBottom={2}>
                <Divider sx={{ borderWidth: '3px' }} />
              </Grid>

              <Grid container item>
                <Grid item xs={12} textAlign="center" paddingBottom={2}>
                  <Typography sx={subtitlesStyles} >Datos del Solicitante</Typography>
                </Grid>
                <Grid item xs={6} paddingRight={2}>
                  <TextFieldWithInfo
                    fullWidth
                    name="userName"
                    required
                    label="Nombre del Solicitante"
                    helperTextDown="Nombre del dueño de la cuenta donde recibirá el dinero."
                    value={userName}
                    onChange={setForm}
                    validatorProps={{ restrictions: 'required|min:1|max:100', message: "Ingresa un nombre.", validator: validator }}
                  />
                </Grid>
                <Grid item xs={6} paddingLeft={2}>
                  <TextFieldWithInfo
                    fullWidth
                    required
                    name="userLastName"
                    label="Apellido"
                    value={userLastName}
                    helperTextDown="Apellido del dueño de la cuenta donde recibirá el dinero."
                    onChange={setForm}
                    validatorProps={{ restrictions: 'required|min:1|max:100', message: "Ingresa un apellido.", validator: validator }}
                  />
                </Grid>
              </Grid>

              <Grid container item>
                <Grid item xs={6} paddingRight={2}>
                  <TextFieldWithInfo
                    fullWidth
                    required
                    name="telefono"
                    label="Celular de Contacto"
                    value={telefono}
                    placeholder="+549115771715"
                    helperTextDown="+549 + (código de área) + N° celular"
                    onChange={setForm}
                    validatorProps={{ restrictions: 'required|min:1|max:20', message: "Ingresa un número de celular válido.", validator: validator }}
                  />
                </Grid>
                <Grid item xs={6} paddingLeft={2}>
                  <TextFieldWithInfo
                    fullWidth
                    required
                    name="cuit"
                    label="CUIT"
                    value={userCuit}
                    placeholder="20-12345678-0"
                    helperTextDown={cuitHelperLink}
                    onChange={setForm}
                    validatorProps={{ restrictions: 'required|min:1|max:20', message: "Ingresa un número de CUIT válido.", validator: validator }}
                  />
                </Grid>
              </Grid>

            </Grid>
          </CardBody>

          <CardFooter>
            <Grid container item xs={12} justifyContent="center" spacing={2}>
              <ProgressButton
                textButton={buttonText}
                loading={openLoader}
                buttonState={editState.toLowerCase()}
                onClickHandler={handleSubmit}
                disabled
                noneIcon={<Paid />}
                color="secondary"
                backgroundColor={fugaGreen}
                noFab={false} />
            </Grid>
          </CardFooter>

        </CardTemplate>
      </Grid>

    </Grid>
  );
}

export default PayoutForm;

const cardCategoryWhiteStyles = {
  color: "rgba(255,255,255,.82)",
  margin: "0",
  fontSize: "14px",
  fontWeight: "400",
  marginTop: "0",
  marginBottom: "0"
}

const subtitlesStyles = { fontSize: "30px", fontWeight: "bold", color: fugaGreen };

const moneyTextStyle = { fontSize: "20px", fontWeight: 400, textDecorationLine: 'underline' };

const cardTitleWhiteStyles = {
  color: "rgba(255,255,255,255)",
  marginTop: "0px",
  minHeight: "auto",
  fontWeight: "300px",
  fontSize: "40px",
  fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  marginBottom: "3px",
  textDecoration: "none"
}