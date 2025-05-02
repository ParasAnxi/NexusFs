import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { setLogOut } from '../../features/userSlice';
import Navbar from '../navbar/Navbar';
import Folders from '../folders/Folders';
import { Box } from '@mui/material';
import Messages from '../message/Messages';

const Home = () => {
    const Navigate = useNavigate();
    const dispatch = useDispatch();
  return (<>
    <Box>
        <Navbar/>
        <Messages/>
    </Box>
  </>
  )
}

export default Home