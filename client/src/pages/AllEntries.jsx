import * as React from 'react';
import Box from '@mui/material/Box';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import uri from '../utils/URL';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { successMessage, errorMessage } from '../components/Toast';
import { Card, CardContent, Typography } from '@mui/material';
import formatDate from '../utils/format';
import { Link, useNavigate } from 'react-router-dom';
import slugify from 'slugify';
import SearchIcon from '@mui/icons-material/Search';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { Select, MenuItem, FormControl, InputLabel, Button, TextField } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import { styled, alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import { getUserDetails } from '../utils/Session';
import DownloadIcon from '@mui/icons-material/Download';
import ExportToExcelButton from './Admin/ExportExcel';


const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));


function sortByFieldAsc(array, fieldName) {
    return array.sort((a, b) => {
        if (a[fieldName] < b[fieldName]) {
            return -1;
        }
        if (a[fieldName] > b[fieldName]) {
            return 1;
        }
        return 0;
    });
}

function sortByFieldDec(array, fieldName) {
    return array.sort((a, b) => {
        if (a[fieldName] < b[fieldName]) {
            return 1;
        }
        if (a[fieldName] > b[fieldName]) {
            return -1;
        }
        return 0;
    });
}

const Divider = () => <div style={{ height: '1px', backgroundColor: "#bbb", margin: '10px 20px' }}></div>

const EntryCard = ({ info }) => {
    const navigate = useNavigate();
    return (
        <div style={{ height: '550px', width: '350px', display: 'flex', flexDirection: 'column', margin: '15px', padding: 15, borderRadius: '10px', backgroundColor: '#eee' }}>

            <p style={{ textAlign: 'center', margin: 0 }}>{info.demandID}</p>
            <Divider />
            <p style={{ textAlign: 'right', margin: 0, fontStyle: 'italic' }}>{formatDate(info.dateOfDemand)}</p>
            <p style={{ textAlign: 'center', margin: 0, marginTop: '20px', height: 'auto', fontWeight: 'bold' }}>{info.tradeNameOfTaxpayer}</p>
            <p style={{ marginLeft: '30px', textAlign: 'left', margin: 0, marginTop: '10px', height: 'auto', fontSize: '10px' }}>Legal Name:</p>
            <p style={{ marginLeft: '30px', textAlign: 'left', margin: 0, marginTop: '2px', height: 'auto' }}>{info.legalNameOfTaxpayer}</p>

            <div style={{ margin: 5, marginTop: '15px', height: '200px', padding: '10px', backgroundColor: '#69b9ff', borderRadius: '5px' }}>
                <p style={{ margin: 0 }}>Tax Period: {info.taxPeriod}</p>
                <p style={{ margin: 0 }}>FYI: {info.FYOfTaxPeriod}</p>
                <p style={{ margin: 0 }}>Section: {info.section}</p>
                <p style={{ margin: 0, backgroundColor: '#ddd', padding: '5px', borderRadius: '10px', marginTop: '10px' }}>{info.OSPendingDemandTotal} (Pending TOT)</p>
                <p style={{ margin: 0, backgroundColor: '#ddd', padding: '5px', borderRadius: '10px', marginTop: '10px' }}>{info.demandAsPerOrderTotal} (Demand TOT)</p>

            </div>
            <p style={{ textAlign: 'center', margin: 0, marginTop: '2px', height: 'auto' }}>{info.GSTDesk}</p>

            <div onClick={() => { navigate(`/entry/${slugify(info.demandID)}`) }} style={{ margin: 5, marginTop: '15px', height: '45px', padding: '10px', backgroundColor: '#45ff86', borderRadius: '5px', textAlign: 'center', cursor: 'pointer' }}>Details</div>
        </div>
    );
};


const EntryRow = ({ info }) => {
    const navigate = useNavigate();
    return (
        <div onClick={() => { navigate(`/entry/${slugify(info.demandID)}`) }} style={{ minHeight: '50px', width: '100%', display: 'flex', margin: '1px 0', padding: 15, borderRadius: '5px', backgroundColor: '#eee' }}>

            <div style={{ width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>{info.tradeNameOfTaxpayer}</div>
            <div style={{ width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#888', minWidth: '200px' }}>{info.GSTIN}</div>
            <div style={{ width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{info.GSTDesk}</div>
            <div style={{ width: '25%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{info.FYOfTaxPeriod}</div>


        </div>
    );
};




export default function AllEntries() {
    const navigate = useNavigate();

    const [data, setData] = React.useState([]);
    const [isAsc, setIsAsc] = React.useState(true);
    const [selectedOption, setSelectedOption] = React.useState('tradeNameOfTaxpayer');
    const [searchString, setSearchString] = React.useState('');
    const [user, setUser] = React.useState({username: '', isAdmin: true, name: null})

    const { isError, isLoading, data: demandData } = useQuery({
        queryKey: ['/entries/all'],
        retryDelay: 10000,
        retry: false,
        queryFn: async () => {
            const curuser = await getUserDetails();
            // console.log(curuser.user);
            setUser(curuser.user);
            var res = {data: []}
            if (curuser.user.isAdmin){
                res = await axios.get(uri + "/entries/all");
            }
            else{
                // console.log(uri + `/entries/all?GSTDesk=${curuser.user.username}`);
                res = await axios.get(uri + `/entries/all?GSTDesk=${curuser.user.username}`);
            }
            
            console.log(res.data);
            setData(res.data)
            return res.data;
        }
    });

    
    const sortIn = () => {
        if (isAsc) {
            var temp = sortByFieldDec(data.data, selectedOption);
            setData({ ...data, data: temp });
            setIsAsc((current) => !current);
        }
        else {
            var temp = sortByFieldAsc(data.data, selectedOption);
            setData({ ...data, data: temp });
            setIsAsc((current) => !current);
        }

    }

    const SortIndicator = () => {

        return (
            isAsc ? <ArrowUpward onClick={sortIn} style={{ cursor: 'pointer' }} /> : <ArrowDownward onClick={sortIn} style={{ cursor: 'pointer' }} />
        )
    }


    if (isLoading) {
        return (
            <h1>Loading</h1>
        )
    } else if (isError) {
        return (
            <h1>Error Occurred</h1>
        )
    }

    const handleSearchChange = (event) => {
        const searchText = event.toLowerCase();
        setSearchString(searchText);
        // console.log("Search : " + searchText)
    
        if (searchText === '') {
          setData(demandData);
        } else {
            // console.log(demandData.data)
            setData({
                ...data,
                data: demandData.data.filter((item) =>
                  item[selectedOption].toLowerCase().includes(searchText)
                )
              });
              
        }
      };

    return (
        <>
            <div style={{ height: '20px' }}></div>
            {/* <p style={{ height: '10px', marginLeft: '2px' }}> Sort:</p> */}

            <Toolbar>

                <FormControl sx={{ width: '200px', height: '35px', marginBottom: '0px', flexGrow: 1, display: { xs: 'none', sm: 'block' } }} >
                    {/* <InputLabel>Sort Using</InputLabel> */}
                    <Select sx={{ height: '35px' }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedOption}
                        onChange={(event) => {
                            setSelectedOption(event.target.value);
                            const temp = sortByFieldAsc(data.data, event.target.value);
                            setData({ ...data, data: temp });
                        }}
                    >
                        <MenuItem value="">
                        </MenuItem>
                        <MenuItem value={'tradeNameOfTaxpayer'}>Trade Name</MenuItem>
                        <MenuItem value={'GSTIN'}>GSTIN</MenuItem>
                        <MenuItem value={'GSTDesk'}>GST Desk</MenuItem>
                        <MenuItem value={'FYOfTaxPeriod'}>Year</MenuItem>
                    </Select>
                </FormControl>
                <ExportToExcelButton excelData={demandData.data} desk={user.username} isAdmin={user.isAdmin}/>
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                        placeholder="Search…"
                        inputProps={{ 'aria-label': 'search' }}
                        value={searchString}
                        onChange={(event) => {
                            handleSearchChange(event.target.value);
                        }}
                    />
                </Search>
            </Toolbar>

            <div style={{ minHeight: '60px', width: '100%', display: 'flex', margin: '1px', padding: 15, borderRadius: '5px 5px 0 0', backgroundColor: '#ccc' }}>

                <div style={{ width: '33%', display: 'flex', alignItems: 'center', justifyContent: 'left' }}>Trade Name {selectedOption === 'tradeNameOfTaxpayer' && <SortIndicator onClick={sortIn} />}</div>
                <div style={{ width: '33%', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '200px' }}>GSTIN {selectedOption === 'GSTIN' && <SortIndicator onClick={sortIn} />} </div>
                <div style={{ width: '33%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Desk {selectedOption === 'GSTDesk' && <SortIndicator onClick={sortIn} />}</div>
                <div style={{ width: '33%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Year {selectedOption === 'FYOfTaxPeriod' && <SortIndicator onClick={sortIn} />}</div>


            </div>
            <div style={{ height: '100%', width: '100%', justifyContent: 'center', overflowY: 'auto', backgroundColor: '#ddd' }}>

                {
                    data && data.data && data.data.map((info, index) => (
                        <EntryRow key={index} info={info} />
                    ))

                }

            </div>
        </>
    );
}