import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { Button } from '@mui/material'
import { EntryDetail } from '../models/assets'

type TableProps = {
    data: any
    openModal: (val:object) => void
}
const Table = ({data, openModal}: TableProps) => {

    const columns = useMemo<MRT_ColumnDef<EntryDetail>[]>(
      () => [
        
        {
            accessorKey: 'user_id',
            header: 'ID',
            size: 200,
        },
        {
            accessorKey: 'first_name', 
            header: 'First Name',
            size: 150,
        },
        {
            accessorKey: 'last_name', 
            header: 'Last Name',
            size: 150,
        },
        {
            accessorKey: 'count',
            header: 'Count',
            size: 150,
        },
        {
            header: 'View details',
            Cell:((item)=>{
                return <Button variant='outlined' onClick={()=>{handleClickCell(item)}}>open</Button>
            })
        }
      ],
      [],
    );
  
    const handleClickCell = (item:any) =>  {
        openModal(item.row.original)
    }

    const table = useMaterialReactTable({
      columns,
      data,
    });
  
    return <MaterialReactTable 
        table={table} 
    />;
  };
  
  export default Table;