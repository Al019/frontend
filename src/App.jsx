import { Navigate, Route, Routes } from "react-router-dom"
import AuthLayout from "./layouts/AuthLayout"
import Login from "./pages/auth/Login"
import DefaultLayout from "./layouts/DefaultLayout"
import AdminDashboard from "./pages/default/admin/dashboard/Dashboard"
import Student from "./pages/default/admin/students/Student"
import Staff from "./pages/default/admin/staffs/Staff"
import Document from "./pages/default/admin/documents/Document"
import Record from "./pages/default/admin/documents/Record"
import Credential from "./pages/default/admin/credentials/Credential"
import Purpose from "./pages/default/admin/credentials/Purpose"
import Requirement from "./pages/default/admin/documents/Requirement"
import SoftCopy from "./pages/default/admin/documents/SoftCopy"
import AdminRequest from "./pages/default/admin/credentials/Request"
import AdminRequestDetail from "./pages/default/admin/credentials/RequestDetail"
import CashierDashboard from "./pages/default/cashier/dashboard/Dashboard"
import { useAuthContext } from "./contexts/AuthContext"
import CashierRequest from "./pages/default/cashier/credentials/Request"
import CashierRequestDetail from "./pages/default/cashier/credentials/RequestDetail"

const App = () => {
  const { token, user } = useAuthContext()

  return (
    <Routes>

      <Route path='/' element={<AuthLayout />}>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<Login />} />
      </Route>

      {token ? (
        <Route path='/' element={<DefaultLayout />}>

          {user?.role === 'admin' && (
            <>
              <Route path='/registrar/admin/dashboard' element={<AdminDashboard />} />

              <Route path='/registrar/admin/students' element={<Student />} />

              <Route path='/registrar/admin/staffs' element={<Staff />} />

              <Route path='/registrar/admin/documents' element={<Document />} />
              <Route path='/registrar/admin/documents/records' element={<Record />} />
              <Route path='/registrar/admin/documents/records/:id_number' element={<Requirement />} />
              <Route path='/registrar/admin/documents/records/:id_number/:document_id' element={<SoftCopy />} />

              <Route path='/registrar/admin/credentials' element={<Credential />} />
              <Route path='/registrar/admin/credentials/purposes' element={<Purpose />} />
              <Route path='/registrar/admin/credentials/requests' element={<AdminRequest />} />
              <Route path='/registrar/admin/credentials/requests/:request_number' element={<AdminRequestDetail />} />
            </>
          )}

          {user?.role === 'cashier' && (
            <>
              <Route path='/registrar/cashier/dashboard' element={<CashierDashboard />} />

              <Route path='/registrar/cashier/credentials/requests' element={<CashierRequest />} />
              <Route path='/registrar/cashier/credentials/requests/:request_number' element={<CashierRequestDetail />} />
            </>
          )}

        </Route>
      ) : (
        <Route path='*' element={<Navigate to='/login' />} />
      )}

    </Routes>
  )
}

export default App