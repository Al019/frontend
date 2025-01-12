import { useState } from "react"
import { useAuthContext } from "../../contexts/AuthContext"
import Inpt from "../../components/Input"
import Btn from "../../components/Button"

const CreateNewPassword = () => {
  const { createNewPassword, email_address, btnLoading } = useAuthContext()
  const [password, setPassword] = useState("")
  const [password_confirmation, setPasswordConfirmation] = useState("")

  const handleCreatePassword = (e) => {
    e.preventDefault()
    createNewPassword({ password, password_confirmation, staff_email_address: email_address })
  }

  return (
    <form onSubmit={handleCreatePassword} className='space-y-6'>
      <span className="font-semibold">Create New Password</span>
      <div className="space-y-4">
        <Inpt onChange={(e) => setPassword(e.target.value)} label="Password" secureTextEntry required />
        <Inpt onChange={(e) => setPasswordConfirmation(e.target.value)} label="Confirm Password" secureTextEntry required />
      </div>
      <Btn type="submit" label="Save Changes" color="blue" loading={btnLoading} fullWidth />
    </form>
  )
}

export default CreateNewPassword