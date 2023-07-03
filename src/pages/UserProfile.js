import React, { useState, useEffect } from 'react'

import { Input, HelperText, Label, Select, Textarea } from '@windmill/react-ui'
import { Link } from 'react-router-dom';
import { EditIcon, TrashIcon,MenuIcon } from '../icons'
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
import './ProfileStyle.css'
import Care from '../assets/img/conncare.png';
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = React.useState([]);
  
  const history=useHistory();
 
  useEffect(() => {
    // Retrieve user information from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const handleEditUser = () => {
    // Redirect to the update user page with the user ID
    history.push(`/editUser/${user.userID}`);
  };
  return (
    <div>
      <PageTitle>Profile</PageTitle>
      <div className="mb-8">
  <Card>
    <CardBody>
      <div className="image-container">
        <img src={Care} className="centered-image" alt="Profile Image" />
      </div>
      <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Informations de votre compte</p>
      <p className="text-gray-600 dark:text-gray-400"></p>
      <div className="flex flex-wrap mt-2">
        <div className="w-full md:w-1/2 mb-4 md:mb-2">
          <Label>
            <span>Nom</span>
            <Input className="mt-1 "/>
          </Label>
        </div>
        <div className="w-full md:w-1/2">
          <Label>
            <span className='ml-2'>Prénom</span>
            <Input className="mt-1 ml-2"/>
          </Label>
        </div>

        <div className="w-full md:w-1/2 mb-4 md:mb-2">
          <Label>
            <span>Nom d'utilisateur</span>
            <Input type="email" className="mt-1"/>
          </Label>
        </div>
        
        <div className="w-full md:w-1/2">
          <Label>
            <span className='ml-2'>Email</span>
            <Input className="mt-1 ml-2"/>
          </Label>
        </div>


        <div className="w-full md:w-1/2 mb-4 md:mb-2">
          <Label>
            <span>Numéro</span>
            <Input className="mt-1" type="number"/>
          </Label>
        </div>
        <div className="w-full md:w-1/2">
          <Label>
            <span className='ml-2'>Identifiant</span>
            <Input className="mt-1 ml-2"/>
          </Label>
        </div>

        <div className="w-full mt-4">
          <Button tag={Link}>Modifier</Button>
        </div>
      </div>
    </CardBody>
  </Card>
</div>


      </div>
  )
};

export default ProfilePage;