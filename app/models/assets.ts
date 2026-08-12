export interface EntryDetail {
    user_id: string
    first_name: string
    last_name: string
    sleep_time: number
    date: string
}

export type ModalDataProps = {
    user_id: string
    type?: string
}