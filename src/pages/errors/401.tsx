/**
 * 401 Unauthorized Error Page
 */

import { UnauthorisedError } from '@/features/errors/unauthorized-error'

export function Error401() {
  return <UnauthorisedError />
}
