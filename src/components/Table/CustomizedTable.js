import React from "react";
import { styled } from '@mui/material/styles';
import {
  Table, TableBody, TableCell, TableContainer, TablePagination,
  TableHead, TableRow, Paper
} from '@mui/material';
import { tableCellClasses } from '@mui/material/TableCell';
import TablePaginationActions from './TablePaginationActions';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
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
  const { rows, headers, totalCount, handleChangePage, page, handleChangeRowsPerPage, rowsPerPage } = props;

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table sx={{ minWidth: 700 }} stickyHeader aria-label="customized table">
          <TableHead>
            <TableRow key='headers'>
              {headers.map(headerName => (
                <StyledTableCell align="left">{headerName}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(row => (
                <StyledTableRow key={row.id}>
                  {Object.values(row).map(rowValue => (
                    <StyledTableCell align="left">{rowValue}</StyledTableCell>
                  ))}
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
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
      />
    </Paper>

  );
}

export default CustomizedTable;