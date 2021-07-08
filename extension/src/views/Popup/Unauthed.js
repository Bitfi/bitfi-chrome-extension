import React, { useState } from 'react'
import useForm from '../../logic/hooks/use-form'
import aes from '../../logic/utils/aes'
import './styles/Unauthed.css'

const fields = {
  password: 'password'
}

export default function({ login, reset, encrypted }) {
  const [loading, setLoading] = useState(false)
  const {
    handleSubmit,
    handleChange,
    data,
    errors,
    resetForm,
  } = useForm({
    validations: {
      [fields.password]: {
        required: {
          value: true,
        },
        custom: {
          isValid: v => {
            try { 
              aes.decrypt(encrypted, v)
              return true 
            } 
            catch (exc) {
              return false
            }
          },
          message: 'Password is not correct',
        }
      },
    },
    onSubmit: async data => {
      try {
        setLoading(true)
        const { token, deviceID } = aes.decrypt(encrypted, data[fields.password])
        await login({ token, deviceID })
      }
      catch (exc) {
        console.log(exc)
      }
      finally {
        setLoading(false)
      }
    },
    initialValues: {
      [fields.deviceID]: 'AAAAAA',
    },
  });

  return (
    <div className="text-center w-100">
      <h2 className="title"><strong>Welcome back</strong></h2>
      <p>
        The decentralized web awaits!
      </p>
      <div>
        <input 
          value={data[fields.password] || ''} 
          placeholder="password"
          type="password"
          onChange={handleChange(fields.password)} 
        />
      </div>
      {errors[fields.password] && <p className="error">{errors[fields.password]}</p>}
      <div>
        <button 
          className={`w-100 button-primary ${!loading? '' : 'disabled'}`} 
          onClick={handleSubmit}
        >
          UNLOCK
        </button>
      </div>
      <a href="#" onClick={reset}>forgot your password? click here</a>
    </div>
  )
}