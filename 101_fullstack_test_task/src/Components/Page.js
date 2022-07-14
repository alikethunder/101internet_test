import React, { useState } from "react";
import { useQuery } from "react-apollo";
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { PROVIDERS_QUERY } from "../Queries/providersQuery";
import { TARIFFS_QUERY } from "../Queries/tariffsQuery";

import api from '../api';

const REGION_URL = "moskva";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  menuPaper: {
    maxHeight: 500,
  },
  topButtons: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  blue: {
    backgroundColor: 'rgba(3, 252, 240, 0.3)'
  },
  green: {
    backgroundColor: 'rgba(23, 252, 3, 0.3)'
  }
}));

function Page() {
  const classes = useStyles();

  const [currentProvider, setCurrentProvider] = useState({});
  const [sortedTariffs, setSortedTariffs] = useState([]);

  const providers = useQuery(PROVIDERS_QUERY, {
    variables: {
      filter: `region.url=${REGION_URL}`,
      limit: 50,
      offset: 0,
      sort: "name",
    },
    notifyOnNetworkStatusChange: true,
  });
  const providersData = providers?.data?.providers?.data || [];
  //console.log(providersData)

  const tariffs = useQuery(TARIFFS_QUERY, {
    skip: !currentProvider?.id,
    variables: {
      filter: `region.url=${REGION_URL}&provider.url_name=${currentProvider.url_name}`,
      limit: 100,
      offset: 0,
      sort: "name",
    },
    notifyOnNetworkStatusChange: true,
  });
  const tariffsData = tariffs?.data?.tariffs?.data || [];


  const handleChange = (event) => {
    const foundProvider = providersData.find(
      (x) => x.id === +event.target.value
    );
    if (foundProvider) {
      setCurrentProvider(foundProvider);
      setSortedTariffs([])
    }
  };

  const saveToDB = async () => {

    //console.log(tariffsData)

    await api.insertTariffs(tariffsData).then(res => {
      //console.log('insert tariffs console.log', res);
    })
  }

  const getFromDB = async () => {


    //console.log(currentProvider, currentProvider.id);

    await api.getTariffs(currentProvider.id).then(res => {
      //console.log('get tariffs console.log', res);
      setSortedTariffs(res.data.data.sort((a,b)=> b.fields - a.fields));
    })

  }

  return (
    <Container>
      <Typography variant="h3" component="h2">
        Таблица сравнения
      </Typography>
      <Container className={classes.topButtons}>
        <Button variant="contained" onClick={saveToDB} >Сохранить в БД</Button>
        <Button variant="contained" onClick={getFromDB} >Получить отсортированное из БД</Button>
      </Container>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="provider-select-label">Провайдер</InputLabel>
        <Select
          labelId="provider-select-label"
          id="provider-select"
          value={currentProvider?.id || 0}
          onChange={handleChange}
          label="Provider"
          MenuProps={{ classes: { paper: classes.menuPaper } }}
        >
          <MenuItem value="0">
            <em>None</em>
          </MenuItem>
          {providersData
            .filter((x) => x.info.cnt_tariffs > 0)
            .map((provider) => (
              <MenuItem key={provider.id} value={provider.id}>
                {provider.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        {
          sortedTariffs.length ?
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Название тарифа</TableCell>
                  <TableCell>Цена</TableCell>
                  <TableCell>Интернет</TableCell>
                  <TableCell>Каналы</TableCell>
                  <TableCell>Каналы hd</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedTariffs.map((tariff) => (
                  <TableRow key={tariff.tariffId}>
                    <TableCell component="th" scope="row">
                      {tariff.name}
                    </TableCell>
                    <TableCell component="th" scope="row" className={classes[tariff.price.color]} >
                      {tariff.price.value}
                    </TableCell>
                    <TableCell component="th" scope="row" className={classes[tariff.internet.color]} >
                      {tariff.internet.value}
                    </TableCell>
                    <TableCell component="th" scope="row" className={classes[tariff.tv_channels.color]} >
                      {tariff.tv_channels.value}
                    </TableCell>
                    <TableCell component="th" scope="row" className={classes[tariff.tv_channels_hd.color]} >
                      {tariff.tv_channels_hd.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            :
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Название тарифа</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tariffsData.map((tariff) => (
                  <TableRow key={tariff.id}>
                    <TableCell component="th" scope="row">
                      {tariff.name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        }
      </TableContainer>
    </Container >
  );
}

export default Page;
