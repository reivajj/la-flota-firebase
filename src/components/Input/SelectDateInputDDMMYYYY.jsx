import React from "react";
// @mui/material components
import { MenuItem, TextField, Grid } from "@mui/material";
import { errorFormat } from 'utils';
import { getArrayYears } from '../../utils/timeRelated.utils';

const SelectDateInputDDMMYYYY = ({ type, dayValue, monthValue, yearValue, setDayOfMonth, setMonth, setYear, simpleValidator }) => {
  let actualDate = new Date();
  let actualYear = actualDate.getFullYear();
  const daysRange = Array.from({ length: 30 }, (_, i) => i + 1);
  const monthsRange = Array.from({ length: 12 }, (_, i) => i + 1);
  let yearsRange = getArrayYears(actualYear, actualYear + 1);

  if (type === "old-release-date") yearsRange = getArrayYears(1950, actualYear)

  return (
    <Grid container spacing={2} item xs={12} justifyContent="center">
      <Grid item xs={6} sm={3}>
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
        </TextField>
        {simpleValidator && simpleValidator.current.message('monthDay', dayValue, 'required', {
          className: 'text-danger',
          messages: { default: "Debes seleccionar el Día del Lanzamiento." },
          element: (message) => errorFormat(message)
        })}
      </Grid>

      <Grid item xs={6} sm={3}>
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
        </TextField>
        {simpleValidator && simpleValidator.current.message('month', monthValue, 'required', {
          className: 'text-danger',
          messages: { default: "Debes seleccionar el Mes del Lanzamiento." },
          element: (message) => errorFormat(message)
        })}
      </Grid>

      <Grid item xs={6} sm={3}>
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
        </TextField>
        {simpleValidator && simpleValidator.current.message('year', yearValue, 'required', {
          className: 'text-danger',
          messages: { default: "Debes seleccionar el Año del Lanzamiento." },
          element: (message) => errorFormat(message)
        })}
      </Grid>
    </Grid>
  );
}

export default SelectDateInputDDMMYYYY;
