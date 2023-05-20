// TODO: everything else
export type UserId = `${bigint}` & { $type: "UserId" }
export type IllustrationId = `${bigint}` & { $type: "IllustrationId" }
export type Text = string & { $type: "Text" }
// TODO: G-18?
export type Tag = ("R-18" & { $type: "Tag" }) | (string & { $type: "Tag" })
type DateString = string & { $type: "Date" }
export { DateString as Date }
export type HTML = string & { $type: "HTML" }
/** 40 hex digits */
export type Version = string & { $type: "Version" }
export type URL = string & { $type: "URL" }
export type ImageURL = string & { $type: "URL"; $subtype: "Image" }

interface ErrorResponse {
	error: true
	message: Text
}

interface SuccessResponse<T> {
	error: f
	message: "" & Text
	body: T
}

export type Response<T> = ErrorResponse | SuccessResponse<T>

export enum Language {
	japanese = "ja",
	english = "en",
}

export interface Query {
	lang: Language
	version: Version
}

export enum PartialState {
	partial = 0,
	full = 1,
}

export enum RegionId {
	australia = "AU",
}

export interface Region {
	// TODO:
	name: {} | null
	region: {} | null
	prefecture: {} | null
	privacyLevel: {} | null
}

export enum PrivacyLevel {
	public = "0",
	// TODO:
}

export interface SensitiveInfo {
	name: Text | null
	privacyLevel: PrivacyLevel | null
}

export enum IllustrationType {
	illustration = 0,
}

// TODO: verify
export enum XRestrictType {
	sfw = 0,
	nsfw = 1,
}

// TODO: verify
export enum RestrictType {
	sfw = 0,
	guro = 1,
}

// FIXME: what
export enum Sl {
	unknown = 6,
}

export enum AIType {
	notAi = 1,
	ai = 2,
}

export enum ShowType {
	show = "show",
	hide = "hide", // TODO: check
}

export enum AcceptingRequestsType {
	no = 0, // TODO: check
	yes = 1,
}

export interface TitleCaptionTranslation {
	// TODO:
	workTitle: {} | null
	workCaption: {} | null
}

export interface Illustration {
	id: IllustrationId
	title: Text
	illustType: IllustrationType
	xRestrict: XRestrictType
	restrict: RestrictType
	sl: Sl
	url: ImageURL
	description: Text
	tags: Tag[]
	userId: UserId
	userName: Text
	width: number
	height: number
	pageCount: number
	isBookmarkable: boolean
	bookmarkData: {} | null // TODO:
	alt: Text
	titleCaptionTranslation: TitleCaptionTranslation
	createDate: DateString
	updateDate: DateString
	isUnlisted: boolean
	isMasked: boolean
	aiType: AIType
	profileImageUrl: ImageURL
}

export interface Novel {
	// TODO:
}

// rpc/index.php
export interface MessageThreadUnreadCountQuery {
	mode: "message_thread_unread_count"
	lang: Language
	version: Version
}

export interface MessageThreadUnreadCountResponseBody {
	unread_count: `${bigint}`
}

export type MessageThreadUnreadCountResponse =
	| ErrorResponse
	| SuccessResponse<MessageThreadUnreadCountResponseBody>

// rpc/notify_count.php
export interface NotifyCountUnreadQuery extends Query {
	op: "count_unread"
}

export interface NotifyCountUnreadResponse {
	popboard: number
}

export enum QueryFullType {
	partial = "0",
	full = "1",
}

// ajax/user/{user_id}
export interface UserQuery extends Query {
	full: QueryFullType
}

interface Background {
	// TODO:
	repeat: {} | null
	color: {} | null
	url: ImageURL
	isPrivate: boolean
}

export interface UserBaseResponseBody {
	userId: UserId
	name: Text
	image: ImageURL
	imageBig: ImageURL
	premium: boolean
	isFollowed: boolean
	isMypixiv: boolean
	isBlocking: boolean
	background: Background
	// TODO:
	sketchLiveId: {} | null
	partial: PartialState
	acceptRequest: boolean
	sketchLives: unknown[]
}

export interface UserPartialResponseBody extends UserBaseResponseBody {
	partial: PartialState.partial
}

export interface UserFullResponseBody extends UserBaseResponseBody {
	partial: PartialState.full
	following: number
	mypixivCount: number
	followedBack: boolean
	comment: Text
	commentHtml: HTML
	// TODO:
	webpage: {} | null
	social: unknown[]
	canSendMessage: boolean
	region: Region
	age: SensitiveInfo
	birthDay: SensitiveInfo
	gender: SensitiveInfo
	job: SensitiveInfo
	workspace: {} | null
	official: boolean
	group: {} | null
}

export type UserFullResponse = Response<UserFullResponseBody>

export interface BookmarkCountInner {
	illust: number
	novel: number
}

export interface BookmarkCount {
	public: BookmarkCountInner
	private: BookmarkCountInner
}

export interface ExternalSiteWorksStatus {
	booth: boolean
	sketch: boolean
	vroidHub: boolean
}

export interface PostedRequests {
	artworks: Illustration[] // TODO: confirm
	novels: Novel[] // TODO: confirm
}

export interface RequestsStatus {
	showRequestTab: boolean
	showRequestSentTab: boolean
	postWorks: PostedRequests
}

// ajax/user/{user_id}/profile/all
export interface UserProfileAllQuery extends Query {}

export interface UserProfileAllResponseBody {
	illusts: Illustration[]
	manga: Manga[]
	novels: Novel[]
	mangaSeries: MangaSeries[]
	novelSeries: NovelSeries[]
	pickup: Pickup[]
	bookmarkCount: BookmarkCount
	externalSiteWorksStatus: ExternalSiteWorksStatus
	request: RequestsStatus
}

export type UserProfileAllResponse = Response<UserProfileAllResponseBody>

// ajax/user/{user_id}/following
export interface UserFollowingQuery {
	offset: number
	limit: number
	rest: ShowType
	tag: Text
	acceptingRequests: AcceptingRequestsType
	lang: Language
	version: Version
}

export interface ZoneConfigItem {
	url: URL
}

export interface ZoneConfig {
	header: ZoneConfigItem
	footer: ZoneConfigItem
	logo: ZoneConfigItem
	"500x500": ZoneConfigItem
}

export enum OpenGraphType {
	song = "music.song",
	album = "music.album",
	playlist = "music.playlist",
	radio_station = "music.radio_station",
	movie = "video.movie",
	episode = "video.episode",
	tv_show = "video.tv_show",
	other = "video.other",
	article = "article",
	book = "book",
	profile = "profile",
	website = "website",
}

export interface OpenGraphMetadata {
	description: Text
	image: ImageURL
	title: Text
	type: OpenGraphType
}

export enum TwitterCardType {
	summary = "summary",
	summaryLargeImage = "summary_large_image",
	app = "app",
	player = "player",
}

export interface TwitterMetadata {
	description: Text
	image: ImageURL
	title: Text
	card: TwitterCardType
}

export interface Metadata {
	title: Text
	description: Text /** e.g. `"pixiv"` */
	canonical: URL
	ogp: OpenGraphMetadata
	twitter: TwitterMetadata
	alternateLanguages: Record<Language, URL>
	descriptionHeader: Text
}

export interface UserFollowingExtraData {
	meta: Metadata
}

export interface UserFollowingResponseBody {
	users: User[] // FIXME: which type of user
	total: number
	followUserTags: string[] // TODO: check
	zoneConfig: ZoneConfig
	extraData: UserFollowingExtraData
}

export type UserFollowingResponse = Response<UserFollowingResponseBody>

// ajax/user/{user_id}/works/latest
export interface UserWorksLatestQuery extends Query {}

export interface UserWorksLatestResponseBody {
	illusts: Record<`${bigint}`, Illustration | null>
	novels: Novel[]
}

export enum Restriction {
	public = 0,
	mypixivOnly = 1,
	private = 2,
}

export interface SensitiveInfoSetting {
	restriction: Restriction
}

export interface BirthMonthAndDay extends SensitiveInfoSetting {
	month: number
	day: number
}

export interface BirthYear extends SensitiveInfoSetting {
	year: number
}

export enum GenderType {
	other = 0,
	male = 1,
	female = 2,
}

export interface Gender extends SensitiveInfoSetting {
	value: GenderType
}

export interface Location extends SensitiveInfoSetting {
	region: RegionId | (string & {})
	prefecture: {} | null
}

export enum JobType {
	universityStudentOrGraduateStudent = 19,
}

export interface Job extends SensitiveInfoSetting {
	value: JobType
}

export interface ExternalServices {
	// TODO:
	twitter: {} | null
	instagram: {} | null
	tumblr: {} | null
	facebook: {} | null
	circlems: {} | null
}

export interface PawooConfig {
	isPawooAuthorized: boolean
	preferDisplayPawoo: boolean
}

// ajax/my_profile
export interface MyProfileQuery extends Query {}

export interface MyProfileResponseBody {
	coverImage: {} | null // TODO:
	profileImage: ImageURL
	name: Text
	comment: Text
	webpage: "" | URL
	externalService: ExternalServices
	pawoo: PawooConfig // TODO: | null?
	location: Location
	gender: Gender
	birthYear: BirthYear
	birthMonthAndDay: BirthMonthAndDay
	job: Job
	isOfficialUser: boolean
}

export type MyProfileResponse = Response<MyProfileResponseBody>
