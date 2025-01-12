import { useState } from "react"
import Btn from "../../components/Button"
import { useAuthContext } from "../../contexts/AuthContext"
import Inpt from "../../components/Input"

const ForgotPassword = () => {
  const [email_address, setEmailAddress] = useState()
  const { forgotPassword, btnLoading } = useAuthContext()

  const handleForgotPassword = (e) => {
    e.preventDefault()
    forgotPassword({ staff_email_address: email_address })
  }

  return (
    <form onSubmit={handleForgotPassword} className='space-y-6'>
      <span className="font-semibold">Forgot Password</span>
      <Inpt onChange={(e) => setEmailAddress(e.target.value)} label="Email Address" required />
      <Btn type="submit" label="Send" color="blue" loading={btnLoading} fullWidth />
    </form>
  )
}

export default ForgotPassword