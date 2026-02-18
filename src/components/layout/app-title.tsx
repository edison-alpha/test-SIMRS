import { Link } from 'react-router-dom'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import brandLogo from '@/assets/brand-icons/brand.png'

export function AppTitle() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size='lg' asChild>
          <Link to='/'>
            <div className='flex aspect-square size-8 items-center justify-center rounded-lg'>
              <img src={brandLogo} alt='Brand Logo' className='size-8 object-contain' />
            </div>
            <div className='grid flex-1 text-start text-m leading-tight'>
              <span className='truncate font-semibold'>SIMRS</span>
              <span className='truncate text-xs'>Management System</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
