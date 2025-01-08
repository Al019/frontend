import { useEffect, useState } from "react"
import Btn from "../../../../components/Button"
import { PlusIcon } from "@heroicons/react/24/outline"
import Tbl from "../../../../components/Table"
import { Dialog, DialogBody, DialogFooter, DialogHeader } from "@material-tailwind/react"
import Inpt from "../../../../components/Input"
import axios from "../../../../api/axios"
import LoadingScreen from "../../../../components/LoadingScreen"

const Purpose = () => {
  const [open, setOpen] = useState(false)
  const [purpose, setPurpose] = useState("")
  const [btnLoading, setBtnLoading] = useState(false)
  const [purposes, setPurposes] = useState([])
  const [selectedPurpose, setSelectedPurpose] = useState(null)
  const [loading, setLoading] = useState(true)

  const handleOpen = () => {
    if (!btnLoading) {
      setOpen(!open)
      setPurpose("")
      setSelectedPurpose(null)
    }
  }

  useEffect(() => {
    const loadPurpose = async () => {
      await getPurpose()
      setLoading(false)
    }
    loadPurpose()
  }, [])

  const getPurpose = async () => {
    await axios.get('/credential/get-purpose')
      .then(({ data }) => {
        const formattedPurposes = data.map((purpose) => ({
          id: purpose.id,
          purpose_name: purpose.purpose_name
        }))
        setPurposes(formattedPurposes)
      })
  }

  const handleCreatePurpose = async () => {
    setBtnLoading(true)
    await axios.post('/credential/create-purpose', { purpose_name: purpose })
      .then(() => {
        handleOpen()
        getPurpose()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const handleEditPurpose = async () => {
    setBtnLoading(true)
    await axios.post('/credential/edit-purpose', { id: selectedPurpose.id, purpose_name: selectedPurpose.purpose_name })
      .then(() => {
        handleOpen()
        getPurpose()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const handleSelectedPurpose = (purpose) => {
    setSelectedPurpose(purpose)
    setOpen(!open)
  }

  const data = {
    theads: [
      "Name",
    ],
    tbodies: purposes
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
        <Tbl title="Purposes" data={data} onClickEdit={handleSelectedPurpose} />
      </div>

      <Dialog size="xs" open={open} handler={handleOpen}>
        <DialogHeader className="text-lg">
          {selectedPurpose ? "Edit Purpose" : "Create Purpose"}
        </DialogHeader>
        <DialogBody className="space-y-4">
          <Inpt value={selectedPurpose?.purpose_name} onChange={(e) => {
            selectedPurpose ? setSelectedPurpose({ ...selectedPurpose, purpose_name: e.target.value }) : setPurpose(e.target.value)
          }} label="Name" />
        </DialogBody>
        <DialogFooter className="space-x-3">
          <Btn onClick={handleOpen} label="Cancel" variant="text" disabled={btnLoading} />
          <Btn onClick={selectedPurpose ? handleEditPurpose : handleCreatePurpose} label={selectedPurpose ? "Update" : "Save"} color="blue" loading={btnLoading} />
        </DialogFooter>
      </Dialog>
    </>
  )
}

export default Purpose