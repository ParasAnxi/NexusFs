import { Box, Typography } from '@mui/material'
import React from 'react'
const names = [
    {
        id:"1",
        name:"paras"
    },
    {
        id:"2",
        name:"hana"
    }
];
const Folders = () => {
  return (
    <>
    <Box>
        <Box>
            {names.map((name)=>(
                <Typography key = {name.id}>{name.name}</Typography>
            ))}
        </Box>
    </Box>
    </>
  )
}

export default Folders