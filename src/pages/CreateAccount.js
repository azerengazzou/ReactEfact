import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import ImageLight from '../assets/img/create-account-office.jpeg'
import ImageDark from '../assets/img/create-account-office-dark.jpeg'
import { GithubIcon, TwitterIcon } from '../icons'
import { Input, Label, Button } from '@windmill/react-ui'
import { useState } from 'react';
function Login() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    identifiant: '',
    email: '',
    role:'',
    password: '',
    phone:'',
  });
  const [message,setMessage]=useState("");
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log(formData);
    axios.post('https://localhost:7287/gateway/Register', formData).then((response) => {
        console.log(formData);
        if (response.status === 200) {
          setMessage('Le compte a été crée avec succès !');
        }
          // You can set a state variable to display the error message in your component
      })
      .catch((error) => {
        console.error(error);
      if (error.response && error.response.status === 400) {
        // Authentication failed, show an error message to the user
        setMessage('Vérifiez les champs !');
        // You can set a state variable to display the error message in your component
      }
      else {
        // Other error occurred, handle as needed
        setMessage('vérifiez les champs !');
      }
      });
  };
  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Créer votre compte
              </h1>
              <Label>
  <span>Prénom</span>
  <Input
  id="firstName"
    className="mt-1"
    type="text"
    placeholder="votre prénom"
    required
    pattern="[A-Za-z]+"
    title="Veuillez entrer uniquement des lettres"
    onChange={handleChange}
  />
</Label>
<Label>
  <span>Nom</span>
  <Input
    className="mt-1"
    id="lastName"
    type="text"
    placeholder="votre nom"
    required
    pattern="[A-Za-z]+"
    title="Veuillez entrer uniquement des lettres"
    onChange={handleChange}
  />
</Label>
<Label>
  <span>Nom d'utilisateur</span>
  <Input
    id="userName"
    className="mt-1"
    type="text"
    placeholder="nom compte d'utilisateur"
    required
    onChange={handleChange}
  />
</Label>
<Label>
  <span>Identifiant</span>
  <Input
    id="identifiant"
    className="mt-1"
    type="number"
    placeholder="Identifiant"
    required
    onChange={handleChange}
  />
</Label>
<Label>
  <span>Email</span>
  <Input
    id="email"
    className="mt-1"
    type="email"
    placeholder="john@doe.com"
    required
    onChange={handleChange}
  />
</Label>
<Label>
  <span>Telephone</span>
  <Input
    id="phone"
    className="mt-1"
    type="number"
    required
    onChange={handleChange}
  />
</Label>
<Label className="mt-4">
  <span>Mot de passe</span>
  <Input
    id="password"
    className="mt-1"
    placeholder="***************"
    type="password"
    required
    minLength="8"
    title="Le mot de passe doit contenir au moins 8 caractères"
    onChange={handleChange}
  />
</Label>
<Label className="mt-4">
  <span>Confirmer mot de passe</span>
  <Input
    className="mt-1"
    placeholder="***************"
    type="password"
    required
    minLength="8"
    title="Le mot de passe doit contenir au moins 8 caractères"
  />
</Label>
              <Label className="mt-6" check>
                <span className="ml-2">
                {message && <p >{message}</p>}
                </span>
              </Label>
              
              <Button onClick={handleSubmit} block className="mt-4">
                Créer votre compte
              </Button>
              <hr className="my-4" />
              <p className="mt-1">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to="/login"
                >
                  "Vous avez déjà un compte ? Connectez-vous."
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default Login
