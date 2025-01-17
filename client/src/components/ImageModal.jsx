import { X } from 'lucide-react'

const ImageModal = ({imageModalSrc, setImageModalOpen}) => {
  return (
    <div className="fixed inset-0 bg-base-100/50 flex items-center justify-center z-50">
    <img
      src={imageModalSrc}
      alt="Attachment"
      className="max-w-full max-h-[90vh]"
    />
    <X
      onClick={() => setImageModalOpen(false)}
      className="absolute top-4 right-4 text-red-500 cursor-pointer"
    />
  </div>
  )
}

export default ImageModal