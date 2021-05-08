import React, { useState } from 'react'
import useForm from '../../logic/hooks/use-form'

const fields = {
  password: 'password',
  confirmPassword: 'confirmPassword'
}

export default function({ onSuccess, className }) {
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
          message: 'Password is required'
        },
        custom: {
          isValid: v => v && v.length >= 6,
          message: 'Length should be at least 6',
        }
      },
      [fields.confirmPassword]: {
        equal: {
          to: [fields.password],
          message: `Passwords don't match`
        }
      }
    },
    onSubmit: data => {
      console.log(data)
      console.log('SUCCESS')
      onSuccess(data[fields.password])
    }
  });

  return (
    <div className={`${className}`}>
      <h3>
        Password creation
      </h3>
      <p>
        you need to come up with a password
      </p>
      <div>
        <div>
          <input 
            value={data[fields.password] || ''} 
            className="mb-2"
            type="password"
            placeholder="password"
            onChange={handleChange(fields.password)} 
          />
        </div>
        
      </div>
      <div>
        <div>
          <input 
            value={data[fields.confirmPassword] || ''} 
            className="mb-2"
            type="password"
            placeholder="confirm password"
            onChange={handleChange(fields.confirmPassword)} 
          />
        </div>
        {errors[fields.confirmPassword] && <p className="error">{errors[fields.confirmPassword]}</p>}
        {errors[fields.password] && <p className="error">{errors[fields.password]}</p>}
      </div>
      <button 
        type="button" 
        onClick={handleSubmit} 
        className="w-100 button-primary"
      >
        Continue
      </button>
    </div>
  )
}
