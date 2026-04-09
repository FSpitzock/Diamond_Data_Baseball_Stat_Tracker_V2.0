import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import Auth from "../utils/auth";

const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

const Login: React.FC = () => {
  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [login, { error }] = useMutation(LOGIN_USER);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await login({
        variables: { ...formState },
      });

      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="max-w-md mx-auto mt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Login</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="items-stretch w-full"
          type="email"
          name="email"
          placeholder="Email"
          value={formState.email}
          onChange={handleChange}
        />

        <input
          className="items-stretch w-full"
          type="password"
          name="password"
          placeholder="Password"
          value={formState.password}
          onChange={handleChange}
        />

        <button type="submit" className="buttonPrimary">
          Login
        </button>
      </form>

      {error && (
        <p className="text-red-500 font-semibold">Login failed. Check your credentials.</p>
      )}
    </section>
  );
};

export default Login;