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
        try {
            const res = await axios.post('http://localhost:5000/login', {
                username: username,
                password: password
            })
            localStorage.setItem("accessToken", res.headers["auth-token-access"])
            localStorage.setItem("refreshToken", res.headers["auth-token-refresh"])
            localStorage.setItem("userRole", res.data.role)
            localStorage.setItem("username", username)
            setAccessToken(localStorage.getItem("accessToken"))
            setRefreshToken(localStorage.getItem("refreshToken"))
            setUsername(localStorage.getItem("username"))
            setUser(res.data)
        } catch (err) {
            if (err.response.status === 401) {
                alert(err.response.data.error)
            } else {
                alert(err.response.data.error)
            }
        }
        
    }
  return (
    <>
        {
            ((localStorage.getItem("accessToken") !== null)) && 
                <>
                    <Navbar
                        accessToken={accessToken}
                        setAccessToken={setAccessToken}
                        setRefreshToken={setRefreshToken}
                        setUser={setUser}
                        setUsername={setUsername}
                        setPassword={setPassword}
                    /> 
                    <h2>Hello {localStorage.getItem("username")}</h2>
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
            ((localStorage.getItem("accessToken") !== null) && localStorage.getItem("userRole") === "admin") &&
            <div className="admin-dashboard">
                <Dashboard
                    accessToken={accessToken}
                    setAccessToken={setAccessToken}
                    refreshToken={refreshToken}
                    setRefreshToken={setRefreshToken}
                />
            </div>
        }

        {
            (!accessToken && (localStorage.getItem("accessToken") === null)) && 
            <div className='auth-form-outer-container'>
                <div className='auth-form'>
                    <div className='auth-form-container'>
                        <h1>POKEDEX</h1>
                        <h2>Login</h2>
                        <form className='login-form' onSubmit={onClickHandle}>
                        <label>Username</label>
                        <input 
                        type="text" 
                        placeholder='username' 
                        required="required"
                        onChange={(e) => { setUsername(e.target.value)}}/>
                        <label>Password</label>
                        <input 
                        type="password" 
                        placeholder='password'
                        required="required"
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