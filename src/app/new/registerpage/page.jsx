import { registerAction } from "../auth";

export default function RegisterPage() {

  return (
    <div>
      <h1>Register</h1>

      <form action={registerAction}>

        <input
          name="first_name"
          placeholder="First Name"
        />

        <br/><br/>

        <input
          name="last_name"
          placeholder="Last Name"
        />

        <br/><br/>

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
          Register
        </button>

      </form>

    </div>
  )
}