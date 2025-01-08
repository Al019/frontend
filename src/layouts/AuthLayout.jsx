import { Card, CardBody } from "@material-tailwind/react"
import { Navigate, Outlet } from "react-router-dom"
import Logo from '../assets/images/occ-logo.png'
import { useAuthContext } from "../contexts/AuthContext"

const AuthLayout = () => {
  const { token, user } = useAuthContext()

  if (token) {
    if (user?.role === 'admin') {
      return <Navigate to='/registrar/admin/dashboard' />
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardBody className="space-y-6">
          <div className="flex flex-col items-center gap-3">
            <img src={Logo} className="w-20 h-20" />
            <span className="text-lg font-bold">Office Of Registrar</span>
          </div>
          <Outlet />
        </CardBody>
      </Card>
    </div>
  )
}

export default AuthLayout