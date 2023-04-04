import axios from 'axios'
import React, { useEffect } from 'react'

function Logout({ accessToken, setAccessToken }) {
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
            setAccessToken(res.headers["auth-token-access"])
        }
        fetchLogout()
    }, [accessToken, setAccessToken])
  return (
    <div>Logout</div>
  )
}

export default Logout