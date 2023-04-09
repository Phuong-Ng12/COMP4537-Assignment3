import axios from 'axios'
import React, { useEffect } from 'react'

function Logout({ accessToken, setAccessToken, setRefreshToken, setUser, setUsername, setPassword }) {
    useEffect(() => {
        async function fetchLogout() {
            const res = await axios.get(
                "https://pokedex-server-rosebug.onrender.com/logout",
                {
                    headers: {
                        'auth-token-access': accessToken
                    }
                }
                )

            console.log(res)
            console.log(res.headers["auth-token-access"])

            setAccessToken('')
            setRefreshToken('')
            setUser('')
            setUsername('')
            setPassword('')
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            localStorage.removeItem("userRole")
            localStorage.removeItem("username")
        }
        fetchLogout()
    }, [accessToken, setAccessToken, setRefreshToken, setUser, setUsername, setPassword])
  return (
    <div>Logout</div>
  )
}

export default Logout