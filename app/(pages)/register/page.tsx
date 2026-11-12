import { Register } from "../../screen/Register"

export default function RegisterScreen() {
  return (
      <main className="flex min-h-screen flex-col items-center p-6 sm:p-24">
        <h1 className="text-5xl font-black mb-10">Sleep tracker</h1>

        <Register />
      </main>
  )
}
