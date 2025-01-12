import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { HomeIcon } from '@heroicons/react/24/solid'
import { Alert, Breadcrumbs, Button, Card, CardBody, CardHeader, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Radio, Textarea } from '@material-tailwind/react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from '../../../../api/axios'
import { ConfirmationDialog } from '../../../../components/Dialog'
import LoadingScreen from '../../../../components/LoadingScreen'
import Btn from '../../../../components/Button'
import Inpt from '../../../../components/Input'

const reasons = ['Existing balance', 'Already transferred to other school', 'Others']

const RequestDetail = () => {
  const [request, setRequest] = useState({})
  const navigate = useNavigate()
  const { request_number } = useParams()
  const [page, setPage] = useState(null)
  const [pageToggle, setPageToggle] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dialog, setDialog] = useState(null)
  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  const formatDateTime = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })
  const [value, setValue] = useState(reasons[0])
  const [others, setOthers] = useState(null)
  const [errors, setErrors] = useState([])
  const [password, setPassword] = useState("")
  const [isOpenCancel, setIsOpenCancel] = useState(false)
  const [openCancel, setOpenCancel] = useState(false)

  const handleOpen = () => {
    setOpen(!open)
    setDialog(null)
    setErrors([])
  }

  useEffect(() => {
    const loadRequest = async () => {
      await getRequest()
      setLoading(false)
    }
    loadRequest()
  }, [request_number])

  const getRequest = async () => {
    await axios.get('/admin/get-request-detail', {
      params: { request_number }
    })
      .then(({ data }) => {
        setRequest(data)
      })
  }

  const calculateAmount = () => {
    const reqCred = request.request_credential
    const credentialAmount = parseFloat(reqCred?.price)
    const page = parseInt(reqCred?.page)

    const totalAmount = reqCred?.credential_purpose.reduce((subTotal, purpose) => {
      const copy = parseInt(purpose.copy)

      return subTotal + credentialAmount * copy * page
    }, 0)

    return totalAmount
  }

  const calculateEstimatedFinishDate = (startDate, workingDays) => {
    let daysAdded = 0
    let currentDate = new Date(startDate)

    while (daysAdded < workingDays) {
      currentDate.setDate(currentDate.getDate() + 1)

      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        daysAdded++
      }
    }

    return currentDate
  }

  const handleEditPage = async () => {
    setBtnLoading(true)
    await axios.post('/admin/edit-page', { id: request.request_credential?.id, page })
      .then(() => {
        setPageToggle(!pageToggle)
        setPage(null)
        getRequest()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const handleConfirm = async () => {
    setErrors([])
    setBtnLoading(true)
    await axios.post('/admin/request-confirm', { id: request.id, user_id: request.student.user_id })
      .then(() => {
        handleOpen()
        getRequest()
      })
      .catch((error) => {
        setErrors(error.response.data.errors)
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const handleDecline = async () => {
    setBtnLoading(true)
    await axios.post('/admin/request-decline', { id: request.id, message: value, credential_id: request.request_credential?.credential.id, student_id: request.student?.id, others, user_id: request.student.user_id })
      .then(() => {
        setIsOpen(!isOpen)
        getRequest()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const handleProcess = async () => {
    setBtnLoading(true)
    await axios.post('/admin/request-process', { id: request.id, user_id: request.student.user_id })
      .then(() => {
        handleOpen()
        getRequest()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const handleFinish = async () => {
    setBtnLoading(true)
    await axios.post('/admin/request-finish', { id: request.id, user_id: request.student.user_id })
      .then(() => {
        handleOpen()
        getRequest()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const handleRelease = async () => {
    setBtnLoading(true)
    await axios.post('/admin/request-release', { id: request.id, user_id: request.student.user_id })
      .then(() => {
        handleOpen()
        getRequest()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const handleCancel = async () => {
    setErrors([])
    setBtnLoading(true)
    await axios.post('/admin/cancel-request', { id: request.id, credential_id: request.request_credential?.credential.id, student_id: request.student_id, password, user_id: request.student.user_id })
      .then(() => {
        setOpenCancel(false)
        getRequest()
      })
      .catch((error) => {
        setErrors(error.response.data.errors)
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
        <div className='flex justify-end'>
          {(request.request_status === 'pay' && !request.payment) && (
            <Btn label="Cancel Request" onClick={() => setIsOpenCancel(!isOpenCancel)} size="sm" variant='outlined' />
          )}
          {request.request_status === 'review' && (
            <div className="flex items-center gap-3">
              <Btn label="Decline" onClick={() => setIsOpen(!isOpen)} size="sm" variant="outlined" />
              <Btn label="Confirm" onClick={() => {
                setDialog('confirm')
                setOpen(!open)
              }} size="sm" color='blue' />
            </div>
          )}
          {(request.request_status === 'pay' && request.payment) && (
            <Btn label="Process" onClick={() => {
              setDialog('process')
              setOpen(!open)
            }} size="sm" color='blue' />
          )}
          {request.request_status === 'process' && (
            <Btn label="Finish" onClick={() => {
              setDialog('finish')
              setOpen(!open)
            }} size="sm" color='blue' />
          )}
          {(request.request_status === 'receive' && request.request_credential.reqcred_status === 'claim') && (
            <Btn label="Release" onClick={() => {
              setDialog('release')
              setOpen(!open)
            }} size="sm" color='blue' />
          )}
        </div>
        <div className='space-y-4'>
          <Card className='text-sm'>
            <CardHeader floated={false} shadow={false} className={`p-4 m-0 font-medium text-white rounded-b-none flex items-center justify-between ${request.request_status === 'review' && 'bg-orange-500' || request.request_status === 'pay' && 'bg-deep-orange-500' || request.request_status === 'process' && 'bg-cyan-500' || request.request_status === 'receive' && 'bg-indigo-500' || request.request_status === 'complete' && 'bg-green-500' || request.request_status === 'cancel' && 'bg-red-500'}`}>
              <span>Request Number: {request.request_number}</span>
              <span className="capitalize">{request.request_status === 'review' && 'To Review' || request.request_status === 'pay' && 'To Pay' || request.request_status === 'process' && 'In Process' || request.request_status === 'receive' && 'To Receive' || request.request_status === 'complete' && 'Completed' || request.request_status === 'cancel' && 'Cancelled'}</span>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="flex items-center justify-between">
                <span>Date Requested: {formatDate(request.created_at)}</span>
                {request.request_status === 'complete' && (
                  <span>Date Completed: {formatDate(request.updated_at)}</span>
                )}
                {request.request_status === 'cancel' && (
                  <span>Date Cancelled: {formatDate(request.updated_at)}</span>
                )}
              </div>
              <div className="grid grid-cols-3">
                <span>Name: {request.student?.information.last_name}, {request.student?.information.first_name} {request.student?.information.middle_name}</span>
                <span>Course: {request.student?.course}</span>
                <span>Email Address: {request.student?.information.email_address}</span>
              </div>
            </CardBody>
          </Card>
          <div className="flex gap-4">
            <div className='flex-1 space-y-4'>
              {request.request_status === 'process' && (
                <Card className='flex-1 text-sm h-fit'>
                  <CardHeader floated={false} shadow={false} className="m-0 px-4 pt-4 font-medium">
                    <span>Estimated Finish Date</span>
                  </CardHeader>
                  <CardBody className='flex items-center justify-between py-4'>
                    <span>{formatDate(calculateEstimatedFinishDate(request.updated_at, parseInt(request.request_credential?.credential.count_day)))}</span>
                  </CardBody>
                </Card>
              )}
              <Card className="flex-1 text-sm h-fit">
                <CardHeader floated={false} shadow={false} className="m-0 px-4 pt-4 font-medium">
                  <span>Requested Credential</span>
                </CardHeader>
                <CardBody className='py-4 flex items-center justify-between'>
                  <div className='flex flex-col space-y-1'>
                    <span>{request.request_credential?.credential.credential_name}</span>
                    <span>₱ {request.request_credential?.price}</span>
                  </div>
                  <div className='flex items-center space-x-4'>
                    {pageToggle ? (
                      <div className='space-x-2'>
                        <span onClick={() => {
                          setPageToggle(!pageToggle)
                          setPage(null)
                        }} className={`text-red-500 hover:underline cursor-pointer ${btnLoading && 'hidden'}`}>Cancel</span>
                        <span onClick={handleEditPage} className='text-blue-500 hover:underline cursor-pointer'>
                          {btnLoading ? 'Saving' : 'Save'}
                        </span>
                      </div>
                    ) : (
                      <span onClick={() => {
                        setPageToggle(!pageToggle)
                        setPage(request.request_credential?.page)
                      }} className={`text-blue-500 hover:underline cursor-pointer ${(request.request_credential?.credential.on_page === 0 || request.request_status !== 'review') && 'hidden'}`}>Edit</span>
                    )}
                    <div className='space-x-1'>
                      <span>Page/s:</span>
                      {pageToggle ? (
                        <input value={page} onChange={(e) => {
                          const value = e.target.value
                          if (/^(?:[1-9][0-9]?)?$/.test(value)) {
                            setPage(value)
                          }
                        }} className="ring-1 w-12 px-1 text-sm rounded" maxLength="2" />
                      ) : (
                        <span>{request.request_credential?.page}</span>
                      )}
                    </div>
                  </div>
                </CardBody>
                <CardHeader floated={false} shadow={false} className="m-0 px-4 pt-4 font-medium">
                  <span>Selected Purpose/s</span>
                </CardHeader>
                <CardBody className='pt-4 space-y-4'>
                  {request.request_credential?.credential_purpose.map((credPurpose, index) => (
                    <div className='flex items-center'>
                      <span className='w-6'>{index + 1}</span>
                      <div className='flex flex-col space-y-1'>
                        <span>{credPurpose.purpose.purpose_name}</span>
                        <div className='space-x-1'>
                          <span>Copy/s:</span>
                          <span>{credPurpose.copy}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardBody>
              </Card>
              {request.request_status === 'cancel' && (
                <Card className='flex-1 text-sm h-fit'>
                  <CardHeader floated={false} shadow={false} className="m-0 px-4 pt-4 font-medium">
                    <span>Reason</span>
                  </CardHeader>
                  <CardBody className='py-4'>
                    <span>{request.request_message}</span>
                  </CardBody>
                </Card>
              )}
            </div>
            <Card className="flex-1 text-sm h-fit">
              <CardHeader floated={false} shadow={false} className="m-0 px-4 pt-4 font-medium flex items-center justify-between">
                <span>Payment</span>
                {(request.request_status !== 'review' && request.request_status !== 'cancel') && (
                  <span className={request.payment ? 'text-green-500' : 'text-orange-500'}>{request.payment ? 'Paid' : 'Pending'}</span>
                )}
              </CardHeader>
              <CardBody className='py-4 space-y-4'>
                {request.payment && (
                  <div className='flex items-center justify-between'>
                    <span>Date and Time:</span>
                    <span>{formatDateTime(request.payment?.created_at)}</span>
                  </div>
                )}
                {request.payment && (
                  <div className='flex items-center justify-between'>
                    <span>OR Number:</span>
                    <span>{request.payment?.or_number}</span>
                  </div>
                )}
                <div className='flex items-center justify-between'>
                  <span>{request.request_status !== 'review' && request.request_status !== 'cancel' ? 'Total Pay:' : 'Total Amount:'}</span>
                  <span>₱ {calculateAmount()?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      <ConfirmationDialog errors={errors} open={open} color="text-green-500" label={dialog === 'confirm' && 'Confirm?' || dialog === 'process' && 'Process?' || dialog === 'finish' && 'Finish?' || dialog === 'release' && 'Release?'} handleOpen={handleOpen} loading={btnLoading} onClick={() => { dialog === 'confirm' && handleConfirm() || dialog === 'process' && handleProcess() || dialog === 'finish' && handleFinish() || dialog === 'release' && handleRelease() }} />

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
              <Textarea label='Type a reason' onChange={(e) => setOthers(e.target.value)} />
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

      <ConfirmationDialog open={isOpenCancel} color="text-red-500" label={'Cancel Request?'} handleOpen={() => setIsOpenCancel(!isOpenCancel)} loading={btnLoading} onClick={() => {
        setIsOpenCancel(!isOpenCancel)
        setOpenCancel(!openCancel)
      }} />

      <Dialog size='xs' open={openCancel} dismiss={false}>
        <DialogHeader className='text-lg'>
          Confirmation Alert!
        </DialogHeader>
        <DialogBody className='space-y-6'>
          {(errors.password || errors.message) && (
            <div className='space-y-3'>
              {errors.password && errors.password.map((error_message, index) => (
                <Alert key={index} variant="ghost" color="red">
                  <span className="text-xs">{error_message}</span>
                </Alert>
              ))}
              {errors.message && errors.message.map((error_message, index) => (
                <Alert key={index} variant="ghost" color="red">
                  <span className="text-xs">{error_message}</span>
                </Alert>
              ))}
            </div>
          )}
          <div className='space-y-2'>
            <span className='text-sm font-normal text-gray-800'>Please enter you password for verification.</span>
            <Inpt onChange={(e) => setPassword(e.target.value)} label="Password" secureTextEntry required />
          </div>
        </DialogBody>
        <DialogFooter className="space-x-3">
          <Button variant="text" onClick={() => {
            setErrors([])
            setOpenCancel(!openCancel)
            setPassword("")
          }} className="mr-1" disabled={btnLoading}>
            <span>Cancel</span>
          </Button>
          <Button onClick={handleCancel} loading={btnLoading} color='blue'>
            <span>Verify</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  )
}

export default RequestDetail