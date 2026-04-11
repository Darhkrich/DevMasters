import { logoutAction } from "../auth"

export default function LogoutPage() {

  return (
    <div>

      <h1>Logout</h1>

      <form action={logoutAction}>
        <button type="submit">
          Logout
        </button>
      </form>

    </div>
  )
}