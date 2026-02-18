/**
 * File Upload Component
 * Reusable file upload component with preview and validation
 */

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X, FileText, Image as ImageIcon, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatFileSize, validateRujukanFile } from '@/lib/file-storage'

interface FileUploadProps {
  value?: File | null
  onChange: (file: File | null) => void
  accept?: string
  maxSize?: number
  label?: string
  description?: string
  error?: string
  disabled?: boolean
  className?: string
}

export function FileUpload({
  value,
  onChange,
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSize = 5 * 1024 * 1024, // 5MB
  label,
  description,
  error,
  disabled = false,
  className,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    // Validate file
    const validation = validateRujukanFile(file)
    if (!validation.valid) {
      // You might want to show this error through a toast or error prop
      console.error(validation.error)
      return
    }

    onChange(file)

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (disabled) return

    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleRemove = () => {
    onChange(null)
    setPreview(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handlePreview = () => {
    if (value) {
      const url = URL.createObjectURL(value)
      window.open(url, '_blank')
    }
  }

  const getFileIcon = () => {
    if (!value) return <Upload className='h-8 w-8' />
    if (value.type === 'application/pdf') return <FileText className='h-8 w-8' />
    if (value.type.startsWith('image/')) return <ImageIcon className='h-8 w-8' />
    return <FileText className='h-8 w-8' />
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label>{label}</Label>}
      {description && (
        <p className='text-sm text-muted-foreground'>{description}</p>
      )}

      <div
        className={cn(
          'relative rounded-lg border-2 border-dashed transition-colors',
          dragActive && 'border-primary bg-primary/5',
          error && 'border-destructive',
          disabled && 'opacity-50 cursor-not-allowed',
          !value && 'hover:border-primary/50'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Input
          ref={inputRef}
          type='file'
          accept={accept}
          onChange={handleChange}
          disabled={disabled}
          className='sr-only'
          id='file-upload'
        />

        {!value ? (
          <label
            htmlFor='file-upload'
            className={cn(
              'flex flex-col items-center justify-center gap-2 p-6 cursor-pointer',
              disabled && 'cursor-not-allowed'
            )}
          >
            <Upload className='h-8 w-8 text-muted-foreground' />
            <div className='text-center'>
              <p className='text-sm font-medium'>
                Klik untuk upload atau drag & drop
              </p>
              <p className='text-xs text-muted-foreground mt-1'>
                PDF, JPG, PNG (Maks. {formatFileSize(maxSize)})
              </p>
            </div>
          </label>
        ) : (
          <div className='p-4'>
            <div className='flex items-start gap-3'>
              {preview ? (
                <img
                  src={preview}
                  alt='Preview'
                  className='h-16 w-16 rounded object-cover'
                />
              ) : (
                <div className='flex h-16 w-16 items-center justify-center rounded bg-muted'>
                  {getFileIcon()}
                </div>
              )}

              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium truncate'>{value.name}</p>
                <p className='text-xs text-muted-foreground'>
                  {formatFileSize(value.size)}
                </p>
                <div className='flex gap-2 mt-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={handlePreview}
                    disabled={disabled}
                  >
                    <Eye className='h-3 w-3 mr-1' />
                    Preview
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={handleRemove}
                    disabled={disabled}
                  >
                    <X className='h-3 w-3 mr-1' />
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && <p className='text-sm text-destructive'>{error}</p>}
    </div>
  )
}
