import { createContext, useContext, useEffect, useState } from "react"
import axios from "../api/axios"
import { useNavigate } from "react-router-dom"

const auth = createContext({})

export const AuthContext = ({ children }) => {
  const [token, _setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [email_address, setEmailAddress] = useState("")
  const [otp, setOtp] = useState("")
  const navigate = useNavigate()

  const setToken = (token) => {
    _setToken(token)
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }

  useEffect(() => {
    const loadUser = async () => {
      await getUser()
    }
    loadUser()
  }, [])

  const getUser = async () => {
    setLoading(true)
    await axios.get("/user")
      .then(({ data }) => {
        setUser(data)
      })
      .finally(() => {
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      })
  }

  const login = async ({ ...data }) => {
    setBtnLoading(true)
    await axios.post('/login', data)
      .then(async ({ data }) => {
        setToken(data.token)
        await getUser()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const forgotPassword = async ({ ...data }) => {
    setBtnLoading(true)
    await axios.post('/forgot-password', data)
      .then(() => {
        setEmailAddress(data.staff_email_address)
        navigate('/email-verification')
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const verifyOtp = async ({ ...data }) => {
    setBtnLoading(true)
    await axios.post('/verify-otp', data)
      .then(() => {
        setOtp(data.otp)
        navigate('/create-new-password')
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const createNewPassword = async ({ ...data }) => {
    setBtnLoading(true)
    await axios.post("/create-new-password", data)
      .then(() => {
        setEmailAddress("")
        setOtp("")
        navigate('/login')
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const logout = async () => {
    setLoading(true)
    await axios.get('/logout')
      .then(() => {
        setToken(null)
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <auth.Provider value={{ token, user, loading, btnLoading, email_address, otp, login, forgotPassword, verifyOtp, createNewPassword, logout }}>
      {children}
    </auth.Provider>
  )
}

export const useAuthContext = () => useContext(auth)
