import React, { useState } from 'react'
import axios from 'axios'
import Dashboard from './Dashboard'
import Navbar from './Navbar'
import Search from './Search'
import FilteredPokemons from './FilteredPokemons'
import Pagination from './Pagination'

function Login({onFormSwitch}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [accessToken, setAccessToken] = useState('')
    const [refreshToken, setRefreshToken] = useState('')
    const [user, setUser] = useState('')
    const [typeSelectedArray, setTypeSelectedArray] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [pokemonsSelected, setPokemonsSelected] = useState('');


    const onClickHandle = async (e) => {
        e.preventDefault()
        const res = await axios.post('http://localhost:5000/login', {
            username: username,
            password: password
        })
        setUser(res.data)
        setAccessToken(res.headers["auth-token-access"])
        setRefreshToken(res.headers["auth-token-refresh"])
    }

  return (
    <>
        {
            (accessToken) && 
                <>
                    <Navbar
                        accessToken={accessToken}
                        setAccessToken={setAccessToken}
                    /> 
                    <h2>Hello {username}</h2>
                    <Search
                    typeSelectedArray={typeSelectedArray}
                    setTypeSelectedArray={setTypeSelectedArray}
                    />
                    <FilteredPokemons
                    typeSelectedArray={typeSelectedArray}
                    currentPage={currentPage}
                    pokemonsSelected={pokemonsSelected}
                    setPokemonsSelected={setPokemonsSelected}
                    />
                    <Pagination
                    typeSelectedArray={typeSelectedArray}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pokemonsSelected={pokemonsSelected}
                    />
                </>
        }

        {
            (accessToken && user?.role === "admin") &&
            <div className="admin-dashboard">
                <Dashboard
                    accessToken={accessToken}
                    setAccessToken={setAccessToken}
                    refreshToken={refreshToken}
                />
            </div>
        }

        {
            (!accessToken) && 
            <div className='auth-form-outer-container'>
                <div className='auth-form'>
                    <div className='auth-form-container'>
                        <h2>Login</h2>
                        <form className='login-form' onSubmit={onClickHandle}>
                        <label>Username</label>
                        <input 
                        type="text" 
                        placeholder='username' 
                        onChange={(e) => { setUsername(e.target.value)}}/>
                        <label>Password</label>
                        <input 
                        type="password" 
                        placeholder='password'
                        onChange={(e) => { setPassword(e.target.value)}}/>
                        <button type='submit'>Login</button>
                        </form>
                        <button className='link-btn' onClick={()=>onFormSwitch('register')}>Don't have an account? Register here.</button>
                    </div>
                </div>
            </div>
        }
    </>
  )
}

export default Login