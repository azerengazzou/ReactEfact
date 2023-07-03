import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Input, Label, Button } from '@windmill/react-ui'
import { Select } from '@windmill/react-ui'
import { useParams } from 'react-router-dom';
import './override.css';
import './ProfileStyle.css';
import PageTitle from '../components/Typography/PageTitle'
import { Card, CardBody } from '@windmill/react-ui'

function EditUser() {
    const { id }=useParams();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [identifiant, setIdentifiant] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState('');
  const history = useHistory();
  useEffect(() => {
    
    // Retrieve token from localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(token);
    }
    
  }, []);
  useEffect(() => {
    // Fetch user data from an API or any other source
    const fetchUserData = async (id) => {
        const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`https://localhost:7287/gateway/Auth/${id}`); // Replace 123 with the actual user ID
        const userData = response.data;
        console.log(userData);
        // Set the state with the fetched user data
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setIdentifiant(userData.identifiant);
        setUserName(userData.userName);
        setPassword(userData.password);
        setRole(userData.role);
        setEmail(userData.email);
        setPhone(userData.phone);

      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData(id);
  }, [id]);

  const handleUpdateUser = async () => {
    try {
      const response = await axios.put(`https://localhost:7287/gateway/Auth/${id}`, {
        firstName: firstName,
        lastName:lastName,
        identifiant:identifiant,
        userName:userName,
        password:password,
        role:role,
        email:email,
        phone:phone,
      }, {
      }); // Replace 123 with the actual user ID

      // Handle the response, e.g., display success message or redirect to another page
      console.log(response.data);
      history.push('/app/userManagement');
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Authentication failed, show an error message to the user
        setErrorMessage('Vérifiez les champs !');
        // You can set a state variable to display the error message in your component
      }
      else {
        // Other error occurred, handle as needed
        setErrorMessage('Vérifiez les champs !');
      }
    }
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900`}>
      
        <div className="flex flex-col flex-1 w-full">
      {/* Rest of your code... */}
      <div className="container">
        <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
          <div className="w-full">
            
          <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">
              Modifier un utilisateur
            </p>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <div className="flex flex-wrap mt-2">
            
        <div className="w-full md:w-1/2 mb-4 md:mb-2">
          <Label>
            <span>Nom</span>
            <Input className="mt-1 "
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}/>
          </Label>
        </div>
        <div className="w-full md:w-1/2">
          <Label>
            <span className='ml-2'>Prénom</span>
            <Input className="mt-1 ml-2" value={firstName}
                onChange={(e) => setFirstName(e.target.value)}/>
          </Label>
        </div>

        <div className="w-full md:w-1/2 mb-4 md:mb-2">
          <Label>
            <span>Nom d'utilisateur</span>
            <Input type="text" className="mt-1" value={userName}
                onChange={(e) => setUserName(e.target.value)}/>
          </Label>
        </div>
        
        <div className="w-full md:w-1/2">
          <Label>
            <span className='ml-2'>Email</span>
            <Input type="email"className="mt-1 ml-2"  value={email}
                onChange={(e) => setEmail(e.target.value)}/>
          </Label>
        </div>


        <div className="w-full md:w-1/2 mb-4 md:mb-2">
          <Label>
            <span>Téléphone</span>
            <Input className="mt-1" type="number"  value={phone}
                onChange={(e) => setPhone(e.target.value)}/>
          </Label>
        </div>
        <div className="w-full md:w-1/2">
          <Label>
            <span className='ml-2'>Identifiant</span>
            <Input className="mt-1 ml-2"  value={identifiant}
                onChange={(e) => setIdentifiant(e.target.value)}/>
          </Label>
        </div>
        <div className="w-full md:w-1/2">
          <Label>
            <span>Code département</span>
            <Input className="mt-1"  value={identifiant}
                onChange={(e) => setIdentifiant(e.target.value)}/>
          </Label>
        </div>

        <div className="w-full md:w-1/2">
          <Label>
            <span className='ml-2'>Role</span>
            <Select className="mt-1 ml-2"  value={role}
                onChange={(e) => setRole(e.target.value)}>
            <option>Administrator</option>
            <option>Support</option>
            <option>Doctor</option>
            </Select>
          </Label>
        </div>
      </div>
            <br/>
            <Button className="bg-red-500" onClick={handleUpdateUser} block>
              Mettre à jour
            </Button>

            {/* Rest of the code */}
          </div>
        </main>
      </div>
      </div>
      {/* Rest of your code... */}
    </div>
  );
}

export default EditUser;
