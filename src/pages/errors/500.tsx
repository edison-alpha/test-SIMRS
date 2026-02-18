/**
 * 500 Internal Server Error Page
 */

import { GeneralError } from '@/features/errors/general-error'

export function Error500() {
  return <GeneralError />
}
