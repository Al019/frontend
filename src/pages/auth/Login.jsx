import { useState } from "react"
import Btn from "../../components/Button"
import Inpt from "../../components/Input"
import { useAuthContext } from "../../contexts/AuthContext"

const Login = () => {
  const [email_address, setEmailAddress] = useState("")
  const [password, setPassword] = useState("")
  const { login, btnLoading } = useAuthContext()

  const handleLogin = (e) => {
    e.preventDefault()
    login({ staff_email_address: email_address, password })
  }

  return (
    <form onSubmit={handleLogin} className='space-y-6'>
      <div className="space-y-4">
        <Inpt onChange={(e) => setEmailAddress(e.target.value)} label="Email Address" required />
        <div className="space-y-2">
          <Inpt onChange={(e) => setPassword(e.target.value)} label="Password" secureTextEntry required />
          <div className="flex justify-end">
            <span className="text-sm cursor-pointer hover:underline hover:text-blue-500">Forgot Password</span>
          </div>
        </div>
      </div>
      <Btn type="submit" label="Login" color="blue" loading={btnLoading} fullWidth />
    </form>
  )
}

export default Login