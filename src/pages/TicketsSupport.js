import React, { useState, useEffect } from 'react'
import { EditIcon, TrashIcon,MenuIcon } from '../icons'
import InfoCard from '../components/Cards/InfoCard'
import ChartCard from '../components/Chart/ChartCard'
import { Doughnut, Line } from 'react-chartjs-2'
import ChartLegend from '../components/Chart/ChartLegend'
import PageTitle from '../components/Typography/PageTitle'
import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon,FormsIcon } from '../icons'
import RoundIcon from '../components/RoundIcon'
import { useHistory } from "react-router-dom";
import SectionTitle from '../components/Typography/SectionTitle'
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
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@windmill/react-ui'
import { Card, CardBody } from '@windmill/react-ui'
import moment from 'moment';

import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
} from '../utils/demo/chartsData'
import Header from '../components/Header'
import axios from 'axios'
import '../pages/override.css'
import { Input, HelperText, Label, Select, Textarea } from '@windmill/react-ui'

const TicketsSupport = () => {
  const history = useHistory();

  const renderFile = (id) => {
    history.push(`/app/discussion/${id}`);
  };

const [token, setToken] = useState('');
const [data, setData] = React.useState([]);
const [dataSujet, setdataSujet] = React.useState([]);

const show = () => {
  const token = localStorage.getItem('token');
  const userRef=localStorage.getItem('userId');
  console.log(token);
  console.log(userRef);
  setToken(token);
  axios.get(`https://localhost:7287/gateway/AllTickets`, {
  })
    .then(response => {
      const data = response.data;
      console.log(data);
      setData(data);
    })
    .catch(error => {
      // Handle error
      console.log(error);
    });
};

const [statusFilter, setStatusFilter] = useState('');

const handleStatusFilterChange = (e) => {
  setStatusFilter(e.target.value);
};

const filteredData = data.filter((item) => {
    if (statusFilter === '') return true;
    return item.status.toString() === statusFilter;
  });

  const renderTicket = (id) => {
    history.push(`/app/discussion/${id}`);
  };

const handleDeleteticket = (id) => {
  console.log(id);
  try {
    axios.delete(`https://localhost:7287/gateway/Ticket/${id}`)
    .then(response => {
     show();
     console.log(response);
    });
  } catch (error) {
      console.error(error);
  }};


useEffect(() => {
  show();
}, []);

  return (
    <div>
    <PageTitle>Tickets d'assistance</PageTitle>
    <Select value={statusFilter} onChange={handleStatusFilterChange}>
        <option value="">Chercher par état du ticket</option>
        <option value="0">En attente</option>
        <option value="1">Traitement en cours</option>
        <option value="2">Fermé</option>
        </Select>
    <br/>

    <div className="grid grid-cols-2 gap-4">
   {filteredData.map((data, id) => (
    <div className="mb-2">
      <Card style={{ borderWidth: '1px' }}>
        <CardBody key={id} >
          <div className="flex items-center justify-between">
            <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Code Ticket: {data.codeTicket}</p>
            <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Date de création: {moment(data.upload_date).format('DD/MM/YYYY HH:mm')}</p>
          </div>
          <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Sujet: {data.sujetTicket.description}</p>
          <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Description Supplémentaire: {data.description}</p>
          <div className="flex items-center justify-between">
            <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Etat: 
              {data.status === 0 && (
                <Badge type="primary">En attente </Badge>
              )}
              {data.status === 1 && (
                <Badge type="warning">Traitement en cours</Badge>
              )}
              {data.status === 2 && (
                <Badge type="success">Fermé</Badge>
              )}
            </p>
            <div className='flex'>
              <div className="justify-end mr-1">
               <Button icon={ChatIcon} aria-label="Edit" onClick={() => renderTicket(data.id)} />
              </div>
              <div className="justify-end">
              <Button icon={TrashIcon} aria-label="supprimer" onClick={() => handleDeleteticket(data.id)} />
            </div>
            </div>
          </div>
          
        </CardBody>
      </Card>
    </div>
  ))}
  </div>
  </div>
  );
}
export default TicketsSupport;