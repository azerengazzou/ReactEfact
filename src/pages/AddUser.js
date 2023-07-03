import React from 'react'
import { Link } from 'react-router-dom'
import { useState,useEffect } from 'react';
import axios from 'axios';
import ImageLight from '../assets/img/create-account-office.jpeg'
import ImageDark from '../assets/img/create-account-office-dark.jpeg'
import { GithubIcon, TwitterIcon } from '../icons'
import { Input, Label, Button } from '@windmill/react-ui'
import { Select } from '@windmill/react-ui'
import { useHistory } from 'react-router-dom';
import './override.css';
import './ProfileStyle.css';
function AddUser() {
    const [name, setName] = useState('');
    const [lastname, setLastName] = useState('');
    const [username, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState(null);
    const history = useHistory();
    useEffect(() => {
    
      // Retrieve token from localStorage
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(token);
      }
      
    }, []);
    const handleAddUser = async () => {
      const token = localStorage.getItem('token');
        try {
          const response = await axios.post('http://localhost:5248/api/UserRegistration', {
            username,
            password,
            role,
            name,
            lastname
          }, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request headers
            },
          });
          // Handle the response, e.g., display success message or redirect to another page
          console.log(response.data);
          history.push('/userManagement');
        } catch (error) {
          setError(error.response.data.message);
        }
      };
  
    const handleRoleChange = (selectedRole) => {
      setRole(selectedRole);
    };
  return (
    <div
    className={`flex h-screen bg-gray-50 dark:bg-gray-900 `}
  >
    <div className="flex flex-col flex-1 w-full">
     <div className="container">
          
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Ajouter un utilisateur
              </h1>
              <Label>
                <span className="profile-p">Nom</span>
                <Input className="mt-1" type="name" value={name} onChange={(e) => setName(e.target.value)}  />
              </Label>
              <Label>
                <span className="profile-p">Prénom</span>
                <Input className="mt-1" type="lastname" value={lastname} onChange={(e) => setLastName(e.target.value)} />
              </Label>
              <Label>
                <span className="profile-p">Email</span>
                <Input className="mt-1" type="email" placeholder="john@doe.com"  value={username} onChange={(e) => setEmail(e.target.value)}/>
              </Label>
              <Label className="mt-4">
              <span className="profile-p">Rôle</span>
              <Select className="mt-1"  value={role} onChange={(e) => setRole(e.target.value)} >
                <option value="">Sélectionnez un rôle</option>
                <option value="User">Utilisateur</option>
                <option value="Administrator">Admin</option>
              </Select>
            </Label>
              <Label className="mt-4">
                <span className="profile-p">Mot de passe</span>
                <Input className="mt-1" placeholder="***************" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
              </Label>
              

              <br></br>
              <br></br>

              <Button className="bg-red-500" onClick={handleAddUser} block >
                Confirmer
              </Button>

              <hr className="my-8" />

            </div>
          </main>
          </div>
       
      </div>
    
    </div>
  )
}

export default AddUser
