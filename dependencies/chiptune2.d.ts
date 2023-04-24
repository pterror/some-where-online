declare var ChiptuneAudioContext: AudioContext | undefined
interface ChiptuneAudioContext extends AudioContext {}

declare class ChiptuneJsConfig {
	repeatCount: number
	stereoSeparation: number | undefined
	interpolationFilter: unknown | undefined
	context: ChiptuneAudioContext | undefined

	constructor(
		repeatCount: number, stereoSeparation?: number, interpolationFilter?: unknown, context?: ChiptuneAudioContext
	)
}

interface ChiptuneHandler {
	eventName: string
	handler: (response: unknown) => void
}

declare class ChiptuneJsPlayer {
	config: ChiptuneJsConfig
	context: ChiptuneAudioContext
	currentPlayingNode: unknown | null
	handlers: ChiptuneHandler[]
	touchLocked: boolean

	constructor(config: ChiptuneJsConfig)

	fireEvent: (this: ChiptuneJsPlayer, eventName: string, response: unknown) => void
	addHandler: (this: ChiptuneJsPlayer, eventName: string, handler: ChiptuneHandler) => void
	onEnded: (this: ChiptuneJsPlayer, handler: ChiptuneHandler) => void
	onError: (this: ChiptuneJsPlayer, handler: ChiptuneHandler) => void
	duration: (this: ChiptuneJsPlayer) => number
	getCurrentRow: (this: ChiptuneJsPlayer) => unknown
	getCurrentPattern: (this: ChiptuneJsPlayer) => unknown
	getCurrentOrder: (this: ChiptuneJsPlayer) => unknown
	getCurrentTime: (this: ChiptuneJsPlayer) => number
	getTotalOrder: (this: ChiptuneJsPlayer) => number
	getTotalPatterns: (this: ChiptuneJsPlayer) => number
	metadata: (this: ChiptuneJsPlayer) => Record<string, string>
	module_ctl_set: (this: ChiptuneJsPlayer, ctl: string, value: string) => boolean
	unlock: (this: ChiptuneJsPlayer) => void
	load: <T>(this: ChiptuneJsPlayer, input: File | string | URL, callback: (buffer: ArrayBuffer) => T) => T
	play: (this: ChiptuneJsPlayer, buffer: ArrayBuffer) => void
	stop: (this: ChiptuneJsPlayer) => void
	togglePause: (this: ChiptuneJsPlayer) => void
	createLibopenmptNode: (this: ChiptuneJsPlayer, buffer: ArrayBuffer, config: ChiptuneJsConfig) => unknown
}
