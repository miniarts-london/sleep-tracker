'use client'

import React, { useState } from 'react'
import { Modal } from '../component/Modal'
import { EntryDetail } from '../models/assets'
import Table from '../component/Table'
import { Button, Drawer, Alert } from '@mui/material'
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar'
import { FormAddData, AddDataResponse } from '../component/FormAddData'
import {fetchAssetListFromAPI } from "../utils/requests"

type ModalDataProps = {
  user_id: string
  first_name: string
  last_name: string
  count:string
}

export function Tracker({ data }: {data: EntryDetail[]}) {   
  const [loadedData, setLoadedData] = useState<EntryDetail[]>(data)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalData, setModalData] = useState<ModalDataProps>()
  const [open, setOpen] = React.useState(false)
  const [openSnackbar, setOpenSnackbar] = React.useState(false)
  const [message, setMessage] = useState({message: [''], success: true})

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  }

  const handleOpenModal = (item:any) => {
    setModalOpen(true)
    setModalData(item)
  }

  const handleDrawer = async(val: AddDataResponse) => {
    if (val.success === true){
      const data = await fetchAssetListFromAPI()
      setLoadedData(data)
      setOpen(false)
    }
    // The API returns { success, details } – build the snackbar text from that
    const messages = val.success
      ? ['Successfully added!']
      : val.details?.length
        ? val.details.map((d) => d.message ?? `Not a valid value for ${d.fieldName} field`)
        : ['Failed to add entry']
    setMessage({
      message: messages,
      success: val.success
    })
    setOpenSnackbar(true)
  }

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

    return (
      <>
        {/* <Grid container>
          <Grid item sx={{mb: 2}}>
            <Button variant="contained" onClick={toggleDrawer(true)}>Add new</Button>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item>
            <Table data={loadedData} openModal={(item)=>handleOpenModal(item)}/>
          </Grid>
        </Grid> */}
        <Button variant="contained" onClick={toggleDrawer(true)} sx={{width:'150px', marginBottom:'10px'}}>Add new</Button>
        
        <Table data={loadedData} openModal={(item)=>handleOpenModal(item)}/>

        {
          modalData && <Modal open={modalOpen} data={modalData} setModalOpen={setModalOpen}/>
        }

        <Drawer open={open} onClose={toggleDrawer(false)} anchor='right'>
          <FormAddData handleAfterSubmit={handleDrawer}/>
        </Drawer>
        
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          open={openSnackbar}
          onClose={handleClose}
          key={'top' + 'left'}
          autoHideDuration={8000}
        >
          <Alert
            onClose={handleClose}
            severity={message.success?`success`:'error'}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {message.message && message.message?.map((item, i) => {
              return(
                <p key={i}>
                  {item}
                </p>
              )
            })}
          </Alert>
        </Snackbar>
    </>
  )
  
}
