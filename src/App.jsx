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

const App = () => {
  return (
    <Routes>

      <Route path='/' element={<AuthLayout />}>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<Login />} />
      </Route>

      <Route path='/' element={<DefaultLayout />}>

        <Route path='/registrar/admin/dashboard' element={<AdminDashboard />} />

        <Route path='/registrar/admin/students' element={<Student />} />

        <Route path='/registrar/admin/staffs' element={<Staff />} />

        <Route path='/registrar/admin/documents' element={<Document />} />
        <Route path='/registrar/admin/documents/records' element={<Record />} />
        <Route path='/registrar/admin/documents/records/:id_number' element={<Requirement />} />
        <Route path='/registrar/admin/documents/records/:id_number/:document_id' element={<SoftCopy />} />

        <Route path='/registrar/admin/credentials' element={<Credential />} />
        <Route path='/registrar/admin/credentials/purposes' element={<Purpose />} />

      </Route>

    </Routes>
  )
}

export default App