import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableHead from '@mui/material/TableHead';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import AddShoppingCartSharpIcon from '@mui/icons-material/AddShoppingCartSharp';
import Tooltip from '@mui/material/Tooltip';
import { cartStore } from '../Stores/cartStore';
import { observer } from 'mobx-react';
import { useEffect, useState } from 'react';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary,
        color: theme.palette.common.text,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === 'rtl' ? (
                    <LastPageIcon />
                ) : (
                    <FirstPageIcon />
                )}
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowRight />
                ) : (
                    <KeyboardArrowLeft />
                )}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === 'rtl' ? (
                    <KeyboardArrowLeft />
                ) : (
                    <KeyboardArrowRight />
                )}
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="last page"
            >
                {theme.direction === 'rtl' ? (
                    <FirstPageIcon />
                ) : (
                    <LastPageIcon />
                )}
            </IconButton>
        </Box>
    );
}

TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
};

const rows = [
    { name: 'Cupcake', calories: 305, fat: 4 },
    { name: 'Donut', calories: 452, fat: 25 },
    { name: 'Eclair', calories: 262, fat: 16 },
    { name: 'Yoghurt', calories: 159, fat: 4 },
    { name: 'Gingerbread', calories: 356, fat: 16 },
    { name: 'Honeycomb', calories: 408, fat: 3 },
    { name: 'Ice cream sandwich', calories: 237, fat: 9 },
    { name: 'Jelly Bean', calories: 375, fat: 0 },
    { name: 'KitKat', calories: 518, fat: 26 },
    { name: 'Lollipop', calories: 392, fat: 0 },
    { name: 'Marshmallow', calories: 318, fat: 0 },
    { name: 'Nougat', calories: 360, fat: 19.0 },
    { name: 'Oreo', calories: 437, fat: 18.0 },
    { name: 'KitKat 2', calories: 518, fat: 26 },
    { name: 'Lollipop 2', calories: 392, fat: 0 },
    { name: 'Marshmallow 2', calories: 318, fat: 0 },
    { name: 'Nougat 2', calories: 360, fat: 19.0 },
    { name: 'Oreo 2', calories: 437, fat: 18.0 },
    { name: 'KitKat 3', calories: 518, fat: 26 },
    { name: 'Lollipop 3', calories: 392, fat: 0 },
    { name: 'Marshmallow 3', calories: 318, fat: 0 },
    { name: 'Nougat 3', calories: 360, fat: 19.0 },
    { name: 'Oreo 3', calories: 437, fat: 18.0 },
].sort((a, b) => (a.calories < b.calories ? -1 : 1));


const ProductList = observer(() => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    // Avoid a layout jump when reaching the last page with empty rows.
    // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    useEffect(() => {
        const updateRowsPerPage = () => {
            const rowHeight = 72; // Approximate row height in px
            const footerHeight = 80; // Approximate TableFooter height in px
            const headerHeight = 240; // Approximate TableHead height in px
            const availableHeight =
                window.innerHeight - headerHeight - footerHeight;
            const newRowsPerPage = Math.floor(availableHeight / rowHeight);
            setRowsPerPage(newRowsPerPage - 1);
        };

        // Initial calculation
        updateRowsPerPage();

        // Update on window resize
        window.addEventListener('resize', updateRowsPerPage);
        return () => {
            window.removeEventListener('resize', updateRowsPerPage);
        };
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const StyledTableHead = styled(TableHead)(({ theme }) => ({
        backgroundColor: theme.palette.primary.main,
        '& th': {
            color: theme.palette.common.white,
        },
    }));

    return (
        <Box style={{ height: '100%', width: '100%'}}>
            <TableContainer component={Paper}>
                <Table
                    sx={{ minWidth: 500 }}
                    aria-label="custom pagination table"
                >
                    <StyledTableHead>
                        <TableRow>
                            <StyledTableCell>Produto</StyledTableCell>
                            <StyledTableCell align="right">
                                Calorias
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                Quantidade
                            </StyledTableCell>
                            <StyledTableCell align="right"></StyledTableCell>
                        </TableRow>
                    </StyledTableHead>
                    <TableBody>
                        {(rowsPerPage > 0
                            ? rows.slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                              )
                            : rows
                        ).map((row) => (
                            <TableRow key={row.name}>
                                <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {row.calories}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    {row.fat}
                                </TableCell>
                                <TableCell style={{ width: 160 }} align="right">
                                    <Tooltip title="Adicionar ao carrinho">
                                        <IconButton
                                            color="textSecondary"
                                            onClick={() =>
                                                cartStore.addItem(row.name, 1)
                                            }
                                        >
                                            <AddShoppingCartSharpIcon />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                        {/* {emptyRows > 0 && (
                        <TableRow style={{ height: (2.3 * (emptyRows + 1)) + 'rem' }}>
                            <TableCell colSpan={6} />
                        </TableRow>
                    )} */}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[
                                    rowsPerPage,
                                    // 16,
                                    // 32,
                                    // { label: 'All', value: -1 },
                                ]}
                                colSpan={4}
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                labelRowsPerPage="Produtos por página"
                                slotProps={{
                                    select: {
                                        inputProps: {
                                            'aria-label': 'Produtos por página',
                                        },
                                        native: true,
                                    },
                                }}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Box>
    );
});

export default ProductList;
