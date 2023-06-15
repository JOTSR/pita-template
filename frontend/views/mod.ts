import '@/frontend/views/src/colorscheme_toggle.tsx'
import '@/frontend/views/src/connection_status.ts'
import '@/frontend/views/src/panel_list.tsx'
import '@/frontend/views/src/settings_modal.tsx'

//Set page title
import info from '@/www/info/info.json' assert { type: 'json' }
import { $, required } from '@utils'
required($('title')).innerText = info.name
