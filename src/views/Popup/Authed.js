import React from 'react'

export default function({ user,logout }) {
  return (
    <div className="text-center w-100">
      <h3>Authed</h3>
      <p>
        Address: <strong>{user.address}</strong>
      </p>
      <p>
        Token: <strong>{user.token}</strong>
      </p>

      <button 
        className="w-100 button-primary" 
        onClick={logout}
      >
        LOGOUT
      </button>
    </div>
  )
}