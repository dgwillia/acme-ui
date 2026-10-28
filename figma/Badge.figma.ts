// url=https://www.figma.com/design/5d9HHWsYninfYBCiPrWpEw/Acme-UI?node-id=15-93
// source=src/components/Badge/Badge.tsx
// component=Badge
//
// Code Connect template: tells Figma (Dev Mode and the Figma MCP) what code to show
// for a Badge instance. Published with the Figma MCP `add_code_connect_map` tool.
import figma from 'figma'
const instance = figma.selectedInstance

const label = instance.getString('label')
const tone = instance.getEnum('tone', {
  neutral: 'neutral',
  info: 'info',
  success: 'success',
  warning: 'warning',
  critical: 'critical',
})
const hasLeadingIcon = instance.getBoolean('hasLeadingIcon')
const icon = hasLeadingIcon ? instance.getInstanceSwap('leadingIcon') : null
let iconCode
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

export default {
  example: figma.code`<Badge${tone === 'neutral' ? '' : figma.code` tone="${tone}"`}${iconCode ? figma.code` leadingIcon={${iconCode}}` : ''}>${label}</Badge>`,
  imports: ['import { Badge } from "@acme/ui"'],
  id: 'badge',
  metadata: { nestable: true },
}
