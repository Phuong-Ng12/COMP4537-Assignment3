import React, { useEffect } from 'react'
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

function Report({id, accessToken, setAccessToken, refreshToken }) {
    const [reportTable, setReportTable] = React.useState(null);

    const axiosToBeIntercepted = axios.create();
    axiosToBeIntercepted.interceptors.request.use(async function (config) {
        const decoded = jwt_decode(accessToken);
        const currentTime = Date.now() / 1000;
        if(decoded.exp < currentTime){
            console.log("Token expired!");
            localStorage.setItem("accessToken", "")
            const res = await axios.post("https://pokedex-server-rosebug.onrender.com/requestNewAccessToken", {}, {
                headers: {
                  'auth-token-refresh': refreshToken
                }
              });
            localStorage.setItem("accessToken", res.headers["auth-token-access"])
            setAccessToken(localStorage.getItem("accessToken"));
            config.headers["auth-token-access"] = localStorage.getItem("accessToken")
        }
        return config;
    }, function (error) {
        return Promise.reject(error);
    });

    useEffect(() => {
        async function fetchReport() {
            const res = await axiosToBeIntercepted.get(
                `https://pokedex-server-rosebug.onrender.com/report?id=${id}`,
                {
                    headers: {
                        'auth-token-access': accessToken
                    }
                }
                );
            setReportTable(res.data);
        }
        fetchReport();
    }, [id])

    if(id === 1 && reportTable) {
        return (
            <div className="reportTableReturn" id="1">
                <div id="top-users-for-each-endpoint" style={{display: "none"}}></div>
                <div id="4xx-errors-by-endpoint" style={{display: "none"}}></div>
                <div id="recent-4xx-5xx-errors" style={{display: "none"}}></div>
                <div id='top-api-users' style={{display: "none"}}></div>
    
                <div id="unique-api-users">
                {
                    (reportTable) &&<>
                    <table id="unique-api-users-table" className="rowNumbers">
                        <thead>
                            <tr>
                                <th colSpan="5">Unique API Users Over Period Of Time (2023)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Date</th>
                                <th>Times Visit</th>
                            </tr>
                            {reportTable.map((user, key) => (
                                <tr key={key}>
                                    <td>{user.user}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.date}</td>
                                    <td>{user.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Bar data={{
                        labels: reportTable.map(user => user.user),
                        datasets: [
                            {
                                label: "Unique API Users Over Period Of Time (2023)",
                                data: reportTable.map(user => user.count),
                                backgroundColor: "rgba(255, 99, 132)"
                            }
                        ],
                    }}
                    options={{
                        scales: {
                            y: 
                              {
                                ticks: {
                                  color: "white",
                                  stepSize: 1,
                                  beginAtZero: true,
                                },
                              },
                            x: 
                              {
                                ticks: {
                                  color: "white",
                                  beginAtZero: true,
                                },
                              },
                            
                          },
                        plugins: {
                            legend: {
                                display: true,
                                labels: {
                                    color: 'white'
                                }
                            },
                        },
                        
                    }}
                    />
                    </>
                }
                </div> 
            </div>
        )   
    } else if (id === 2 && reportTable) {
        return (
            <div className="reportTableReturn" id ="2">
                <div id="unique-api-users" style={{display: "none"}}></div>
                <div id="top-users-for-each-endpoint" style={{display: "none"}}></div>
                <div id="4xx-errors-by-endpoint" style={{display: "none"}}></div>
                <div id="recent-4xx-5xx-errors" style={{display: "none"}}></div>
                <div id='top-api-users'>   
                {
                    (reportTable) && <>
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
                                <tr key={key}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.date}</td>
                                    <td>{user.url}</td>
                                    <td>{user.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Bar data={{
                        labels: reportTable.map(user => user.date),
                        datasets: [
                            {
                                label: "Top API Users Over Period Of Time (2023)",
                                data: reportTable.map(user => user.count),
                                backgroundColor: "rgba(255, 99, 132)"
                            }
                        ],
                    }}
                    options={{
                        scales: {
                            y: 
                              {
                                ticks: {
                                  color: "white",
                                  stepSize: 1,
                                  beginAtZero: true,
                                },
                              },
                            x: 
                              {
                                ticks: {
                                  color: "white",
                                  beginAtZero: true,
                                },
                              },
                            
                          },
                        plugins: {
                            legend: {
                                display: true,
                                labels: {
                                    color: 'white'
                                }
                            },
                        },
                        
                    }}
                    />
                    </>
                }
                </div>
            </div>
        )
    } else if (id === 3 && reportTable) {
        return (
            <div className="reportTableReturn" id="3">
                <div id="unique-api-users" style={{display: "none"}}></div>
                <div id='top-api-users' style={{display: "none"}}></div>
                <div id="4xx-errors-by-endpoint" style={{display: "none"}}></div>
                <div id="recent-4xx-5xx-errors" style={{display: "none"}}></div>
                <div id="top-users-for-each-endpoint">
                    {
                        (reportTable) && <>
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
                                    <tr key={key}>
                                         <td>{endpoint._idReport}</td>
                                         <td>{endpoint.username}</td>
                                         <td>{endpoint.role}</td>
                                         <td>{endpoint.email}</td>
                                         <td>{endpoint.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Bar data={{
                            labels: reportTable.map(user => user._idReport),
                            datasets: [
                                {
                                    label: "Top users for each Endpoint",
                                    data: reportTable.map(user => user.count),
                                    backgroundColor: "rgba(255, 99, 132)"
                                }
                            ]
                            }}
                            options={{
                                scales: {
                                    y: 
                                      {
                                        ticks: {
                                          color: "white",
                                          stepSize: 1,
                                          beginAtZero: true,
                                        },
                                      },
                                    x: 
                                      {
                                        ticks: {
                                          color: "white",
                                          beginAtZero: true,
                                        },
                                      },
                                    
                                  },
                                plugins: {
                                    legend: {
                                        display: true,
                                        labels: {
                                            color: 'white'
                                        }
                                    },
                                },
                                
                            }}    
                        />
                        </>
                    }
                </div> 
            </div>
        )
    } else if (id === 4 && reportTable) {
        return (
            <div className="reportTableReturn" id="4">
                <div id="unique-api-users" style={{display: "none"}}></div>
                <div id='top-api-users' style={{display: "none"}}></div>
                <div id="top-users-for-each-endpoint" style={{display: "none"}}></div>
                <div id="recent-4xx-5xx-errors" style={{display: "none"}}></div>

                <div id="4xx-errors-by-endpoint">
                {
                    (reportTable) && <>
                    <table id="4xx-errors-by-endpoint-table" className="rowNumbers">
                        <thead>
                            <tr>
                                <th colSpan="4">4xx Errors By Endpoint</th>
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
                                    <td>{url._idErrors4xx}</td>
                                    <td>{url.method}</td>
                                    <td>{url.status}</td>
                                    <td>{url.countEndpoint}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Bar data={{
                            labels: reportTable.map(error => error._idErrors4xx),
                            datasets: [
                                {
                                    label: "4xx Errors By Endpoint",
                                    data: reportTable.map(error => error.countEndpoint),
                                    backgroundColor: "rgba(255, 99, 132)"
                                }
                            ]
                    }}
                    options={{
                        scales: {
                            y: 
                              {
                                ticks: {
                                  color: "white",
                                  stepSize: 1,
                                  beginAtZero: true,
                                },
                              },
                            x: 
                              {
                                ticks: {
                                  color: "white",
                                  beginAtZero: true,
                                },
                              },
                            
                          },
                        plugins: {
                            legend: {
                                display: true,
                                labels: {
                                    color: 'white'
                                }
                            },
                        },
                        
                    }}
                    />
                    </>
                    }
                </div>
            </div>
        )
    } else if (id === 5 && reportTable) {
        return (
            <div className="reportTableReturn" id="5">
                <div id="unique-api-users" style={{display: "none"}}></div>
                <div id='top-api-users' style={{display: "none"}}></div>
                <div id="top-users-for-each-endpoint" style={{display: "none"}}></div>
                <div id="4xx-errors-by-endpoint" style={{display: "none"}}></div>

                <div id="recent-4xx-5xx-errors">
                {
                    (reportTable) && <>
                    <table id="recent-4xx-5xx-errors-table" className="rowNumbers">
                        <thead>
                            <tr>
                                <th colSpan="4">Recent 4xx/5xx Errors</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Endpoint</th>
                                <th>Method</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                            {reportTable.map((error, key) => (
                                <tr key={key}>
                                    <td>{error._idRecentErrors}</td>
                                    <td>{error.method}</td>
                                    <td>{error.status}</td>
                                    <td>{error.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Bar data={{
                            labels: reportTable.map(error => error.date),
                            datasets: [
                                {
                                    label: "Recent 4xx/5xx Errors",
                                    data: reportTable.map(error => error.status),
                                    backgroundColor: "rgba(255, 99, 132)"
                                }
                            ]
                    }}
                    options={{
                        scales: {
                            y: 
                              {
                                ticks: {
                                  color: "white",
                                  beginAtZero: true,
                                },
                              },
                            x: 
                              {
                                ticks: {
                                  color: "white",
                                  beginAtZero: true,
                                },
                              },
                            
                          },
                        plugins: {
                            legend: {
                                display: true,
                                labels: {
                                    color: 'white'
                                }
                            },
                        },
                        
                    }}
                    />
                    </>
                    }    
                </div>
            </div>
        )
    } 
}

export default Report