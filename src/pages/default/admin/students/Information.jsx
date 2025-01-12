import { NewspaperIcon, PencilSquareIcon, UserIcon } from "@heroicons/react/24/outline"
import { Card, CardBody, List, ListItem, ListItemPrefix } from "@material-tailwind/react"
import User from '../../../../assets/images/user.png'
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "../../../../api/axios"
import LoadingScreen from "../../../../components/LoadingScreen"

const Information = () => {
  const { id_number } = useParams()
  const [student, setStudent] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStudent = async () => {
      await getStudent()
      setLoading(false)
    }
    loadStudent()
  }, [])

  const getStudent = async () => {
    await axios.get('/admin/get-student-information', {
      params: { id_number }
    })
      .then(({ data }) => {
        setStudent(data)
      })
  }

  if (loading) {
    return <LoadingScreen className="left-[288px]" />
  }

  return (
    <div className='flex gap-4'>
      <Card className='sticky top-4 min-w-[272px] p-2 h-fit'>
        <List>
          <ListItem>
            <ListItemPrefix>
              <UserIcon className="h-5 w-5" />
            </ListItemPrefix>
            <span className='mr-auto text-sm font-normal'>Personal Details</span>
          </ListItem>
          <ListItem>
            <ListItemPrefix>
              <NewspaperIcon className="h-5 w-5" />
            </ListItemPrefix>
            <span className='mr-auto text-sm font-normal'>Request History</span>
          </ListItem>
        </List>
      </Card>
      <div className='flex-1 space-y-4'>
        <Card className='h-fit'>
          <CardBody className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <img src={User} className="h-24 w-24" />
              <div className='flex flex-col'>
                <span className='text-base font-semibold'>{student.information?.first_name} {student.information?.last_name}</span>
                <span className='text-sm font-medium capitalize'>Student</span>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card className='h-fit'>
          <CardBody className='space-y-6'>
            <span className="font-medium text-sm">Personal Details</span>
            <div className='grid grid-cols-3 gap-10'>
              <div className="flex flex-col space-y-2 border-b border-gray-400 pb-2">
                <span className="text-xs font-medium">Last Name</span>
                <span className='text-sm'>{student.information?.last_name}</span>
              </div>
              <div className="flex flex-col space-y-2 border-b border-gray-400 pb-2">
                <span className="text-xs font-medium">First Name</span>
                <span className='text-sm'>{student.information?.first_name}</span>
              </div>
              <div className="flex flex-col space-y-2 border-b border-gray-400 pb-2">
                <span className="text-xs font-medium">Middle Name</span>
                <span className='text-sm'>{student.information?.middle_name ? student.information?.middle_name : '-'}</span>
              </div>
              <div className="flex flex-col space-y-2 border-b border-gray-400 pb-2">
                <span className="text-xs font-medium">Gender</span>
                <span className='text-sm capitalize'>{student.information?.gender}</span>
              </div>
              <div className="flex flex-col space-y-2 border-b border-gray-400 pb-2">
                <div className='flex items-center gap-2'>
                  <span className="text-xs font-medium">Email Address</span>
                  <PencilSquareIcon className='w-4 h-4 text-blue-500 cursor-pointer' />
                </div>
                <span className='text-sm'>{student.information?.email_address}</span>
              </div>
              <div className="flex flex-col space-y-2 border-b border-gray-400 pb-2">
                <span className="text-xs font-medium">Phone Number</span>
                <span className='text-sm'>{student.information?.contact_number ? student.information?.contact_number : '-'}</span>
              </div>
              <div className="flex flex-col space-y-2 border-b border-gray-400 pb-2">
                <span className="text-xs font-medium">ID Number</span>
                <span className='text-sm'>{student.id_number}</span>
              </div>
              <div className="flex flex-col space-y-2 border-b border-gray-400 pb-2">
                <span className="text-xs font-medium">Course</span>
                <span className='text-sm uppercase'>{student.course}</span>
              </div>
              <div className="flex flex-col space-y-2 border-b border-gray-400 pb-2">
                <span className="text-xs font-medium">Student Type</span>
                <span className='text-sm capitalize'>{student.student_type}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default Information