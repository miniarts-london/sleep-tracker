import { Tracker } from "../../screen/Tracker"

// The login token lives in the browser's localStorage, which the server can't read,
// so the entries are loaded client-side inside <Tracker />.
export default function LibraryScreen() {
  return (
      <main className="flex min-h-screen flex-col p-24">
        <div className="items-center flex flex-col ">
          <h1 className="text-5xl font-black mb-10">Sleep tracker</h1>
        </div>

        <Tracker />
      </main>
  )
}
