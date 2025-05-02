import React from 'react'
import { useParams } from 'react-router-dom';

const AllFiles = () => {
    const userName = useParams();
  return (
    <div>{userName}</div>
  )
}

export default AllFiles