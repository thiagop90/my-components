export interface ActionState {
  success: boolean
  message: string
  payload?: FormData
}

export const EMPTY_FORM_STATE: ActionState = {
  message: '',
  success: false,
}
