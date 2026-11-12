import React from 'react'
import { TextField, Box, FormControl, FormHelperText } from '@mui/material'
import { addNewData, UnauthorizedError } from '../utils/requests'
import { getProfile } from '../utils/auth'
import { useForm, SubmitHandler } from 'react-hook-form'

// No user id field: the API takes it from the login token.
interface IFormInput {
    firstName: string
    lastName: string
    sleepTime: number
    date: string
}

// Field names as returned by the API (snake_case)
type ApiFieldName = 'first_name' | 'last_name' | 'sleep_time' | 'date'

export interface ApiErrorDetail {
    fieldName: ApiFieldName
    message?: string
}

// Matches sleep-tracker-api POST /api/entries response
export type AddDataResponse =
    | { success: true; details: null }
    | { success: false; details?: ApiErrorDetail[] | null }

// Map API field names to the form's field names
const apiFieldToFormField: Record<ApiFieldName, keyof IFormInput> = {
    first_name: 'firstName',
    last_name: 'lastName',
    sleep_time: 'sleepTime',
    date: 'date',
}

interface FormAddDataProps {
    handleAfterSubmit: (val: AddDataResponse) => void
}

export const FormAddData = ({handleAfterSubmit}: FormAddDataProps) => {
    const {
        register,
        handleSubmit,
        control,
        getValues,
        setError,
        clearErrors,
        formState: { isDirty, isValid, errors, isSubmitted },
      } = useForm<IFormInput>({
        // Pre-fill with the registered names. The Drawer mounts this form each
        // time it opens, so this is read fresh then (client-side only).
        defaultValues: {
            firstName: getProfile()?.firstName ?? '',
            lastName: getProfile()?.lastName ?? '',
        },
      })

    const onSubmit: SubmitHandler<IFormInput>  = async(data) => {

        const newData = {
            first_name: data.firstName,
            last_name: data.lastName,
            sleep_time: Number(data.sleepTime),
            date: data.date,
        }

        let res: AddDataResponse | undefined
        try {
            res = await addNewData(newData)
        } catch (err) {
            if (err instanceof UnauthorizedError) return // already redirecting to /login
            res = { success: false, details: null }
        }

        if (res){
            handleAfterSubmit(res)
            if(res.success === false && res.details){
                res.details.forEach((item) => {
                    const formField = apiFieldToFormField[item.fieldName]
                    if (formField) {
                        setError(formField, {message: item.message ?? `Not a valid value for ${item.fieldName} field`})
                    }
                })
            }
        }
    }
    
    return(
        <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl sx={{ m: 3 }} component='fieldset' variant='standard'>
                <Box sx={{'& .MuiTextField-root': { mt: 1, width: '25ch' }, display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                    {/* Same rules as register (1 to 50 characters), so a pre-filled registered name always passes */}
                    <TextField disabled label="First name" {...register("firstName", { maxLength: { value: 50, message: 'At most 50 characters' } })} />
                    {errors.firstName && (
                        <FormHelperText error>{errors.firstName.message}</FormHelperText>
                    )}
                    <TextField disabled label="Last name" {...register("lastName", { maxLength: { value: 50, message: 'At most 50 characters' } })} />
                    {errors.lastName && (
                        <FormHelperText error>{errors.lastName.message}</FormHelperText>
                    )}
                    <TextField type="number" label="Sleep time" {...register("sleepTime", { min: 0, max: 24 })} />
                    {errors.sleepTime && (
                        <FormHelperText error>{errors.sleepTime.message}</FormHelperText>
                    )}
                    <TextField type="date"  {...register("date", {required: false })} />
                    {errors.date && (
                        <FormHelperText error>{errors.date.message}</FormHelperText>
                    )}
                    <TextField type="submit" />
                </Box>
            </FormControl>
        </form>
    )

}