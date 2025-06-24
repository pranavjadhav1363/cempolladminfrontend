import React from 'react'

const Frommessage = ({msg,color}) => {
  return (
  <div className={`mb-4 text-${color}-500 text-center`}>{msg}</div>
  )
}

export default Frommessage