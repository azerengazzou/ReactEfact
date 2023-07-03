import React from 'react'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom';
import ImageLight from '../assets/img/login-office.jpeg'
import ImageDark from '../assets/img/login-office-dark.jpeg'
import { Label, Input, Button } from '@windmill/react-ui'
import { useState } from 'react';
import '../pages/override.css';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

function Login() {
  const history = useHistory();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState('');

  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [roleuser,setRoleuser]=useState('');

  const handleLogin = async () => {
    try {
      setLoading(true); // Set loading state to true
      const response = await axios.post(`https://localhost:7287/gateway/Login`, {
        UserName: username,
        Password: password
      });
    
      const decodedToken = jwt_decode(response.data.jwtToken);
      setRoleuser(decodedToken.Role);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('role', decodedToken.Role);
      localStorage.setItem('token', response.data.jwtToken);
      localStorage.setItem('userName', response.data.userName);
      console.log(response.data);
    
      if (decodedToken.Role === 'Doctor') {
        history.push('/app/dashboard');
      } else {
        if(decodedToken.Role==='Administrator')
        {history.push('/app/dashboardAdmin');}
        else{
          {history.push('/app/dashboardSupport');}
        }
      }
    } catch (error) {
      console.error(error);
    
      if (error.response && error.response.status === 400) {
        setErrorMessage('Vérifiez les champs !');
      } else if (error.response && error.response.status === 401) {
        setErrorMessage("Utilisateur n'existe pas !");
      } else {
        setErrorMessage('Une erreur s\'est produite lors de la connexion.');
      }
    } finally {
      setLoading(false); // Set loading state to false when the request is completed (whether successful or with an error)
    }
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
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Accéder à votre compte</h1>
              
              <Label>
                <span>Nom d'utilisateur</span>
                <Input className="mt-1" required type="text" placeholder="corilusUser" value={username} onChange={(e) => setUsername(e.target.value)}/>
              </Label>

              <Label className="mt-4">
                <span>Mot de passe</span>
                <Input className="mt-1" required type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Label>
              <br></br>
  {/* Other form elements */}
  <Button className="bg-red-500" onClick={handleLogin} disabled={loading}>
              {loading ? 'Connecting...' : 'Connecter'}
            </Button>
            {/* Error message */}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {/* Other content */}

              <hr className="my-8" />
              <p className="mt-4">
                <Link className="forgot-psw" 
                  to="/forgot-password"
                >
                  Mot de passe oublié ?
                </Link>
              </p>
              <p className="mt-1">
                <Link
                  className="forgot-psw" 
                  to="/createAccount"
                >
                  Créer votre compte
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
