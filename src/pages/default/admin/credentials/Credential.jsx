import { PlusIcon } from "@heroicons/react/24/outline"
import Btn from "../../../../components/Button"
import Tbl from "../../../../components/Table"
import { Dialog, DialogBody, DialogFooter, DialogHeader, Option, Select, Switch } from "@material-tailwind/react"
import { useEffect, useState } from "react"
import Inpt from "../../../../components/Input"
import axios from "../../../../api/axios"
import LoadingScreen from "../../../../components/LoadingScreen"

const Credential = () => {
  const [open, setOpen] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [purposes, setPurposes] = useState([])
  const [loading, setLoading] = useState(true)
  const [credential, setCredential] = useState("")
  const [amount, setAmount] = useState("")
  const [count_day, setCountDay] = useState("")
  const [onPage, setOnPage] = useState(0)
  const [link, setLink] = useState(null)
  const [selectedCredential, setSelectedCredential] = useState(null)
  const [btnLoading, setBtnLoading] = useState(false)
  const [credentials, setCredentials] = useState([])
  const [links, setLinks] = useState([])

  const handleOpen = () => {
    if (!btnLoading) {
      setOpen(!open)
      setToggle(false)
      setCredential("")
      setAmount("")
      setCountDay("")
      setOnPage(0)
      setLink(null)
      setSelectedCredential(null)
      getLink()
    }
  }

  useEffect(() => {
    const loadCredentialPurpose = async () => {
      await getCredential()
      await getPurpose()
      await getLink()
      setLoading(false)
    }
    loadCredentialPurpose()
  }, [])

  const getCredential = async () => {
    await axios.get('/credential/get-credential')
      .then(({ data }) => {
        const formattedCredentials = data.map((credential) => ({
          id: credential.id,
          credential_name: credential.credential_name,
          amount: credential.amount,
          count_day: credential.count_day,
          on_page: credential.on_page
        }))
        setCredentials(formattedCredentials)
      })
  }

  const getPurpose = async () => {
    await axios.get('/credential/get-purpose')
      .then(({ data }) => {
        setPurposes(data)
      })
  }

  const getLink = async () => {
    await axios.get('/credential/get-link')
      .then(({ data }) => {
        setLinks(data)
      })
  }

  const handleCreateCredential = async () => {
    setBtnLoading(true)
    await axios.post('/credential/create-credential', { credential_name: credential, amount, on_page: onPage, count_day, purpose_id: link })
      .then(() => {
        handleOpen()
        getCredential()
        getLink()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const handleEditCredential = async () => {
    setBtnLoading(true)
    await axios.post('/credential/edit-credential', { id: selectedCredential.id, credential_name: selectedCredential.credential_name, amount: selectedCredential.amount, on_page: selectedCredential.on_page, count_day: selectedCredential.count_day, purpose_id: link })
      .then(() => {
        handleOpen()
        getCredential()
        getLink()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const handleSelectedCredential = (credential) => {
    setSelectedCredential(credential)
    setOpen(!open)
  }

  const data = {
    theads: [
      "Name",
      "Amount"
    ],
    tbodies: credentials
  }

  if (loading) {
    return <LoadingScreen className="left-[288px]" />
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-end">
          <Btn onClick={handleOpen} label="Create" size="sm" color="green" variant="outlined" icon={<PlusIcon className="w-4 h-4" />} />
        </div>
        <Tbl title="Credentials" data={data} onClickEdit={handleSelectedCredential} />
      </div>

      <Dialog size="xs" open={open} handler={handleOpen}>
        <DialogHeader className="text-lg">
          {selectedCredential ? "Edit Credential" : "Create Credential"}
        </DialogHeader>
        <DialogBody className="space-y-4">
          <Inpt value={selectedCredential?.credential_name} onChange={(e) => {
            selectedCredential ? setSelectedCredential({ ...selectedCredential, credential_name: e.target.value }) : setCredential(e.target.value)
          }} label="Name" />
          <Inpt value={selectedCredential?.amount} onChange={(e) => {
            selectedCredential ? setSelectedCredential({ ...selectedCredential, amount: e.target.value }) : setAmount(e.target.value)
          }} label="Amount" type="number" />
          <Inpt value={selectedCredential?.count_day} onChange={(e) => {
            selectedCredential ? setSelectedCredential({ ...selectedCredential, count_day: e.target.value }) : setCountDay(e.target.value)
          }} label="Count Day" type="number" placeholder="Estimated working days" />
          <div className='flex justify-end'>
            <span onClick={() => setToggle(!toggle)} className='text-sm font-normal text-blue-500 cursor-pointer hover:underline'>
              {!toggle ? "Show Settings" : "Less Settings"}
            </span>
          </div>
          {toggle && (
            <div className="space-y-4">
              <Switch onChange={() => { selectedCredential ? setSelectedCredential({ ...selectedCredential, on_page: selectedCredential.on_page === 0 ? 1 : 0 }) : setOnPage(onPage === 0 ? 1 : 0) }} label={`Editable Page: ${selectedCredential ? selectedCredential.on_page === 0 ? 'Off' : 'On' : onPage === 0 ? 'Off' : 'On'}`} checked={selectedCredential ? selectedCredential.on_page === 0 ? false : true : null} color="blue" labelProps={{ className: 'text-sm text-gray-800 font-normal' }} />
              <div className='space-y-2'>
                <div className='flex justify-end'>
                  <span onClick={() => {
                    selectedCredential
                      ? setLinks([])
                      : setLink(null)
                  }} className='text-sm font-normal text-blue-500 hover:underline cursor-pointer'>Clear</span>
                </div>
                <Select value={
                  selectedCredential
                    ? links.find(link => link.credential_id === selectedCredential.id)?.purpose_id
                    : link
                } onChange={(val) => setLink(val)} label="Link Purpose" color="blue">
                  {purposes.map((purpose, index) => (
                    <Option key={index} value={purpose.id}>{purpose.purpose_name}</Option>
                  ))}
                </Select>
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter className="space-x-3">
          <Btn onClick={handleOpen} label="Cancel" variant="text" disabled={btnLoading} />
          <Btn onClick={selectedCredential ? handleEditCredential : handleCreateCredential} loading={btnLoading} label={selectedCredential ? "Update" : "Save"} color="blue" />
        </DialogFooter>
      </Dialog>
    </>
  )
}

export default Credential