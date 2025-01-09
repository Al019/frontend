import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../../../../api/axios'
import LoadingScreen from '../../../../components/LoadingScreen'
import Tbl from '../../../../components/Table'

const Request = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

  useEffect(() => {
    const getRequest = async () => {
      await axios.get('/cashier/get-credential-request')
        .then(({ data }) => {
          const formattedRequests = data.map((request) => ({
            id: request.id,
            request_number: request.request_number,
            student_name: `${request.student.information.last_name}, ${request.student.information.first_name}`,
            credential_name: request.request_credential.credential.credential_name,
            date_requested: formatDate(request.created_at)
          }))
          setRequests(formattedRequests)
        })
        .finally(() => {
          setLoading(false)
        })
    }
    getRequest()
  }, [])

  const data = {
    theads: [
      "Request Number",
      "Student Name",
      "Credential Name",
      "Date Requested"
    ],
    tbodies: requests
  }

  const handleNavigate = (request_number) => {
    navigate(`/registrar/cashier/credentials/requests/${request_number}`)
  }

  if (loading) {
    return <LoadingScreen className="left-[288px]" />
  }

  return (
    <Tbl title="Requests" data={data} idKey="request_number" onClickView={handleNavigate} />
  )
}

export default Request