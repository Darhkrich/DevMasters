import { loginAction } from "../auth";

export default function LoginPage() {

  return (
    <div>
      <h1>Login</h1>

      <form action={loginAction}>

        <input
          name="email"
          placeholder="Email"
          type="email"
        />

        <br/><br/>

        <input
          name="password"
          placeholder="Password"
          type="password"
        />

        <br/><br/>

        <button type="submit">
          Login
        </button>

      </form>

    </div>
  )
}