import React from 'react'
import './styles/Header.css'

export default function() {
  return (
    <header className="Header-container">
      <div className="d-flex w-100 h-100 align-items-center">
        <img className="pl-2" src="logo.svg" height="45"/>
      </div>
    </header>
  )
}

//