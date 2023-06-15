import { $, required } from '@utils'

required($('#connection-status')).innerHTML = '<i class="ri-link-m"></i>'
required($('#connection-status')).classList.remove('connect-status-alert')
