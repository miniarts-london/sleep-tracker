import React, { useState, useEffect } from 'react'
import { ViewChart } from './ViewChart'
import { getAssetDetails, UnauthorizedError } from '../utils/requests'
import { EntryDetail, ModalDataProps } from '../models/assets'

interface ModalProps{
    open: boolean
    data: ModalDataProps
    setModalOpen: (val:boolean) => void
    children?: any
}

export function Modal({ open, data, setModalOpen, children }: ModalProps) {
    
    const [assetDetail, setAssetDetail] = useState<EntryDetail[]>()
    const [error, setError] = useState<string>()

    useEffect(()=>{
        const getDetails = async() => {
            setAssetDetail(undefined)
            setError(undefined)
            try {
                setAssetDetail(await getAssetDetails(data.user_id))
            } catch (err) {
                if (err instanceof UnauthorizedError) return // redirecting to /login
                // e.g. 403 when opening another user's entries
                setError(err instanceof Error ? err.message : 'Failed to fetch data')
            }
        }

        getDetails()
    },[data])

    const handleSetModalOpen = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation()
        if((e.target as any).id === "default-modal"){
            setModalOpen(false)
        }
    }
        
    return (
        <>
            <div id="default-modal" aria-hidden="true" onClick={(e)=>handleSetModalOpen(e)} className={`${open?'':'hidden'} fixed z-50 inset-0 bg-gray-400 bg-opacity-60 overflow-y-auto h-full w-full px-4`}>
                <div className="relative top-20 mx-auto shadow-xl rounded-md bg-white max-w-3xl p-4 z-51" >
                    <div className="flex items-center justify-end p-2 gap-4">
                        <button type="button" onClick={()=>setModalOpen(false)} className="text-gray-400 bg-transparent hover:bg-gray-200" data-modal-hide="default-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                
                    { error && <p className="p-4 text-red-700">{error}</p> }
                    { assetDetail && <ViewChart data={assetDetail}/> }
                                   
                    {children}
                </div>
            </div>
        </>
    )
}