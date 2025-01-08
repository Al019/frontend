import { Accordion, AccordionBody, AccordionHeader, Badge, Breadcrumbs, Card, IconButton, List, ListItem, ListItemPrefix } from "@material-tailwind/react"
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import Logo from '../assets/images/occ-logo.png'
import { useState } from "react"
import { ChevronDownIcon, ChevronRightIcon, DocumentTextIcon, FolderIcon, PresentationChartLineIcon, UsersIcon } from "@heroicons/react/24/outline"
import User from '../assets/images/user.png'
import { BellIcon } from "@heroicons/react/24/solid"
import { HomeIcon } from "@heroicons/react/24/solid"
import { useAuthContext } from "../contexts/AuthContext"
import LoadingScreen from "../components/LoadingScreen"

const DefaultLayout = () => {
  const { token, user, logout, loading } = useAuthContext()
  const route = useLocation()
  const path = route.pathname.split("/").filter(Boolean)
  const navigate = useNavigate()

  if (!token) {
    return <Navigate to='/login' />
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <>
      <Card className="fixed h-[calc(100vh-2rem)] w-[272px] inset-y-4 left-4 p-2 overflow-y-scroll" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <NavigationList
          user={user}
          route={route}
          navigate={navigate}
          logout={logout}
        />
      </Card>
      <div className="ml-[290px] p-4">
        <div className='flex items-center justify-between'>
          <Breadcrumbs className="bg-transparent p-0">
            <HomeIcon onClick={() => navigate('/registrar/admin/dashboard')} className="w-5 h-5 opacity-60" />
            <span className="capitalize">{path[path.length - 1]}</span>
          </Breadcrumbs>
          <Badge content="1">
            <IconButton variant="filled" color='white'>
              <BellIcon color="orange" className="h-5 w-5" />
            </IconButton>
          </Badge>
        </div>
        <div className="mx-auto mt-10 max-w-[1280px]">
          <Outlet />
        </div>
      </div>
    </>
  )
}

const NavigationList = ({ user, route, navigate, logout }) => {
  const [open, setOpen] = useState(0)

  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value)
  }

  return (
    <>
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-1">
          <img src={Logo} className="h-8 w-8 object-contain" />
          <span className="text-blue-700 font-bold text-xl tracking-wide">OCC</span>
        </div>
      </div>
      <List>
        <span className="font-medium text-sm py-2 capitalize">
          {user?.role}
        </span>
        <Accordion open={open === 1} icon={<ChevronDownIcon strokeWidth={2.5} className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`} />} >
          <ListItem className="p-0">
            <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
              <ListItemPrefix>
                <img src={User} className="h-8 w-8" />
              </ListItemPrefix>
              <span className="mr-auto text-sm font-normal">{user?.staff.information.first_name} {user?.staff.information.last_name}</span>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={2.5} className="h-3.5 w-3.5" />
                </ListItemPrefix>
                <span className="mr-auto text-sm">My Profile</span>
              </ListItem>
              <ListItem onClick={() => logout()}>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={2.5} className="h-3.5 w-3.5" />
                </ListItemPrefix>
                <span className="mr-auto text-sm">Logout</span>
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
        <hr className="m-2 border-blue-gray-50" />
        <span className="font-medium text-sm py-2">Main</span>
        <ListItem onClick={() => {
          navigate('/registrar/admin/dashboard')
        }} className={`focus:bg-blue-500 focus:text-white ${route.pathname === '/registrar/admin/dashboard' && 'bg-blue-500 text-white hover:bg-blue-500 hover:text-white'}`}>
          <ListItemPrefix>
            <PresentationChartLineIcon className="h-5 w-5" />
          </ListItemPrefix>
          <span className="mr-auto text-sm font-normal">Dashboard</span>
        </ListItem>
        <span className="font-medium text-sm py-2">Users</span>
        <ListItem onClick={() => {
          navigate('/registrar/admin/students')
        }} className={`focus:bg-blue-500 focus:text-white ${route.pathname === '/registrar/admin/students' && 'bg-blue-500 text-white hover:bg-blue-500 hover:text-white'}`}>
          <ListItemPrefix>
            <UsersIcon className="h-5 w-5" />
          </ListItemPrefix>
          <span className="mr-auto text-sm font-normal">Students</span>
        </ListItem>
        <ListItem onClick={() => {
          navigate('/registrar/admin/staffs')
        }} className={`focus:bg-blue-500 focus:text-white ${route.pathname === '/registrar/admin/staffs' && 'bg-blue-500 text-white hover:bg-blue-500 hover:text-white'}`}>
          <ListItemPrefix>
            <UsersIcon className="h-5 w-5" />
          </ListItemPrefix>
          <span className="mr-auto text-sm font-normal">Staffs</span>
        </ListItem>
        <span className="font-medium text-sm py-2">Files</span>
        <Accordion open={open === 2} icon={<ChevronDownIcon strokeWidth={2.5} className={`mx-auto h-4 w-4 transition-transform ${open === 2 ? "rotate-180" : ""}`} />} >
          <ListItem className="p-0">
            <AccordionHeader onClick={() => handleOpen(2)} className="border-b-0 p-3">
              <ListItemPrefix>
                <FolderIcon className="h-5 w-5" />
              </ListItemPrefix>
              <span className="mr-auto text-sm font-normal">Documents</span>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem onClick={() => {
                navigate('/registrar/admin/documents')
              }} className={`focus:bg-blue-500 focus:text-white ${route.pathname === '/registrar/admin/documents' && 'bg-blue-500 text-white hover:bg-blue-500 hover:text-white'}`}>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={2.5} className="h-3.5 w-3.5" />
                </ListItemPrefix>
                <span className="mr-auto text-sm font-normal">All Documents</span>
              </ListItem>
              <ListItem onClick={() => {
                navigate('/registrar/admin/documents/records')
              }} className={`focus:bg-blue-500 focus:text-white ${route.pathname === '/registrar/admin/documents/records' && 'bg-blue-500 text-white hover:bg-blue-500 hover:text-white'}`}>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={2.5} className="h-3.5 w-3.5" />
                </ListItemPrefix>
                <span className="mr-auto text-sm font-normal">Records</span>
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
        <Accordion open={open === 3} icon={<ChevronDownIcon strokeWidth={2.5} className={`mx-auto h-4 w-4 transition-transform ${open === 3 ? "rotate-180" : ""}`} />} >
          <ListItem className="p-0">
            <AccordionHeader onClick={() => handleOpen(3)} className="border-b-0 p-3">
              <ListItemPrefix>
                <DocumentTextIcon className="h-5 w-5" />
              </ListItemPrefix>
              <span className="mr-auto text-sm font-normal">Credentials</span>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List className="p-0">
              <ListItem onClick={() => {
                navigate('/registrar/admin/credentials')
              }} className={`focus:bg-blue-500 focus:text-white ${route.pathname === '/registrar/admin/credentials' && 'bg-blue-500 text-white hover:bg-blue-500 hover:text-white'}`}>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={2.5} className="h-3.5 w-3.5" />
                </ListItemPrefix>
                <span className="mr-auto text-sm font-normal">All Credentials</span>
              </ListItem>
              <ListItem onClick={() => {
                navigate('/registrar/admin/credentials/purposes')
              }} className={`focus:bg-blue-500 focus:text-white ${route.pathname === '/registrar/admin/credentials/purposes' && 'bg-blue-500 text-white hover:bg-blue-500 hover:text-white'}`}>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={2.5} className="h-3.5 w-3.5" />
                </ListItemPrefix>
                <span className="mr-auto text-sm font-normal">Purposes</span>
              </ListItem>
              <ListItem onClick={() => {
                navigate('/registrar/admin/credentials/requests')
              }} className={`focus:bg-blue-500 focus:text-white ${route.pathname === '/registrar/admin/credentials/requests' && 'bg-blue-500 text-white hover:bg-blue-500 hover:text-white'}`}>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={2.5} className="h-3.5 w-3.5" />
                </ListItemPrefix>
                <span className="mr-auto text-sm font-normal">Requests</span>
              </ListItem>
              <ListItem>
                <ListItemPrefix>
                  <ChevronRightIcon strokeWidth={2.5} className="h-3.5 w-3.5" />
                </ListItemPrefix>
                <span className="mr-auto text-sm font-normal">Reports</span>
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
      </List>
    </>
  )
}

export default DefaultLayout