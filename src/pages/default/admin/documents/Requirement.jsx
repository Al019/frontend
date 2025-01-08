import { Badge, Button, ButtonGroup, Tab, Tabs, TabsHeader } from "@material-tailwind/react"
import { useEffect, useState } from "react"
import Tbl from "../../../../components/Table"
import { useNavigate, useParams } from 'react-router-dom'
import axios from "../../../../api/axios"
import LoadingScreen from "../../../../components/LoadingScreen"

const tabs = ['empty', 'review', 'confirm', 'resubmit']

const Requirement = () => {
  const [status, setStatus] = useState(tabs[0])
  const { id_number } = useParams()
  const [requirements, setRequirements] = useState([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    const getRequirement = async () => {
      await axios.get('/admin/get-requirement', {
        params: { id_number, status }
      })
        .then(({ data }) => {
          setRequirements(data.requirements)
          setCount(data.counts)
        })
        .finally(() => {
          setLoading(false)
        })
    }
    getRequirement()
  }, [id_number, status])

  const data = {
    theads: [
      "Document Name",
      "Status"
    ],
    tbodies: requirements
  }

  const handleNavigate = (id) => {
    navigate(`/registrar/admin/documents/records/${id_number}/${id}`)
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
                {tab === 'empty' && 'Pending' || tab === 'review' && 'To Review' || tab === 'confirm' && 'Confirmed' || tab === 'resubmit' && 'Resubmit'}
              </Tab>
            </Badge>
          ))}
        </TabsHeader>
      </Tabs>
      <Tbl title="Requirements" data={data} idKey="id" onClickView={handleNavigate} />
    </div>
  )
}

export default Requirement