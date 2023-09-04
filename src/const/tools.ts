import type { Tool } from '@/models/Tool'
import BrushTool from '@/models/tools/BrushTool'
import CursorTool from '@/models/tools/CursorTool'
import PaintBucketTool from '@/models/tools/PaintBucketTool'
import SealTool from '@/models/tools/SealTool'
import SelectionTool from '@/models/tools/SelectionTool'

export const tools: Tool[] = [CursorTool, SelectionTool, BrushTool, PaintBucketTool, SealTool]

export const DEFAULT_TOOL = tools[0]
