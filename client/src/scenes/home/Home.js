import React from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import Navbar from '../navbar/Navbar';
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