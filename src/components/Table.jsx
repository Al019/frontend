import { ArrowLeftIcon, ArrowRightIcon, EyeIcon, MagnifyingGlassIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import { Button, Card, CardBody, Chip, IconButton, Input, Option, Select } from "@material-tailwind/react"
import { useEffect, useState } from "react"

const Tbl = ({ title, data, onClickView, idKey, onClickEdit }) => {
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setFilteredData(data.tbodies)
  }, [data])

  const recordPerPage = 10
  const lastIndex = currentPage * recordPerPage
  const firstIndex = lastIndex - recordPerPage
  const records = filteredData.slice(firstIndex, lastIndex)
  const npage = Math.ceil(filteredData.length / recordPerPage)
  const pageLimit = 3
  const startPage = Math.floor((currentPage - 1) / pageLimit) * pageLimit + 1
  const endPage = Math.min(startPage + pageLimit - 1, npage)
  const numbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase()
    if (keyword === "") {
      setFilteredData(data.tbodies)
    } else {
      const filtered = data.tbodies.filter(
        (row) => (
          Object.values(row).some((value) =>
            typeof value === "string" && value.toLowerCase().includes(keyword)
          )
        )
      )
      setFilteredData(filtered)
      setCurrentPage(1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const changeCurrentPage = (number) => {
    setCurrentPage(number)
  }

  const nextPage = () => {
    if (currentPage < npage) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <Card>
      <CardBody className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col text-sm font-medium">
            <span>List of {title}</span>
            <span>Total: {filteredData.length}</span>
          </div>
          <div className='w-full max-w-[250px]'>
            <Input onChange={handleSearch} color="blue" label="Search" icon={<MagnifyingGlassIcon className="h-5 w-5" />} />
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className="w-full table-auto text-left">
            <thead className="bg-blue-gray-50/50">
              <tr>
                <th className="font-medium text-sm p-4 whitespace-nowrap">#</th>
                {data.theads.map((head, headIndex) => (
                  <th key={headIndex} className="font-medium text-sm p-4 whitespace-nowrap">
                    {head}
                  </th>
                ))}
                {onClickEdit && (
                  <th className="font-medium text-sm p-4 whitespace-nowrap">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {records.map((record, recordIndex) => {
                const { id, count_day, on_page, ...displayData } = record
                const isPending = displayData.submit_status === "pending"

                return (
                  <tr onClick={() => !isPending && onClickView(record[idKey])} key={recordIndex} className={`border-b hover:bg-blue-gray-50/50 ${onClickView && "cursor-pointer"}`}>
                    <td className="p-4 font-normal text-sm whitespace-nowrap">
                      {firstIndex + recordIndex + 1}
                    </td>
                    {Object.entries(displayData).map(([key, body], bodyIndex) => (
                      <td key={bodyIndex} className={`p-4 font-normal text-sm whitespace-nowrap ${key === "role" && 'capitalize'}`}>
                        {key === "is_active" ? (
                          <Chip color={body === 'active' ? 'green' : 'red'} value={body} variant="ghost" className="w-fit" />
                        ) : key === "submit_status" ? (
                          <Chip color={body === 'pending' && 'yellow' || body === 'review' && 'orange' || body === 'confirm' && 'green' || body === 'resubmit' && 'red'} value={body} variant="ghost" className="w-fit" />
                        ) : body === null ? (
                          "-"
                        ) : (
                          body
                        )}
                      </td>
                    ))}
                    {onClickEdit && (
                      <td className="p-4 font-normal text-sm whitespace-nowrap cursor-pointer">
                        <IconButton onClick={() => onClickEdit(record)} color="blue" size="sm" variant="text">
                          <PencilSquareIcon className="w-5 h-5" />
                        </IconButton>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredData.length > 0 && (
          <div className='flex justify-end'>
            <div className='flex justify-end'>
              <div className="flex items-center gap-3">
                <Button
                  size='sm'
                  onClick={prevPage}
                  variant="text"
                  className="flex items-center gap-3"
                  disabled={currentPage === 1}>
                  <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
                <div className="flex items-center gap-2">
                  {numbers.map((number, index) => (
                    <IconButton
                      onClick={() => changeCurrentPage(number)}
                      color='blue'
                      variant={currentPage === number ? 'filled' : 'text'}
                      key={index}
                      size='sm'>
                      {number}
                    </IconButton>
                  ))}
                </div>
                <Button
                  size='sm'
                  onClick={nextPage}
                  variant="text"
                  className="flex items-center gap-3"
                  disabled={currentPage === npage}>
                  <span>Next</span>
                  <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  )
}

export default Tbl