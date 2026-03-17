import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import React from 'react'

type CommonTooltipProps = {
  content: string
  children: React.ReactNode
}

const CommonTooltip = ({ content, children }: CommonTooltipProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="max-w-60 overflow-auto text-wrap">
        {content}
      </TooltipContent>
    </Tooltip>
  )
}

export default CommonTooltip
