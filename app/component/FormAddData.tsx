import React from 'react'
import { TextField, Box, FormControl, FormHelperText } from '@mui/material'
import { addNewData } from '../utils/requests'
import { useForm, SubmitHandler } from 'react-hook-form'

interface IFormInput {
    userId: string
    firstName: string
    lastName: string
    sleepTime: number
    date: string
}

// Field names as returned by the API (snake_case)
type ApiFieldName = 'user_id' | 'first_name' | 'last_name' | 'sleep_time' | 'date'

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
    user_id: 'userId',
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
        defaultValues: {
        },
      })

    const onSubmit: SubmitHandler<IFormInput>  = async(data) => {

        const newData = {
            user_id: data.userId,
            first_name: data.firstName,
            last_name: data.lastName,
            sleep_time: Number(data.sleepTime),
            date: data.date,
        }
        
        const res: AddDataResponse | undefined = await addNewData(newData)

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
                    <TextField 
                        label="User id" 
                        {...register('userId', {
                        required: false,
                        })}
                    />
                    {errors.userId && (
                        <FormHelperText error>{errors.userId.message}</FormHelperText>
                    )}
                    <TextField label="First name" {...register("firstName", { required: false, maxLength: 20 })} />
                    {errors.firstName && (
                        <FormHelperText error>{errors.firstName.message}</FormHelperText>
                    )}
                    <TextField label="Last name" {...register("lastName", { pattern: /^[A-Za-z]+$/i })} />
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