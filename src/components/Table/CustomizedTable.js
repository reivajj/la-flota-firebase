import React from "react";
import { styled } from '@mui/material/styles';
import {
  Table, TableBody, TableCell, TableContainer, TablePagination,
  TableHead, TableRow, Paper, Typography, Tooltip
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import TablePaginationActions from './TablePaginationActions';
import { fugaGreen } from "variables/colors";

const StyledTableCell = styled(TableCell)(({ theme, rowsBodyHeight }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: fugaGreen,
    color: theme.palette.common.white,
    padding: '8px',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '8px',
    height: rowsBodyHeight,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const CustomizedTable = (props) => {
  const { rows, headers, headersHeight, columnsWidth, totalCount, handleChangePage, page,
     handleChangeRowsPerPage, rowsPerPage, maxWidthText, maxLengthChars, rowsHeight, rowsAlign } = props;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table sx={{ minWidth: 700 }} stickyHeader aria-label="customized table">
          <TableHead sx={{ height: headersHeight }}>
            <TableRow key='headers'>
              {headers.map((headerName, index) => (
                <StyledTableCell sx={{ width: columnsWidth[index] }} align={rowsAlign}>{headerName}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(row => (
                <StyledTableRow key={row.id}>
                  {Object.values(row).map((rowValue, index) => (
                    <StyledTableCell rowsBodyHeight={rowsHeight} align={rowsAlign}>
                      {rowValue && rowValue.length > maxLengthChars
                        ? <Tooltip key={index} title={rowValue} >
                          <Typography sx={{ maxWidth: maxWidthText }} noWrap>{rowValue}</Typography>
                        </Tooltip>
                        : <Typography sx={{ maxWidth: maxWidthText }} noWrap>{rowValue}</Typography>
                      }
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalCount !== 0 && <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        colSpan={3}
        count={totalCount}
        component="div"
        rowsPerPage={rowsPerPage}
        page={page}
        SelectProps={{
          inputProps: { 'aria-label': 'filas por página', },
          native: true,
        }}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
      />}
    </Paper>

  );
}

export default CustomizedTable;