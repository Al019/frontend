import { Badge, Option, Select, Tab, Tabs, TabsHeader } from "@material-tailwind/react"
import Tbl from "../../../../components/Table"
import { useEffect, useState } from "react"
import axios from "../../../../api/axios"
import LoadingScreen from "../../../../components/LoadingScreen"
import { useNavigate } from "react-router-dom"

const tabs = ['review', 'pay', 'process', 'receive']

const Request = () => {
  const [status, setStatus] = useState(tabs[0])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  const [count, setCount] = useState({})
  const navigate = useNavigate()
  const [selected, setSelected] = useState("all")

  useEffect(() => {
    const getRequest = async () => {
      await axios.get('/admin/get-credential-request', {
        params: { status, selected }
      })
        .then(({ data }) => {
          const formattedRequests = data.requests.map((request) => ({
            id: request.id,
            request_number: request.request_number,
            student_name: `${request.student.information.last_name}, ${request.student.information.first_name}`,
            credential_name: request.request_credential.credential.credential_name,
            date_requested: formatDate(request.created_at)
          }))
          setRequests(formattedRequests)
          setCount(data.counts)
        })
        .finally(() => {
          setLoading(false)
        })
    }
    getRequest()
  }, [status, selected])

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
    navigate(`/registrar/admin/credentials/requests/${request_number}`)
  }

  if (loading) {
    return <LoadingScreen className="left-[288px]" />
  }

  return (
    <div className="space-y-6">
      <Tabs value={tabs[0]} className="pt-2">
        <TabsHeader className="w-fit space-x-4 bg-transparent">
          {tabs.map((tab, index) => (
            <Badge key={index} content={count[tab]} className={`z-50 ${count[tab] <= 0 && 'hidden'}`}>
              <Tab value={tab} onClick={() => setStatus(tab)} className="text-sm whitespace-nowrap capitalize">
                {tab === 'review' && 'To Review' || tab === 'pay' && 'To Pay' || tab === 'process' && 'In Process' || tab === 'receive' && 'To Receive'}
              </Tab>
            </Badge>
          ))}
        </TabsHeader>
      </Tabs>
      {status === 'pay' && (
        <div className="w-fit">
          <Select value={selected} onChange={(val) => setSelected(val)} label="Select Status" color="blue">
            <Option value="all">All</Option>
            <Option value="pending">Pending</Option>
            <Option value="paid">Paid</Option>
          </Select>
        </div>
      )}
      <Tbl title="Requests" data={data} idKey="request_number" onClickView={handleNavigate} />
    </div>
  )
}

export default Request