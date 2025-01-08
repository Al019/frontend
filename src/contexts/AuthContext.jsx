import { createContext, useContext, useEffect, useState } from "react"
import axios from "../api/axios"
import { useNavigate } from "react-router-dom"

const auth = createContext({})

export const AuthContext = ({ children }) => {
  const [token, _setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)

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
    <auth.Provider value={{ token, user, loading, btnLoading, login, logout }}>
      {children}
    </auth.Provider>
  )
}

export const useAuthContext = () => useContext(auth)
