
const host = 'http://localhost:3001'//'https://sleep-tracker-api.vercel.app'

export function ssrApiGet(
    url: string,
    useCache?: boolean,
  ) {
  
    return fetch(url, {
      cache: useCache ? 'force-cache' : 'no-store',
    }).catch((err) => {
      console.log(`Failed ssrApiGet '${url}'`)
      throw err
    })
}

export function ssrApiPost(
  url: string,
  data: any,
  useCache?: boolean,
) {

  return fetch(url, {
    method: 'POST',
    cache: useCache ? 'force-cache' : 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).catch((err) => {
    console.log(`Failed ssrApiGet '${url}'`)
    throw err
  })
}

export async function getAssetDetails(
    id: string
  ) 
  {
    const url = `${host}/api/users/${id}/entries`
  
    const res = await ssrApiGet(url, false)

    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    
    return res.json()
   
}

export async function fetchAssetListFromAPI(){
  const url = `${host}/api/entries`
 
  const res = await ssrApiGet(url, false)

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  
  return res.json()
}

export async function addNewData(data:any){
  const url = `${host}/api/entries`
 
  const res = await ssrApiPost(url, data, false)

  return res.json()
}