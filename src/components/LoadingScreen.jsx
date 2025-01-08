import HashLoader from "react-spinners/HashLoader"

const LoadingScreen = ({ className }) => {
  return (
    <div className={`fixed inset-0 flex items-center justify-center ${className}`}>
      <HashLoader size={65} color="#2196f3" />
    </div>
  )
}

export default LoadingScreen