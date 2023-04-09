import axios from 'axios'
import React, { useEffect } from 'react'

function Logout({ accessToken, setAccessToken, setRefreshToken, setUser, setUsername, setPassword }) {
    useEffect(() => {
        async function fetchLogout() {
            const res = await axios.get(
                "http://localhost:5000/logout",
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
        }
        fetchLogout()
    }, [accessToken, setAccessToken, setRefreshToken, setUser, setUsername, setPassword])

    // useEffect(() => {
    //     console.log(accessToken)
    // }, [accessToken, setAccessToken])
  return (
    <div>Logout</div>
  )
}

export default Logout