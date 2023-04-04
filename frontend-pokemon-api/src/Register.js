import React, { useState } from 'react'
import axios from 'axios'


function Register({onFormSwitch}) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const onClickHandle = async (e) => {
        e.preventDefault()
        const res = await axios.post('http://localhost:5000/register', {
            username: username,
            password: password,
            email: email
        })
        console.log(res.data)
    }

  return (
    <div className='auth-form-container'>
        <h2>Register</h2>
        {
            <form className='register-form' onSubmit={onClickHandle}>
                <label>Username</label>
                <input 
                    type="text" 
                    placeholder='username' 
                    onChange={(e) => { setUsername(e.target.value)}}/>
                <label>Email</label>
                <input 
                    type="text" 
                    placeholder='email' 
                    onChange={(e) => { setEmail(e.target.value)}}/>
                <label>Password</label>
                <input 
                    type="password" 
                    placeholder='password'
                    onChange={(e) => { setPassword(e.target.value)}}/>
                    <button type='submit'>Register</button>
            </form>
        }
        <button className='link-btn' onClick={()=>onFormSwitch('login')}>Already have an account? Login here.</button>
    </div>
  )
}

export default Register