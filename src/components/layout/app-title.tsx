import { Link } from 'react-router-dom'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import brandLogo from '@/assets/brand-icons/brand.png'

export function AppTitle() {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton 
          size='lg' 
          asChild
        >
          <Link to='/'>
            <div className={`flex items-center justify-center rounded-lg ${isCollapsed ? 'size-11' : 'size-8'}`}>
              <img 
                src={brandLogo} 
                alt='Brand Logo' 
                className={`object-contain ${isCollapsed ? 'size-11' : 'size-8'}`} 
              />
            </div>
            <div className='grid flex-1 text-start text-m leading-tight group-data-[collapsible=icon]:hidden'>
              <span className='truncate font-semibold'>SIMRS</span>
              <span className='truncate text-xs'>Management System</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
