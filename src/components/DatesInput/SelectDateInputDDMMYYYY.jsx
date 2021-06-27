import React from "react";
// @material-ui/core components
import { MenuItem, TextField, Grid } from "@material-ui/core";
import Danger from 'components/Typography/Danger.js';

let errorFormat = (message) => (
  <Danger color="error" variant="h6">{message}</Danger>
)

let actualDate = new Date();

const daysRange = Array.from({ length: 30 }, (_, i) => i + 1);
const monthsRange = Array.from({ length: 12 }, (_, i) => i + 1);
const yearsRange = Array.from({ length: 50 }, (_, i) => i + (actualDate.getFullYear() - 50) + 1).reverse();

const SelectDateInputDDMMYYYY = ({ dayValue, monthValue, yearValue, setDayOfMonth, setMonth, setYear, simpleValidator }) => {
  return (
    <Grid container spacing={2} item xs={12} justify="center">
      <Grid item xs={6} sm={2}>
        <TextField
          name='monthDay'
          fullWidth
          id='monthDay'
          variant="outlined"
          required
          margin="normal"
          select
          label='Día'
          value={dayValue}
          onChange={setDayOfMonth}
        >
          {daysRange.map(day => (
            <MenuItem key={day} value={day}>
              {day}
            </MenuItem>
          ))}
          {simpleValidator.current.message('monthDay', dayValue, 'required', {
            className: 'text-danger',
            messages: { default: "Debes seleccionar el Día del Lanzamiento." },
            element: (message) => errorFormat(message)
          })}
        </TextField>
      </Grid>

      <Grid item xs={6} sm={2}>
        <TextField
          name='month'
          fullWidth
          id='month'
          variant="outlined"
          required
          margin="normal"
          select
          label='Mes'
          value={monthValue}
          onChange={setMonth}
        >
          {monthsRange.map(month => (
            <MenuItem key={month} value={month}>
              {month}
            </MenuItem>
          ))}
          {simpleValidator.current.message('month', monthValue, 'required', {
            className: 'text-danger',
            messages: { default: "Debes seleccionar el Mes del Lanzamiento." },
            element: (message) => errorFormat(message)
          })}
        </TextField>
      </Grid>

      <Grid item xs={6} sm={2}>
        <TextField
          name='year'
          fullWidth
          id='year'
          variant="outlined"
          required
          margin="normal"
          select
          label='Año'
          value={yearValue}
          onChange={setYear}
        >
          {yearsRange.map(year => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
          {simpleValidator.current.message('year', yearValue, 'required', {
            className: 'text-danger',
            messages: { default: "Debes seleccionar el Año del Lanzamiento." },
            element: (message) => errorFormat(message)
          })}
        </TextField>
      </Grid>
    </Grid>
  );
}

export default SelectDateInputDDMMYYYY;
