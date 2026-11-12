import { Login } from "../../screen/Login"

export default function LoginScreen() {
  return (
      <main className="flex min-h-screen flex-col items-center p-6 sm:p-24">
        <h1 className="text-5xl font-black mb-10">Sleep tracker</h1>

        <Login />
      </main>
  )
}
