import React from 'react'
import { useNavigate } from 'react-router'

const NotFound = () => {
    const navigate=useNavigate()
  return (
    <div>
        <button onClick={()=> navigate(-1)}>Go Back</button>
    </div>
  )
}

export default NotFound