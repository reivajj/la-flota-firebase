import * as React from 'react';
import { FormGroup, Grid } from '@mui/material';
import BasicCheckbox from './BasicCheckbox';
import CheckboxWithInfo from './CheckboxWithInfo';

const CheckboxGroup = ({ allInfo, onChange, rowsLimit }) => {
  let gridSize = 12 / parseInt(allInfo.length / rowsLimit);

  return (
    <Grid container>
      <Grid item xs={gridSize}>
        <FormGroup>
          {allInfo.slice(0, 25).map((dspInfo, index) =>
            dspInfo.checkBoxHelper === ""
              ? <BasicCheckbox key={index} checked={dspInfo.checked} onChecked={() => onChange(dspInfo)} label={dspInfo.label} />
              : <CheckboxWithInfo key={index} checked={dspInfo.checked} onChecked={() => onChange(dspInfo)} label={dspInfo.label}
                checkBoxHelper={dspInfo.checkBoxHelper} onClickInfo={dspInfo.onClickInfo} labelGridSize={4} labelTextAlign="start" />
          )}
        </FormGroup>
      </Grid>

      <Grid item xs={gridSize}>
        <FormGroup>
          {allInfo.slice(25, 50).map((dspInfo, index) =>
            <BasicCheckbox key={index} checked={dspInfo.checked} onChecked={() => onChange(dspInfo)} label={dspInfo.label} />
          )}
        </FormGroup>
      </Grid>

    </Grid>

  );
}

export default CheckboxGroup;
