import React, { useState, useEffect } from 'react'

import { Link } from 'react-router-dom';
import { EditIcon, TrashIcon,MenuIcon, SearchIcon } from '../icons'
import ChartCard from '../components/Chart/ChartCard'
import { Doughnut, Line } from 'react-chartjs-2'
import ChartLegend from '../components/Chart/ChartLegend'
import { useHistory } from "react-router-dom";
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
  Button
} from '@windmill/react-ui'
import axios from 'axios'

import PageTitle from '../components/Typography/PageTitle'
import SectionTitle from '../components/Typography/SectionTitle'
import InfoCard from '../components/Cards/InfoCard'
import { Card, CardBody } from '@windmill/react-ui'
import { CartIcon, ChatIcon, MoneyIcon, PeopleIcon } from '../icons'
import RoundIcon from '../components/RoundIcon'
import moment from 'moment';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@windmill/react-ui'
import { Input, HelperText, Label, Select, Textarea } from '@windmill/react-ui'
const UserManagement = () => {
  const [deletionKey, setDeletionKey] = React.useState([]);
  const [token, setToken] = useState('');
  const history2=useHistory();
  const history=useHistory();
  const [data, setData] = useState([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    identifiant: '',
    email: '',
    role:'',
    password: '',
  });

  const [roleData, setRoleData] = useState({
    Administrator: [],
    Support: [],
    Doctor: [],
  });

  const [message,setMessage]=useState("");
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };
  
  const handleDeleteUser = (id) => {
    axios
      .delete(`https://localhost:7287/gateway/Auth/${id}`)
      .then(response => {
        if (response.status === 200) {
          // Refetch the user data from the server
          show();
        }
      })
      .catch(error => {
        // Handle error
        console.log(error);
      });
  };  
  
  const handleEditUser = (id) => {
    // Redirect to the update user page with the user ID
    history.push(`/app/editUser/${id}`);
  };
  const show = () => {
    const token = localStorage.getItem('token');
    axios.get("https://localhost:7287/gateway/Users")
      .then(response => {
        const responseData = response.data;
        console.log(responseData);
        setData(responseData);
  
        const filteredUsers = {
          Doctor: responseData.filter(user => user.role === 'Doctor'),
          Administrator: responseData.filter(user => user.role === 'Administrator'),
          Support: responseData.filter(user => user.role === 'Support'),
        };
        setRoleData(filteredUsers);
        console.log(filteredUsers);
      })
      .catch(error => {
        // Handle error
        console.log(error);
      });
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
  
  useEffect(() => {
    show();
  }, []);
  

  const [isModalOpen, setIsModalOpen] = useState(false)

  function openModal() {
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }

  return (
    <>
    <PageTitle>Liste des utilisateurs</PageTitle>
    <div className="mb-8">
      <Card>
        <CardBody>
          <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Utilisateurs</p>
          <p className="text-gray-600 dark:text-gray-400">
            Tableau de gestion des utilisateurs de système Gestion eFact: organisez et suivez les utilisateurs de système. 3 Roles disponibles
          </p>
          <br/>
          <Button onClick={openModal}>
                    Ajouter un nouveau utilisateur
          </Button>
        </CardBody>
      </Card>
    </div>
    <div>

    <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Support Technique</p>
    <TableContainer>
  <Table>
    <TableHeader>
      <tr>
        <TableCell>Nom</TableCell>
        <TableCell>Prénom</TableCell>
        <TableCell>Nom d'utilisateur</TableCell>
        <TableCell>Code Département</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>Téléphone</TableCell>
        <TableCell>Date d'ajout</TableCell>
        <TableCell>Actions</TableCell>
      </tr>
    </TableHeader>
    <TableBody>
      {roleData.Support.map(user => (
        <TableRow key={user.userId}>
          <TableCell>
            <div className="flex items-center text-sm">
              <div>
                <p className="font-semibold">{user.lastName}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center text-sm">
              <div>
                <p className="font-semibold">{user.firstName}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center text-sm">
              <div>
                <p className="font-semibold">{user.userName}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center text-sm">
              <div>
                <p className="font-semibold">{user.identifiant}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center text-sm">
              <div>
                <p className="font-semibold">{user.email}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center text-sm">
              <div>
                <p className="font-semibold">{user.phone}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center text-sm">
              <div>
                <p className="font-semibold">{moment(user.addDate).format('DD/MM/YYYY HH:mm')}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-4">
              <Button layout="link" size="icon" aria-label="View" onClick={() => handleEditUser(user.userId)}>
                <MenuIcon className="w-5 h-5" aria-hidden="true" />
              </Button>
              <Button layout="link" size="icon" aria-label="Delete" onClick={() => handleDeleteUser(user.userId)}>
                <TrashIcon className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  <TableFooter></TableFooter>
</TableContainer>



    <p className="mb-4 mt-2 font-semibold text-gray-600 dark:text-gray-300">Prestataires de soins</p>
    
    <TableContainer>
  <Table>
    <TableHeader>
      <tr>
        <TableCell>Nom</TableCell>
        <TableCell>Prénom</TableCell>
        <TableCell>Nom d'utilisateur</TableCell>
        <TableCell>Identifiant</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>Téléphone</TableCell>
        <TableCell>Date d'ajout</TableCell>
        <TableCell>Actions</TableCell>
      </tr>
    </TableHeader>
    <TableBody>
      {roleData.Doctor.map(user => (
        <TableRow key={user.userId}>
          <TableCell>
            <div className="flex items-center text-sm">
              <div>
                <p className="font-semibold">{user.lastName}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center text-sm">
              <div>
                <p className="font-semibold">{user.firstName}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center text-sm">
              <div>
                <p className="font-semibold">{user.userName}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center text-sm">
              <div>
                <p className="font-semibold">{user.identifiant}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center text-sm">
              <div>
                <p className="font-semibold">{user.email}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center text-sm">
              <div>
                <p className="font-semibold">{user.phone}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center text-sm">
              <div>
                <p className="font-semibold">{moment(user.addDate).format('DD/MM/YYYY HH:mm')}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-4">
              <Button layout="link" size="icon" aria-label="View" onClick={() => handleEditUser(user.userId)}>
                <MenuIcon className="w-5 h-5" aria-hidden="true" />
              </Button>
              <Button layout="link" size="icon" aria-label="Delete" onClick={() => handleDeleteUser(user.userId)}>
                <TrashIcon className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  <TableFooter></TableFooter>
</TableContainer>

    <p className="mb-4 mt-2 font-semibold text-gray-600 dark:text-gray-300">Administrateurs</p>
    <TableContainer>
  <Table>
    <TableHeader>
      <tr>
        <TableCell>Nom</TableCell>
        <TableCell>Prénom</TableCell>
        <TableCell>Nom d'utilisateur</TableCell>
        <TableCell>Email</TableCell>
        <TableCell>Date d'ajout</TableCell>
        <TableCell>Actions</TableCell>
      </tr>
    </TableHeader>
    <TableBody>
      {roleData.Administrator.map(user => (
        <TableRow key={user.userId}>
          <TableCell>
            <div className="flex items-center text-sm">
              <div>
                <p className="font-semibold">{user.lastName}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center text-sm">
              <div>
                <p className="font-semibold">{user.firstName}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center text-sm">
              <div>
                <p className="font-semibold">{user.userName}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center text-sm">
              <div>
                <p className="font-semibold">{user.email}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center text-sm">
              <div>
                <p className="font-semibold">{moment(user.addDate).format('DD/MM/YYYY HH:mm')}</p>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-4">
              <Button layout="link" size="icon" aria-label="View" onClick={() => handleEditUser(user.userId)}>
                <MenuIcon className="w-5 h-5" aria-hidden="true" />
              </Button>
              <Button layout="link" size="icon" aria-label="Delete" onClick={() => handleDeleteUser(user.userId)}>
                <TrashIcon className="w-5 h-5" aria-hidden="true" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  <TableFooter></TableFooter>
</TableContainer>

  </div>

  <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Ajouter un nouvel utilisateur </ModalHeader>
        <ModalBody>
        <Card>
    <CardBody>
      <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Informations de compte</p>
      <p className="text-gray-600 dark:text-gray-400"></p>
      <div className="flex flex-wrap mt-2">
        <div className="w-full md:w-1/2 mb-4 md:mb-2">
          <Label>
            <span>Nom</span>
            <Input className="mt-1 " type="text" id="lastName"
                    placeholder="nom"
                    onChange={handleChange}/>
          </Label>
        </div>
        <div className="w-full md:w-1/2">
          <Label>
            <span className='ml-2'>Prénom</span>
            <Input className="mt-1 ml-2" type="text" id="firstName"
                    placeholder="prénom"
                    onChange={handleChange}/>
          </Label>
        </div>

        <div className="w-full md:w-1/2 mb-4 md:mb-2">
          <Label>
            <span>Nom d'utilisateur</span>
            <Input type="text"  id="userName"
                    placeholder="nom compte d'utilisateur"
                    onChange={handleChange} className="mt-1"/>
          </Label>
        </div>

        <div className="w-full md:w-1/2">
          <Label>
            <span>Mot de passe</span>
            <Input className="mt-1 ml-2" type="password" id="password"
                    placeholder="********"
                    onChange={handleChange}/>
          </Label>
        </div> 

        <div className="w-full md:w-1/2 mb-4 md:mb-2">
          <Label>
            <span className='ml-2'>Email</span>
            <Input className="mt-1"  type="email" id="email"
                    placeholder="email"
                    onChange={handleChange} />
          </Label>
        </div>


        <div className="w-full md:w-1/2">
          <Label>
            <span>Numéro</span>
            <Input id="phone"
                    placeholder="numéro tel"
                    onChange={handleChange} className="mt-1 ml-2" type="number" />
          </Label>
        </div>
        <div className="w-full md:w-1/2 mb-4 md:mb-2">
          <Label>
            <span className='ml-2'>Identifiant</span>
            <Input type="text"  id="identifiant"
                    placeholder="identifiant"
                    onChange={handleChange} className="mt-1"/>
          </Label>
        </div>
        <div className="w-full md:w-1/2">
          <Label>
            <span>Code département</span>
            <Input type="text"  id="identifiant"
                    placeholder="code département"
                    onChange={handleChange} className="mt-1 ml-2"/>
          </Label>
        </div>

        <div className="w-full md:w-1/2 mb-4 md:mb-2">
          <Label>
            <span className='ml-2'>Role</span>
            <Select id="role" className="mt-1 ml-2" onChange={handleChange}>
            <option value="">Sélectionnez un rôle</option>
            <option value="Administrator">Administrateur</option>
            <option value="Support">Support Technique</option>
            <option value="Doctor">Médecin</option>
            </Select>
          </Label>
        </div>
        <Label className="mt-6" check>
                <span className="ml-2">
                {message && <p >{message}</p>}
                </span>
              </Label>
      </div>
    </CardBody>
  </Card>

        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block" onClick={handleSubmit}>
            <Button>Ajouter</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" onClick={handleSubmit}>
              Ajouter
            </Button>
          </div>
        </ModalFooter>
      </Modal>
  </>
  )};
export default UserManagement;