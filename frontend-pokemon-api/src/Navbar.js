import React from 'react'
import './App.css'
import Logout from './Logout';

import {
    Routes,
    Route,
    Link
  } from "react-router-dom";

function Navbar({ accessToken, setAccessToken }) {
  return (
    <div id="topnav">
        <ul>
            <li></li>
            <li></li>
            <li></li>
            <li id="logout" className="active"><Link to="/logout">Logout</Link></li>
        </ul>

        <Routes>
            <Route path="/logout" element={<Logout accessToken={accessToken} setAccessToken={setAccessToken} />} />
        </Routes>
    </div>
  )
}

export default Navbar