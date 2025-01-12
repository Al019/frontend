import { useState } from "react"
import Btn from "../../components/Button"
import Inpt from "../../components/Input"
import { useAuthContext } from "../../contexts/AuthContext"

const EmailVerification = () => {
  const { verifyOtp, email_address, btnLoading } = useAuthContext()
  const [otp, setOtp] = useState("")

  const handleVerify = (e) => {
    e.preventDefault()
    verifyOtp({ email_address, otp })
  }

  return (
    <form onSubmit={handleVerify} className='space-y-6'>
      <span className="font-semibold">Email Verification</span>
      <Inpt onChange={(e) => setOtp(e.target.value)} label="OTP" maxLength={6} required />
      <Btn type="submit" label="Verify" color="blue" loading={btnLoading} fullWidth />
    </form>
  )
}

export default EmailVerification