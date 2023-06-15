import { ColorSchemeToggle } from '@components'
import { $, required } from '@utils'
import { render } from 'preact'

render(<ColorSchemeToggle />, required($('#color-scheme-toggle')))
