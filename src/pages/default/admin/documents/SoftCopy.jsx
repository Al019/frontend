import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Breadcrumbs, Button, Card, CardBody, CardHeader, Dialog, DialogBody, DialogFooter, DialogHeader, Radio, Textarea } from '@material-tailwind/react'
import LightGallery from 'lightgallery/react'
import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'
import lgThumbnail from 'lightgallery/plugins/thumbnail'
import lgZoom from 'lightgallery/plugins/zoom'
import axios from '../../../../api/axios'
import Btn from '../../../../components/Button'
import { ConfirmationDialog } from '../../../../components/Dialog'
import LoadingScreen from '../../../../components/LoadingScreen'

const reasons = ['Photocopy', 'Inconsistent entries', 'Others']

const url = "http://192.168.12.197:8000/"

const SoftCopy = () => {
  const { id_number, document_id } = useParams()
  const [submit, setSubmit] = useState({})
  const [open, setOpen] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  const [isOpen, setIsOpen] = useState(false)
  const [value, setValue] = useState(reasons[0])
  const [others, setOthers] = useState(null)

  const handleOpen = () => {
    setOpen(!open)
  }

  useEffect(() => {
    const loadSoftCopy = async () => {
      await getSoftCopy()
      setLoading(false)
    }
    loadSoftCopy()
  }, [])

  const getSoftCopy = async () => {
    await axios.get('/admin/get-softcopy', {
      params: { id_number, document_id }
    })
      .then(({ data }) => {
        setSubmit(data)
      })
  }

  const handleConfirm = async () => {
    setBtnLoading(true)
    await axios.post('/admin/confirm-submit', { submit_id: submit.soft_copy?.id, id_number })
      .then(() => {
        handleOpen()
        getSoftCopy()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const handleDecline = async () => {
    setBtnLoading(true)
    await axios.post('/admin/decline-submit', { submit_id: submit.soft_copy?.id, message: value, others, id_number })
      .then(() => {
        setIsOpen(false)
        getSoftCopy()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  if (loading) {
    return <LoadingScreen className="left-[288px]" />
  }

  return (
    <>
      <div className='space-y-6'>
        {submit.soft_copy?.submit_status === 'review' && (
          <div className='flex justify-end'>
            <div className="flex items-center gap-3">
              <Btn onClick={() => setIsOpen(!isOpen)} label="Re Submit" size="sm" color="red" variant="outlined" />
              <Btn onClick={() => setOpen(!open)} label="Confirm" size="sm" color="green" />
            </div>
          </div>
        )}
        <div className='space-y-4'>
          <Card>
            <CardHeader floated={false} shadow={false} className={`p-4 m-0 flex items-center justify-between font-medium text-white rounded-b-none ${submit.soft_copy?.submit_status === 'confirm' && 'bg-green-500' || submit.soft_copy?.submit_status === 'review' && 'bg-orange-500' || submit.soft_copy?.submit_status === 'resubmit' && 'bg-red-500'}`}>
              <span className='capitalize text-sm'>{submit.soft_copy?.submit_status === 'confirm' && 'Confirmed' || submit.soft_copy?.submit_status === 'review' && 'To Review' || submit.soft_copy?.submit_status === 'resubmit' && 'Resubmit'}</span>
            </CardHeader>
            <CardBody className="flex items-center justify-between text-sm">
              <span>Date Submitted: {formatDate(submit.soft_copy?.created_at)}</span>
              {submit.soft_copy?.submit_status === 'confirm' && (
                <span>Date Confirmed: {formatDate(submit.soft_copy?.updated_at)}</span>
              )}
            </CardBody>
          </Card>
          {submit.soft_copy?.submit_status === 'resubmit' && (
            <Card className='flex-1 text-sm h-fit'>
              <CardHeader floated={false} shadow={false} className="m-0 px-4 pt-4 font-medium">
                <span>Reason</span>
              </CardHeader>
              <CardBody className='py-4'>
                <span>{submit.soft_copy?.submit_message}</span>
              </CardBody>
            </Card>
          )}
          <Card>
            <CardHeader floated={false} shadow={false} className='p-4 m-0 flex justify-end'>
              <Btn label="View PDF" size="sm" color="red" variant="outlined" />
            </CardHeader>
            <CardBody>
              <LightGallery
                speed={500}
                plugins={[lgThumbnail, lgZoom]}
                elementClassNames={'grid grid-cols-4 gap-4'}
              >
                {submit.soft_copy?.record.map((copy) => (
                  <a href={url + copy.uri}>
                    <img src={url + copy.uri} className="object-cover h-72 w-full rounded-xl" />
                  </a>
                ))}
              </LightGallery>
            </CardBody>
          </Card>
        </div>
      </div>

      <ConfirmationDialog open={open} color={'text-green-500'} label={'Confirm?'} handleOpen={handleOpen} onClick={handleConfirm} loading={btnLoading} />

      <Dialog size='xs' open={isOpen} dismiss={false}>
        <DialogHeader className='text-lg'>
          Confirmation Alert!
        </DialogHeader>
        <DialogBody className='space-y-6'>
          <span className='text-sm font-normal text-gray-800'>Are you sure you want to <span className="capitalize font-medium text-red-500">Decline?</span></span>
          <div>
            <span className='text-sm font-normal text-gray-800'>Choose a reason:</span>
            <div className='grid grid-cols-1'>
              {reasons.map((reason, index) => (
                <Radio color='blue' key={index} name="radio" label={<span className='text-sm font-normal text-gray-800'>{reason}</span>} value={reason} checked={value === reason} onChange={(e) => {
                  setValue(e.target.value)
                  setOthers(null)
                }} />
              ))}
            </div>
            {reasons[2] === value && (
              <Textarea color='blue' label='Type a reason' onChange={(e) => setOthers(e.target.value)} />
            )}
          </div>
        </DialogBody>
        <DialogFooter className="space-x-3">
          <Button variant="text" onClick={() => setIsOpen(!isOpen)} className="mr-1" disabled={btnLoading}>
            <span>Cancel</span>
          </Button>
          <Button onClick={handleDecline} loading={btnLoading} color='blue'>
            <span>Submit</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}

export default SoftCopy