export interface Episode {
    id: string
    type: string
    title: string
    published_at: string
    duration: number
    url: string
    app_url: string
    shuttle_url: string
    is_downloadable: boolean
    is_premium_only: boolean
    listenagain: Listenagain
}
  
export interface Listenagain {
    ScheduleId: number
    ShowId: number
    ScheduleStart: string
    ScheduleDescription: string
    ScheduleTitle: string
    ScheduleWebsite: string
    ScheduleListenAgainROMP: number
    ScheduleSmartLink: string
    ScheduleDuration: number
    SchedulePlaylist: string
    ScheduleImageUrl: string
    ScheduleWideImageUrl: string
    ScheduleLargeImageUrl: string
    ScheduleListenAgainAACUrl: string
    ScheduleListenAgainMP3Url: string
    ConfigListenAgainUrl: string
    ConfigRadioplayerUrl: string
    ShowSlug: string
    mediaUrl_mp3: string
    mediaUrl: string
    ScheduleStationCode: string
    ScheduleExpiresAt: string
}
  