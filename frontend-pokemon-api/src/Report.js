import React, { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import jwt_decode from 'jwt-decode'

function Report({id, accessToken, setAccessToken, refreshToken }) {

    const [reportTable, setReportTable] = React.useState(null)

    const axiosToBeIntercepted = axios.create()
    axiosToBeIntercepted.interceptors.request.use(async function (config) {
        const decoded = jwt_decode(accessToken)
        const currentTime = Date.now() / 1000
        if(decoded.exp < currentTime){
            console.log("Token expired!")
            const res = await axios.post("http://localhost:5000/requestNewAccessToken", {}, {
                headers: {
                  'auth-token-refresh': refreshToken
                }
              });
            setAccessToken(res.headers["auth-token-access"])
            config.headers["auth-token-access"] = res.headers["auth-token-access"];
        }
        return config;
    }, function (error) {
        return Promise.reject(error);
    });

    useEffect(() => {
        async function fetchReport() {
            const res = await axiosToBeIntercepted.get(
                `http://localhost:5000/report?id=${id}`,
                {
                    headers: {
                        'auth-token-access': accessToken
                    }
                }
                )
            setReportTable(res.data)
        }
        fetchReport()
    }, [id])

  return (
    <div>Report {id}
    {
        (reportTable) &&
        reportTable
    }
    </div>
  )
}

export default Report