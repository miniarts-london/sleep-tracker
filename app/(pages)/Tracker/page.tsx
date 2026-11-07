import { Tracker } from "../../screen/Tracker"
import {fetchAssetListFromAPI } from "../../utils/requests"

const getAssetList = () => {
  /* API request */
  return fetchAssetListFromAPI()
}

export default async function LibraryScreen() {
  const data = await getAssetList()

  return (
      <main className="flex min-h-screen flex-col p-24">
        <div className="items-center flex flex-col ">
          <h1 className="text-5xl font-black mb-10">Sleep tracker</h1>
        </div>

        {data ? <Tracker data={data || []} /> : <>Sorry, no data</>}
      </main>
  )
}
