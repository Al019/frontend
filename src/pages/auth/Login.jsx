import { useState } from "react"
import Btn from "../../components/Button"
import Inpt from "../../components/Input"
import { useAuthContext } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [formData, setFormData] = useState({
    email_address: "",
    password: ""
  })
  const { login, btnLoading } = useAuthContext()
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    login({ staff_email_address: formData.email_address, password: formData.password })
  }

  return (
    <form onSubmit={handleLogin} className='space-y-6'>
      <span className="font-semibold">Login</span>
      <div className="space-y-4">
        <Inpt onChange={(e) => setFormData({ ...formData, email_address: e.target.value })} label="Email Address" required />
        <div className="space-y-2">
          <Inpt onChange={(e) => setFormData({ ...formData, password: e.target.value })} label="Password" secureTextEntry required />
          <div className="flex justify-end">
            <span onClick={() => navigate('/forgot-password')} className="text-sm cursor-pointer hover:underline hover:text-blue-500">Forgot Password</span>
          </div>
        </div>
      </div>
      <Btn type="submit" label="Login" color="blue" loading={btnLoading} fullWidth />
    </form>
  )
}

export default Login