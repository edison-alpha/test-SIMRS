/**
 * Form Progress Indicator
 * Shows completion progress for the admission form
 */

import { cn } from '@/lib/utils'

interface FormProgressProps {
  sections: {
    id: string
    title: string
    completed: boolean
    required: boolean
  }[]
  className?: string
}

/**
 * FormProgress - Visual indicator of form completion progress
 * 
 * Features:
 * - Shows all form sections
 * - Indicates completed sections
 * - Highlights required sections
 * - Calculates overall progress percentage
 * 
 * @param sections - Array of section metadata
 * @param className - Additional CSS classes
 */
export function FormProgress({ sections, className }: FormProgressProps) {
  const totalSections = sections.length
  const completedSections = sections.filter(s => s.completed).length
  const progressPercentage = totalSections > 0 
    ? Math.round((completedSections / totalSections) * 100) 
    : 0

  return (
    <div className={cn('space-y-3', className)}>
      {/* Progress Bar */}
      <div className='space-y-1'>
        <div className='flex items-center justify-between text-sm'>
          <span className='font-medium'>Progress Pengisian</span>
          <span className='text-muted-foreground'>
            {completedSections} / {totalSections} bagian
          </span>
        </div>
        <div className='h-2 w-full bg-muted rounded-full overflow-hidden'>
          <div
            className='h-full bg-primary transition-all duration-300 ease-in-out'
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Section Checklist */}
      <div className='space-y-1'>
        {sections.map((section) => (
          <div
            key={section.id}
            className='flex items-center gap-2 text-sm'
          >
            <div
              className={cn(
                'h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors',
                section.completed
                  ? 'bg-primary border-primary'
                  : 'border-muted-foreground'
              )}
            >
              {section.completed && (
                <svg
                  className='h-3 w-3 text-primary-foreground'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M5 13l4 4L19 7'
                  />
                </svg>
              )}
            </div>
            <span
              className={cn(
                section.completed
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {section.title}
              {section.required && (
                <span className='text-destructive ml-1'>*</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
