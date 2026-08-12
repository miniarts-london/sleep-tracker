import React from 'react'
import { TextField, Box, FormControl, FormHelperText } from '@mui/material'
import { addNewData } from '../utils/requests'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'

interface IFormInput {
    userId: string
    firstName: string
    lastName: string
    sleepTime: number
    date:string
  }

interface FormAddDataProps {
    handleAfterSubmit: (val: any) => void
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
            userId: data.userId,
            firstName: data.firstName,
            lastName: data.lastName,
            sleepTime: Number(data.sleepTime),
            date: data.date,
        }
        
        const res = await addNewData(newData)

        if (res){
            handleAfterSubmit(res)
            if(!res.success){
                res.error_fields.forEach((item:any) => {
                    setError(item, {message: `Not a valid value for ${item} field`})
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