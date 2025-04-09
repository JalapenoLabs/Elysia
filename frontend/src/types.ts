// Copyright © 2024 Elysia

// //////////////////// //
//       Internal       //
// //////////////////// //

export type I18text = string
export type Noni18text = string
export type I18key = string
export type Uid = string
export type ResourcePath = string
export type DateISO = string
export type MusicXml = string
export type Timeout = ReturnType<typeof setTimeout>
export type Interval = ReturnType<typeof setInterval>

// //////////////////// //
//         Enums        //
// //////////////////// //

export type Role =
  | 'private_ua'
  | 'private'
  | 'student'
  | 'instructor'
  | 'admin'
  | 'super'

export type Status =
  | 'active'
  | 'suspended'

export type Instruments =
  | 'guitar'
  | 'piano'
  | 'violin'

export type EvaluationStatus =
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'

// //////////////////// //
//        Structs       //
// //////////////////// //

export type BaseUser = {
  // Profile
  id: Uid
  email: string
  username: Noni18text
  profile_image_path: ResourcePath
  dob: DateISO

  // State
  reset_password: boolean
  role: Role
  status: Status

  // Connections
  institution_id: Uid

  // Statistics
  created_at: DateISO
}

export type CommercialUser = BaseUser & {}
export type EduUser = BaseUser & {}

export type Institution = {
  // Profile
  id: Uid
  name: Noni18text

  // State
  admin_seats: number
  instructor_seats: number
  student_seats: number
}

export type AccessToken = {
  access_token: string
  expires_in: number
  expires_at: DateISO
  refresh_token: string
  token_type: string
}

export type Song = {
  id: Uid
  instrument: Instruments
  name: string
  owner: string
  owner_id: string
  public: {
    bool: boolean
    valid: boolean
  }
}

export type Score = {
  name: string
  music_xml: MusicXml
}

export type TimeSignature = {
  numerator: number
  denominator: number
}

export type Performance = {
  id: Uid
  song_id: Uid
  size_on_disk: number
  created_at: DateISO
}

// //////////////////// //
//     API Responses    //
// //////////////////// //

export type StandardApiError = {
  error: I18text
  code: I18key
}

export type ApiAbstracted<Data = Record<string, any>> = {
  data: Data
  success: boolean
  errors: I18key[]
  validationErrors: Record<string, I18key>
}
