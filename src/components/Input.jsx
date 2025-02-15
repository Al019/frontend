import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { Button, Input } from "@material-tailwind/react"
import { useState } from "react"

const Inpt = ({ label, onChange, secureTextEntry, ...rest }) => {
  const [toogle, setToogle] = useState(false)

  return (
    <Input onChange={onChange} label={label} type={secureTextEntry && !toogle ? 'password' : 'text'} color="blue" icon={secureTextEntry && (
      <div className='absolute inset-y-0 flex items-center'>
        <Button onClick={() => setToogle(!toogle)} variant="text" size="sm" className="flex items-center rounded-full p-1" tabIndex={-1}>
          {!toogle ? (
            <EyeSlashIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </Button>
      </div>
    )} {...rest} />
  )
}

export default Inpt