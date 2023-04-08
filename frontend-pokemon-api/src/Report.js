import React, { useEffect, useLayoutEffect } from 'react'
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

    if(id === 1 && reportTable) {
        return (
            <div id="1">
                <div id="top-users-for-each-endpoint" style={{display: "none"}}></div>
                <div id="4xx-errors-by-endpoint" style={{display: "none"}}></div>
                <div id="recent-4xx-5xx-errors" style={{display: "none"}}></div>
                <div id='top-api-users' style={{display: "none"}}></div>
    
                {/* <table id='top-api-users-table' style={{display: "none"}}></table> */}
                {/* <table id="top-users-for-each-endpoint-table" style={{display: "none"}}></table>
                <table id="4xx-errors-by-endpoint-table" style={{display: "none"}}></table>
                <table id="recent-4xx-5xx-errors-table" style={{display: "none"}}></table> */}
    
                <div id="unique-api-users">
                {
                    (reportTable) &&
                    <table id="unique-api-users-table" className="rowNumbers">
                        <thead>
                            <tr>
                                <th colSpan="4">Unique API Users Over Period Of Time (2023)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Date</th>
                            </tr>
                            {reportTable.map((user, key) => (
                                <tr key={key}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
                </div> 
            </div>
        )   
    } else if (id === 3 && reportTable) {
        return (
            <div id="3">
                <div id="unique-api-users" style={{display: "none"}}></div>
                <div id='top-api-users' style={{display: "none"}}></div>
                <div id="4xx-errors-by-endpoint" style={{display: "none"}}></div>
                <div id="recent-4xx-5xx-errors" style={{display: "none"}}></div>
                <div id="top-users-for-each-endpoint">
                    {
                        (reportTable) &&
                        <table id="top-users-for-each-endpoint-table" className="rowNumbers">
                            <thead>
                                <tr>
                                    <th colSpan="5">Top users for each Endpoint</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Endpoint</th>
                                    <th>User</th>
                                    <th>Role</th>
                                    <th>Email</th>
                                    <th>Count</th>
                                </tr>
                                {reportTable.map((endpoint, key) => (
                                    // console.log(endpoint)

                                    <tr key={key}>
                                        {/* <td>{endpoint.url}</td> */}

                                        <td>{endpoint._id}</td>
                                        <td>{endpoint.username}</td>
                                        <td>{endpoint.role}</td>
                                        <td>{endpoint.email}</td>
                                        <td>{endpoint.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </div> 
            </div>
        )
    } else if (id === 4 && reportTable) {
        return (
            <div id="4">
                <div id="unique-api-users" style={{display: "none"}}></div>
                <div id='top-api-users' style={{display: "none"}}></div>
                <div id="top-users-for-each-endpoint" style={{display: "none"}}></div>
                <div id="recent-4xx-5xx-errors" style={{display: "none"}}></div>

                <div id="4xx-errors-by-endpoint">
                {
                    (reportTable) &&
                    <table id="4xx-errors-by-endpoint-table" className="rowNumbers">
                        <thead>
                            <tr>
                                <th colSpan="3">4xx Errors By Endpoint</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Endpoint</th>
                                <th>Method</th>
                                <th>Status</th>
                                <th>Count</th>
                            </tr>
                            {reportTable.map((url, key) => (
                                <tr key={key}>
                                    <td>{url._id.url}</td>
                                    <td>{url._id.method}</td>
                                    <td>{url._id.status}</td>
                                    <td>{url.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    }
                </div>
            </div>
        )
    } else if (id === 5 && reportTable) {
        return (
            <div id="5">
                <div id="unique-api-users" style={{display: "none"}}></div>
                <div id='top-api-users' style={{display: "none"}}></div>
                <div id="top-users-for-each-endpoint" style={{display: "none"}}></div>
                <div id="4xx-errors-by-endpoint" style={{display: "none"}}></div>

                <div id="recent-4xx-5xx-errors">
                {
                    (reportTable) &&
                    <table id="recent-4xx-5xx-errors-table" className="rowNumbers">
                        <thead>
                            <tr>
                                <th colSpan="3">Recent 4xx/5xx Errors</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Endpoint</th>
                                <th>Method</th>
                                <th>Status</th>
                            </tr>
                            {reportTable.map((error, key) => (
                                <tr key={key}>
                                    <td>{error.url}</td>
                                    <td>{error.method}</td>
                                    <td>{error.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    }    
                </div>
            </div>
        )
    } else if (id === 2 && reportTable) {
        return (
            <div id ="2">
                <div id="unique-api-users" style={{display: "none"}}></div>
                <div id="top-users-for-each-endpoint" style={{display: "none"}}></div>
                <div id="4xx-errors-by-endpoint" style={{display: "none"}}></div>
                <div id="recent-4xx-5xx-errors" style={{display: "none"}}></div>


                <div id='top-api-users'>   
                {
                    (reportTable) &&
                    <table id='top-api-users-table' className="rowNumbers">
                        <thead>
                            <tr>
                                <th colSpan="6">Top API Users Over Period Of Time (2023)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Date</th>
                                <th>Endpoint</th>
                                <th>Count</th>
                            </tr>
                            {reportTable.map((user, key) => (
                                // console.log(user)
                                <tr key={key}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.date}</td>
                                    <td>{user.url}</td>
                                    <td>{user.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
                </div>
            </div>
            // {setReportTable(null)}
        )
    }
}

export default Report