import React, { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import Auth from "../utils/auth";

const ADD_USER = gql`
  mutation AddUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

const Signup: React.FC = () => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [addUser, { error }] = useMutation(ADD_USER);

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
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="max-w-md mx-auto mt-10 flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Sign Up</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="items-stretch w-full"
          type="text"
          name="username"
          placeholder="Username"
          value={formState.username}
          onChange={handleChange}
        />

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
          Sign Up
        </button>
      </form>

      {error && (
        <p className="text-red-500 font-semibold">Signup failed. Try a different email/username.</p>
      )}
    </section>
  );
};

export default Signup;