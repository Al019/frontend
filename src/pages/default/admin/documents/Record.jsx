import Tbl from "../../../../components/Table"
import { Option, Select } from "@material-tailwind/react"
import { useEffect, useState } from "react"
import axios from "../../../../api/axios"
import LoadingScreen from "../../../../components/LoadingScreen"
import { useNavigate } from "react-router-dom"

const Record = () => {
  const [status, setStatus] = useState("complete")
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const getRecord = async () => {
      await axios.get('/admin/get-record', {
        params: { status }
      })
        .then(({ data }) => {
          const formattedRecords = data.map((record) => ({
            id: record.id,
            id_number: record.id_number,
            last_name: record.information.last_name,
            first_name: record.information.first_name,
            middle_name: record.information.middle_name,
            email_address: record.information.email_address,
          }))
          setRecords(formattedRecords)
        })
        .finally(() => {
          setLoading(false)
        })
    }
    getRecord()
  }, [status])

  const data = {
    theads: [
      "ID Number",
      "Last Name",
      "First Name",
      "Middle Name",
      "Email Address"
    ],
    tbodies: records
  }

  const handleNavigate = (id_number) => {
    navigate(`/registrar/admin/documents/records/${id_number}`)
  }

  if (loading) {
    return <LoadingScreen className="left-[288px]" />
  }

  return (
    <div className="space-y-6">
      <div className="w-fit">
        <Select value={status} onChange={(val) => setStatus(val)} label="Status" color="blue">
          <Option value="complete">Completed</Option>
          <Option value="incomplete">Incomplete</Option>
        </Select>
      </div>
      <Tbl title="Records" data={data} idKey="id_number" onClickView={handleNavigate} />
    </div>
  )
}

export default Record