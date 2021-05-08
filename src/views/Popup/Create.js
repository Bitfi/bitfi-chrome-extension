import React, { useState } from 'react'
import { sendApprove } from '../../logic/api/bitfi-server'
import aes from '../../logic/utils/aes'
import SetPassword from '../components/SetPassword'
import WaitApproval from '../components/WaitApproval'
import useForm from '../../logic/hooks/use-form'

const fields = {
  deviceID: 'deviceID'
}

export default function({ init }) {
  const [waitApproval, setWaitApproval] = useState(false)
  const [loading, setLoading] = useState(false)
  const [account, setAccount] = useState(false)

  const onSendApproveRequest = async () => {
    try {
      setLoading(true)
      
      const { ok } = await sendApprove(data[fields.deviceID])

      if (ok) {
        setWaitApproval(true)
      }
    }
    catch (exc) {
      console.log(exc)
    }
    finally {
      setLoading(false)
    }
  }

  const {
    handleSubmit,
    handleChange,
    data,
    errors,
    resetForm,
  } = useForm({
    validations: {
      [fields.deviceID]: {
        pattern: {
          value: '^[0-9A-Fa-f]*$',
          message: "Should be HEX",
        },
        required: {
          value: true,
        },
        custom: {
          isValid: v => v && v.length === 6,
          message: 'Should be 6 characters long',
        }
      },
    },
    onSubmit: onSendApproveRequest,
    initialValues: {
      [fields.deviceID]: '',
    },
  });

  if (account) {
    return (
      <SetPassword
        className="w-100"
        onSuccess={password => {
          const encrypted = aes.encrypt(account, password)
          init({ encrypted })
        }}
      />
    )
  }

  if (waitApproval) {
    return (
      <WaitApproval 
        className="w-100 text-center"
        deviceID={data[fields.deviceID]}
        frequencyMsec={1000} 
        timeoutMsec={3000} 
        onApproved={({ address, token }) => {
          if (waitApproval)
            setAccount({ address, token })
        }}
        onBack={() => {
          setWaitApproval(false)
          resetForm()
        }}
      />
    )
  }

  return (
    <div className="text-center w-100">
      <h3>Initialization!</h3>
      <p>
        Enter your Bitfi device ID
      </p>
      <div>
        <input 
          value={data[fields.deviceID] || ''} 
          className="text-center"
          placeholder="FFFFFF"
          style={{ textTransform: 'uppercase' }}
          onChange={handleChange(fields.deviceID)} 
        />
        
    
      </div>
      {errors[fields.deviceID] && <p className="error">{errors[fields.deviceID]}</p>}
      <button 
        className="button-primary w-100"
        disabled={loading} 
        onClick={handleSubmit}
      >
        SEND REQUEST
      </button>

    </div>
  )
}