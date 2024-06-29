import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


// Importing Pages
import Login from './Login';
import Home from './Home';
import AddUser from './Admin/AddUser';
import AllUsers from './Admin/AllUsers';
import AddEntry from './Admin/AddEntry';
import AllEntries from './AllEntries';
import SingleEntry from './SingleEntry';
import FileUpload from './UploadData';
import EditableDropdown from './Admin/ManageData';
import { getUserDetails } from '../utils/Session';

const PrivateRoute = ({ element }) => {
  const accessToken = localStorage.getItem('gstportal');
  return accessToken ? element : <Navigate to="/login" replace />;
};

const AdminRoute = async ({ element }) => {
  const accessToken = localStorage.getItem('gstportal');
  const user = await getUserDetails();
  console.log(user.user);
  if (user.user.isAdmin) {
    return element;
  }
  return <Navigate to="/login" replace />;
};

const MainPage = () => {
  return (
    <div style={{ height: 'calc(100vh - 74px)' }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute element={<PrivateRoute element={<AllEntries />}/>}/>} />
        <Route path="/admin/add-user" element={<PrivateRoute element={<AddUser />}/>} />
        <Route path="/admin/users" element={<PrivateRoute element={<AllUsers />}/>} />
        <Route path="/admin/add-entry" element={<PrivateRoute element={<AddEntry />}/>} />
        <Route path="/entries/all" element={<PrivateRoute element={<AllEntries />}/>} />
        <Route path="/entry/:id" element={<PrivateRoute element={<SingleEntry />}/>} />
        <Route path="/admin/upload" element={<PrivateRoute element={<FileUpload />}/>} />
        <Route path="/admin/edit-data" element={<PrivateRoute element={<EditableDropdown />}/>} />

        

      </Routes>
    </div>
  )
}

export default MainPage
