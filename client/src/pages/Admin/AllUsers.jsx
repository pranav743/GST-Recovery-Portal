import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import uri from '../../utils/URL';
import { Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { successMessage, errorMessage } from '../../components/Toast';

const slugify = (text) => {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')    // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove non-word characters
        .replace(/--+/g, '-')    // Replace multiple - with single -
        .replace(/^-+/, '')      // Trim - from start of text
        .replace(/-+$/, '');     // Trim - from end of text
};

const deleteUser = async (username) => {
    
    try {
        console.log("Deleting "+ username);
        const res = await axios.post(uri + "/delete-user", {username});
        if (res.data.success) {
            successMessage(res.data.msg);
        } else{
            errorMessage(res.data.msg);
        }

    } catch (error) {
        errorMessage(error.response.data.msg);
    }
}

const columns = [
    { field: 'id', headerName: 'Sr. no.', width: 90 },
    {
        field: 'username',
        headerName: 'Username',
        width: 150,
        editable: false,
    },
    {
        field: 'password',
        headerName: 'Password',
        width: 150,
        editable: false,
    },
    {
        field: 'updation',
        headerName: 'Update Password',
        editable: false,
        width: 180,
        renderCell: (params) => (
          <Button variant="contained" color="warning" 
        //   onClick={() => deleteUser(params.row.username)}
            sx={{boxShadow: 'none', opacity: 0.8}}
          >
            Change Password
          </Button>
        ),
      },
    {
        field: 'actions',
        headerName: 'Actions',
        editable: false,
        width: 150,
        renderCell: (params) => (
          <Button variant="contained" color="error" 
            onClick={() => deleteUser(params.row.username)}
            sx={{boxShadow: 'none', opacity: 0.8}}
          >
            Delete
          </Button>
        ),
      },
    // {
    //     field: 'active',
    //     headerName: 'Active ?',
    //     width: 150,
    //     editable: true,
    // },
    // {
    //     field: 'age',
    //     headerName: 'Age',
    //     type: 'number',
    //     width: 110,
    //     editable: true,
    // },
    // {
    //     field: 'fullName',
    //     headerName: 'Full name',
    //     description: 'This column has a value getter and is not sortable.',
    //     sortable: false,
    //     width: 160,
    //     valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
    // },
];

const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 14 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 31 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 31 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 11 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

export default function AllUsers() {

    const { isError, isLoading, data } = useQuery({
        queryKey: ['/students/all'],
        retryDelay: 10000,
        retry: false,
        queryFn: async () => {
            const res = await axios.get(uri + "/users/all");
            const users = res.data.data.map((user, index) => {
                return { ...user, id: index + 1 }; 
            });
            console.log(users);
            return users;
        }
    })

    if (isLoading){
        return (
            <h1>Loading</h1>
        )
    } else if (isError){
        return (
            <h1>Error Occurred</h1>
        )
    }
    

    return (
        <Box sx={{ height: 400, width: '100%' }}>
            <ToastContainer/>
            <DataGrid
                rows={data}
                columns={columns}
                // initialState={{
                //     pagination: {
                //         paginationModel: {
                //             pageSize: 5,
                //         },
                //     },
                // }}
                pageSizeOptions={[20]}
                // checkboxSelection
                disableRowSelectionOnClick
                autoHeight
            />
        </Box>
    );
}