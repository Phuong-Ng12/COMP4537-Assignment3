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
                console.log(res.data)
            setReportTable(res.data)
        }
        fetchReport()
    }, [id])

  return (
    <>
        {
            (id === 1) ? <>
            <div id="top-users-for-each-endpoint" style={{display: "none"}}></div>
            <div id="4xx-errors-by-endpoint" style={{display: "none"}}></div>
            <div id="recent-4xx-5xx-errors" style={{display: "none"}}></div>
            <div id='top-api-users' style={{display: "none"}}></div>
            <div id="unique-api-users">
            {
                (reportTable) &&
                <table className="rowNumbers">
                    <tr>
                        <th colSpan="4">Unique API Users Over Period Of Time (2023)</th>
                    </tr>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Date</th>
                    </tr>
                    {reportTable.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>{user.date}</td>
                        </tr>
                    ))}
                </table>
            }
            </div> </>
        : (id === 2) ? <>
        <div id="unique-api-users" style={{display: "none"}}></div>
        <div id="top-users-for-each-endpoint" style={{display: "none"}}></div>
        <div id="4xx-errors-by-endpoint" style={{display: "none"}}></div>
        <div id="recent-4xx-5xx-errors" style={{display: "none"}}></div>

        <div id='top-api-users'>
        {
            (reportTable) &&
            <table className="rowNumbers">
                <tr>
                    <th colSpan="6">Top API Users Over Period Of Time (2023)</th>
                </tr>
                <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Date</th>
                    <th>Endpoint</th>
                    <th>Count</th>
                </tr>
                {reportTable.map(user => (
                    <tr key={user.date}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>{user.date}</td>
                        <td>{user.url}</td>
                        <td>{user.count}</td>
                    </tr>
                ))}
            </table>
        }
        </div></>
        : (id === 3) ? <>
        <div id="unique-api-users" style={{display: "none"}}></div>
        <div id='top-api-users' style={{display: "none"}}></div>
        <div id="4xx-errors-by-endpoint" style={{display: "none"}}></div>
        <div id="recent-4xx-5xx-errors" style={{display: "none"}}></div>

        <div id="top-users-for-each-endpoint">
            {
                (reportTable) &&
                <table className="rowNumbers">
                    <tr>
                        <th colSpan="5">Top users for each Endpoint</th>
                    </tr>
                    <tr>
                        <th>Endpoint</th>
                        <th>User</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Count</th>
                    </tr>
                    {reportTable.map(user => (
                        <tr key={user.date}>
                            <td>{user._id}</td>
                            <td>{user.tpUsers.map(username => (username.username))}</td>
                            <td>{user.tpUsers.map(role => (role.role))}</td>
                            <td>{user.tpUsers.map(email => (email.email))}</td>
                            <td>{user.topUsers.map(count => (count.count))}</td>
                        </tr>
                    ))}
                </table>
            }
        </div> </>
        : (id === 4) ? <>
        <div id="unique-api-users" style={{display: "none"}}></div>
        <div id='top-api-users' style={{display: "none"}}></div>
        <div id="top-users-for-each-endpoint" style={{display: "none"}}></div>
        <div id="recent-4xx-5xx-errors" style={{display: "none"}}></div>
        
        <div id="4xx-errors-by-endpoint">
        {
            (reportTable) &&
            <table className="rowNumbers">
                <tr>
                    <th colSpan="3">4xx Errors By Endpoint</th>
                </tr>
                <tr>
                    <th>Endpoint</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Count</th>
                </tr>
                {reportTable.map(url => (
                    <tr key={url.count}>
                        <td>{url._id.url}</td>
                        <td>{url._id.method}</td>
                        <td>{url._id.status}</td>
                        <td>{url.count}</td>
                    </tr>
                ))}
            </table>
            }
        </div></>
        : (id === 5) && <>
        <div id="unique-api-users" style={{display: "none"}}></div>
        <div id='top-api-users' style={{display: "none"}}></div>
        <div id="top-users-for-each-endpoint" style={{display: "none"}}></div>
        <div id="4xx-errors-by-endpoint" style={{display: "none"}}></div>

        <div id="recent-4xx-5xx-errors">
        {
            (reportTable) &&
            <table className="rowNumbers">
                <tr>
                    <th colSpan="3">Recent 4xx/5xx Errors</th>
                </tr>
                <tr>
                    <th>Endpoint</th>
                    <th>Method</th>
                    <th>Status</th>
                </tr>
                {reportTable.map(error => (
                    <tr key={error.date}>
                        <td>{error.url}</td>
                        <td>{error.method}</td>
                        <td>{error.status}</td>
                    </tr>
                ))}
            </table>
            }    
        </div></>
        
        }
    </>
  )
}

export default Report