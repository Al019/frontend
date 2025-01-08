import { CloudArrowDownIcon, CloudArrowUpIcon } from "@heroicons/react/24/outline"
import Btn from "../../../../components/Button"
import Tbl from "../../../../components/Table"
import { useEffect, useState } from "react"
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react"
import axios from "../../../../api/axios"
import { useNavigate } from "react-router-dom"
import LoadingScreen from "../../../../components/LoadingScreen"

const Student = () => {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [btnLoading, setBtnLoading] = useState(false)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const handleOpen = () => {
    if (!btnLoading) {
      setOpen(!open)
      setFile(null)
    }
  }

  useEffect(() => {
    const loadStudent = async () => {
      await getStudent()
    }
    loadStudent()
  }, [])

  const getStudent = async () => {
    await axios.get('/admin/get-student')
      .then(({ data }) => {
        const formattedStudents = data.map((student) => ({
          id: student.id,
          id_number: student.id_number,
          last_name: student.information.last_name,
          first_name: student.information.first_name,
          middle_name: student.information.middle_name,
          email_address: student.information.email_address,
        }))
        setStudents(formattedStudents)
      }).finally(() => {
        setLoading(false)
      })
  }

  const importFile = async () => {
    setBtnLoading(true)
    const formData = new FormData()
    formData.append('import_file', file)
    await axios.post('/admin/import-student', formData)
      .then(() => {
        handleOpen()
        getStudent()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const exportFile = async () => {
    setBtnLoading(true)
    await axios.get('/admin/export-student', { responseType: 'blob' })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'students.xlsx')
        document.body.appendChild(link)
        link.click()
        link.remove()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const data = {
    theads: [
      "ID Number",
      "Last Name",
      "First Name",
      "Middle Name",
      "Email Address"
    ],
    tbodies: students
  }

  const handleNavigate = (id_number) => {
    navigate(`/registrar/admin/students/${id_number}`)
  }

  if (loading) {
    return <LoadingScreen className="left-[288px]" />
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-end">
          <div className="flex items-center gap-3">
            <Btn onClick={exportFile} label="Export" size="sm" color="orange" variant="outlined" icon={<CloudArrowDownIcon className="w-4 h-4" />} loading={btnLoading} />
            <Btn onClick={handleOpen} label="Import" size="sm" color="blue" variant="outlined" icon={<CloudArrowUpIcon className="w-4 h-4" />} />
          </div>
        </div>
        <Tbl title="Students" data={data} idKey="id_number" onClickView={handleNavigate} />
      </div>

      <Dialog size="xs" open={open} handler={handleOpen}>
        <DialogHeader className="text-lg">Import Student</DialogHeader>
        <DialogBody>
          <Btn onClick={() => document.getElementById("file").click()} label={`Choose File ${file ? `| ${file.name}` : ''}`} icon={<CloudArrowUpIcon className="w-5 h-5" />} variant="outlined" color="blue" fullWidth />
          <input onChange={(e) => setFile(e.target.files[0])} id="file" type="file" hidden />
        </DialogBody>
        <DialogFooter className="space-x-3">
          <Btn label="Cancel" variant="text" onClick={handleOpen} disabled={btnLoading} />
          <Btn label="Save" color="blue" onClick={importFile} loading={btnLoading} />
        </DialogFooter>
      </Dialog>
    </>
  )
}

export default Student