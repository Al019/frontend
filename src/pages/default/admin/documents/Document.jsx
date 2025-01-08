import { PlusIcon } from "@heroicons/react/24/outline"
import Btn from "../../../../components/Button"
import Tbl from "../../../../components/Table"
import { useEffect, useState } from "react"
import { Checkbox, Dialog, DialogBody, DialogFooter, DialogHeader, Option, Select } from "@material-tailwind/react"
import Inpt from "../../../../components/Input"
import axios from "../../../../api/axios"
import LoadingScreen from "../../../../components/LoadingScreen"

const Document = () => {
  const [open, setOpen] = useState(false)
  const [studentTypes, setStudentTypes] = useState([])
  const [document, setDocument] = useState("")
  const [types, setTypes] = useState({})
  const [selectAll, setSelectAll] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [documents, setDocuments] = useState([])
  const [document_type, setDocumentType] = useState("")
  const [loading, setLoading] = useState(true)
  const [selectedDocument, setSelectedDocument] = useState(null)

  const handleOpen = () => {
    if (!btnLoading) {
      setOpen(!open)
      setDocument("")
      setTypes({})
      setSelectAll(false)
      setSelectedDocument(null)
    }
  }

  useEffect(() => {
    const loadDocument = async () => {
      try {
        if (document_type) {
          await getDocument()
        } else {
          await getType()
        }
      } finally {
        setLoading(false)
      }
    }
    loadDocument()
  }, [document_type])

  const getType = async () => {
    await axios.get('/document/get-student-type')
      .then(({ data }) => {
        setStudentTypes(data)
        setDocumentType(data[0].student_type)
      })
  }

  const getDocument = async () => {
    await axios.get('/document/get-document', {
      params: { document_type }
    })
      .then(({ data }) => {
        const formattedDocuments = data.map((document) => ({
          id: document.id,
          document_name: document.document_name,
          document_type: document.document_type
        }))
        setDocuments(formattedDocuments)
      })
  }

  const handleCheckbox = (studentType) => {
    if (studentType === 'all') {
      const newSelectAll = !selectAll
      setSelectAll(newSelectAll)

      const updatedTypes = studentTypes.reduce((acc, curr) => {
        acc[curr.student_type] = newSelectAll
        return acc
      }, {})

      setTypes(updatedTypes)
    } else {
      setTypes((prev) => {
        const newState = { ...prev, [studentType]: !prev[studentType] }
        const allChecked = studentTypes.every(({ student_type }) => newState[student_type])
        setSelectAll(allChecked)
        return newState
      })
    }
  }

  const handleCreateDocument = async () => {
    setBtnLoading(true)
    const selectedType = Object.keys(types).filter(id => types[id])
    await axios.post('/document/create-document', { document_name: document, document_type: selectedType })
      .then(() => {
        handleOpen()
        getDocument()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const handleEditDocument = async () => {
    setBtnLoading(true)
    await axios.post('/document/edit-document', { id: selectedDocument.id, document_name: selectedDocument.document_name, document_type: selectedDocument.document_type })
      .then(() => {
        handleOpen()
        getDocument()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const handleSelectedDocument = (document) => {
    setSelectedDocument(document)
    setOpen(!open)
  }

  const data = {
    theads: [
      "Name",
      "Type"
    ],
    tbodies: documents
  }

  if (loading) {
    return <LoadingScreen className="left-[288px]" />
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="w-fit">
            {studentTypes.length > 0 && (
              <Select value={document_type} onChange={(val) => setDocumentType(val)} label="Document Type" color="blue">
                {studentTypes.map((type, index) => (
                  <Option value={type.student_type} key={index}>{type.student_type}</Option>
                ))}
              </Select>
            )}
          </div>
          <Btn onClick={handleOpen} label="Create" size="sm" color="green" variant="outlined" icon={<PlusIcon className="w-4 h-4" />} />
        </div>
        <Tbl title="Documents" data={data} onClickEdit={handleSelectedDocument} />
      </div>

      <Dialog size="xs" open={open} handler={handleOpen}>
        <DialogHeader className="text-lg">
          {selectedDocument ? "Edit Document" : "Create Document"}
        </DialogHeader>
        <DialogBody className="space-y-4">
          <Inpt value={selectedDocument?.document_name} onChange={(e) => {
            selectedDocument ? setSelectedDocument({ ...selectedDocument, document_name: e.target.value }) : setDocument(e.target.value)
          }} label="Name" />
          {selectedDocument ? (
            <div className='flex items-center justify-between'>
              <span className='text-sm font-normal text-gray-800'>Student Type: {selectedDocument.document_type}</span>
            </div>
          ) : (
            <div>
              <span className="text-sm font-normal text-gray-800">Select Document Type</span>
              <div className="grid grid-cols-2">
                <Checkbox
                  onClick={() => handleCheckbox('all')}
                  checked={selectAll}
                  label="Select All"
                  labelProps={{ className: "text-sm text-gray-800 font-normal" }}
                  color='blue'
                />
                {studentTypes.map((studType, index) => (
                  <Checkbox
                    onClick={() => handleCheckbox(studType.student_type)}
                    key={index}
                    checked={!!types[studType.student_type]}
                    label={studType.student_type}
                    labelProps={{ className: "text-sm text-gray-800 font-normal" }}
                    color='blue'
                  />
                ))}
              </div>
            </div>
          )}
        </DialogBody>
        <DialogFooter className="space-x-3">
          <Btn label="Cancel" variant="text" onClick={handleOpen} disabled={btnLoading} />
          <Btn label={selectedDocument ? "Update" : "Save"} color="blue" onClick={selectedDocument ? handleEditDocument : handleCreateDocument} loading={btnLoading} />
        </DialogFooter>
      </Dialog>
    </>
  )
}

export default Document