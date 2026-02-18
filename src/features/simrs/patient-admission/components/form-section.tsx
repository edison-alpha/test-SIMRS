/**
 * Form Section Component
 * Reusable wrapper for form sections with collapsible functionality
 */

import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FormSectionProps {
  title: string
  children: ReactNode
  required?: boolean
  collapsible?: boolean
  defaultOpen?: boolean
  className?: string
}

/**
 * FormSection - Wrapper component for organizing form fields into sections
 * 
 * Features:
 * - Optional collapsible functionality
 * - Required indicator
 * - Consistent styling
 * - Accessible structure
 * 
 * @param title - Section title
 * @param children - Form fields to render inside the section
 * @param required - Whether this section contains required fields
 * @param collapsible - Whether the section can be collapsed
 * @param defaultOpen - Initial open state for collapsible sections
 * @param className - Additional CSS classes
 */
export function FormSection({
  title,
  children,
  required = false,
  collapsible = false,
  defaultOpen = true,
  className,
}: FormSectionProps) {
  if (!collapsible) {
    return (
      <Card className={cn('border-border', className)}>
        <CardHeader className='pb-3'>
          <CardTitle className='text-base font-semibold flex items-center gap-2'>
            {title}
            {required && (
              <span className='text-destructive text-sm font-normal'>
                (Wajib diisi)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {children}
        </CardContent>
      </Card>
    )
  }

  return (
    <Collapsible defaultOpen={defaultOpen}>
      <Card className={cn('border-border', className)}>
        <CollapsibleTrigger className='w-full'>
          <CardHeader className='pb-3 hover:bg-muted/50 transition-colors'>
            <CardTitle className='text-base font-semibold flex items-center justify-between'>
              <span className='flex items-center gap-2'>
                {title}
                {required && (
                  <span className='text-destructive text-sm font-normal'>
                    (Wajib diisi)
                  </span>
                )}
              </span>
              <ChevronDown className='h-4 w-4 transition-transform duration-200 data-[state=open]:rotate-180' />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className='space-y-4 pt-0'>
            {children}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
