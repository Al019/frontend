import { PlusIcon } from "@heroicons/react/24/outline"
import Btn from "../../../../components/Button"
import Tbl from "../../../../components/Table"
import { useEffect, useState } from "react"
import { Dialog, DialogBody, DialogFooter, DialogHeader, Option, Select } from "@material-tailwind/react"
import Inpt from "../../../../components/Input"
import axios from "../../../../api/axios"
import { useNavigate } from "react-router-dom"
import LoadingScreen from "../../../../components/LoadingScreen"

const Staff = () => {
  const [open, setOpen] = useState(false)
  const [last_name, setLastName] = useState("")
  const [first_name, setFirstName] = useState("")
  const [middle_name, setMiddleName] = useState("")
  const [gender, setGender] = useState("")
  const [email_address, setEmailAddress] = useState("")
  const [contact_number, setContactNumber] = useState("")
  const [role, setRole] = useState("")
  const [is_active, setIsActive] = useState(1)
  const [btnLoading, setBtnLoading] = useState(false)
  const [staffs, setStaffs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleOpen = () => {
    if (!btnLoading) {
      setOpen(!open)
      setLastName("")
      setFirstName("")
      setMiddleName("")
      setGender("")
      setEmailAddress("")
      setContactNumber("")
      setRole("")
      setIsActive(1)
    }
  }

  useEffect(() => {
    const loadStaff = async () => {
      await getStaff()
    }
    loadStaff()
  }, [])

  const getStaff = async () => {
    await axios.get('/admin/get-staff')
      .then(({ data }) => {
        const formattedStaffs = data.map((staff) => ({
          id: staff.staff.id,
          last_name: staff.staff.information.last_name,
          first_name: staff.staff.information.first_name,
          middle_name: staff.staff.information.middle_name,
          email_address: staff.staff.information.email_address,
          role: staff.role,
          is_active: staff.staff.is_active === 1 ? 'active' : 'inactive'
        }))
        setStaffs(formattedStaffs)
      }).finally(() => {
        setLoading(false)
      })
  }

  const handleAddStaff = async () => {
    setBtnLoading(true)
    await axios.post('/admin/add-staff', { last_name, first_name, middle_name, gender, email_address, contact_number, role, is_active })
      .then(() => {
        handleOpen()
        getStaff()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const data = {
    theads: [
      "Last Name",
      "First Name",
      "Middle Name",
      "Email Address",
      "Role",
      "Status"
    ],
    tbodies: staffs
  }

  const handleNavigate = (id) => {
    navigate(`/registrar/admin/staffs/${id}`)
  }

  if (loading) {
    return <LoadingScreen className="left-[288px]" />
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-end">
          <Btn onClick={handleOpen} label="Add" size="sm" color="green" variant="outlined" icon={<PlusIcon className="w-4 h-4" />} />
        </div>
        <Tbl title="Staffs" data={data} idKey="id" onClickView={handleNavigate} />
      </div>

      <Dialog open={open} handler={handleOpen}>
        <DialogHeader className="text-lg">Add Staff</DialogHeader>
        <DialogBody className="grid grid-cols-2 gap-4">
          <Inpt onChange={(e) => setLastName(e.target.value)} label="Last Name" />
          <Inpt onChange={(e) => setFirstName(e.target.value)} label="First Name" />
          <Inpt onChange={(e) => setMiddleName(e.target.value)} label="Middle Name" placeholder="Optional" />
          <Select onChange={(val) => setGender(val)} label="Gender" color="blue">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
          </Select>
          <Inpt onChange={(e) => setEmailAddress(e.target.value)} label="Email Address" />
          <Inpt onChange={(e) => {
            let input = e.target.value.replace(/\D/g, '')
            if (input.length > 11) {
              input = input.slice(0, 11)
            }
            let formattedNumber = input
            if (input.length > 4) {
              formattedNumber = `${input.slice(0, 4)}-${input.slice(4, 7)}`
              if (input.length > 7) {
                formattedNumber += `-${input.slice(7)}`
              }
            }
            setContactNumber(input)
            e.target.value = formattedNumber
          }} label="Contact Number" />
          <Select onChange={(val) => setRole(val)} label="Role" color="blue">
            <Option value="staff">Staff</Option>
            <Option value="cashier">Cashier</Option>
          </Select>
          <Select value={is_active} onChange={(val) => setIsActive(val)} label="Status" color="blue">
            <Option value={1}>Active</Option>
            <Option value={0}>Inactive</Option>
          </Select>
        </DialogBody>
        <DialogFooter className="space-x-3">
          <Btn label="Cancel" variant="text" onClick={handleOpen} disabled={btnLoading} />
          <Btn label="Save" color="blue" onClick={handleAddStaff} loading={btnLoading} />
        </DialogFooter>
      </Dialog>
    </>
  )
}

export default Staff