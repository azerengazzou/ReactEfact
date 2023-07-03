import React, { useState, useEffect } from 'react'

import { Link } from 'react-router-dom';
import { EditIcon, TrashIcon,MenuIcon, SearchIcon } from '../icons'
import ChartCard from '../components/Chart/ChartCard'
import { Doughnut, Line } from 'react-chartjs-2'
import ChartLegend from '../components/Chart/ChartLegend'
import { useHistory } from "react-router-dom";
import { Input, HelperText, Label, Select, Textarea } from '@windmill/react-ui'

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
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@windmill/react-ui'

import PageTitle from '../components/Typography/PageTitle'
import SectionTitle from '../components/Typography/SectionTitle'
import InfoCard from '../components/Cards/InfoCard'
import { Card, CardBody } from '@windmill/react-ui'
import { CartIcon, ChatIcon, MoneyIcon, PeopleIcon } from '../icons'
import RoundIcon from '../components/RoundIcon'
import moment from 'moment';
function TicketDoctor() {
  const[formattedDate,setFormattedDate]=("");
    const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const history2=useHistory();
  const [page, setPage] = useState(1)
  const [data, setData] = React.useState([]);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [message,setMessage]=useState("");
  const [sujets, setSujets] = useState([]);
  const [selectedSujetId, setSelectedSujetId] = useState();
  const [description, setDescription] = useState("");

  useEffect(() => {
    setUserId(localStorage.getItem("userId"));
    Sujets();
  }, []); // Run only once on component mount

  const handleSujetChange = (e) => {
    const { value } = e.target;
    setSelectedSujetId(value);
  };
  const handleDescriptionChange = (e) => {
    const { value } = e.target;
    setDescription(value);
  };
  const handleaddticket = () => {
    try {
      const requestData = {
        description: description,
        sujetId: selectedSujetId,
        userRef: userId,
      };
      axios
        .post(`https://localhost:7287/gateway/NewTicket`, requestData)
        .then((response) => {
          console.log(response);
            setErrorMessage("Votre demande a été soumise avec succès ! Veuillez patienter pendant qu'un agent de support technique examine votre ticket et vous répondra sous peu.");
            show(); // Refresh the ticket list
        });
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        // Authentication failed, show an error message to the user
        setErrorMessage("Vérifiez les champs !");
        // You can set a state variable to display the error message in your component
      } else {
        // Other error occurred, handle as needed
        setErrorMessage("Vérifiez les champs !");
      }
    }
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

    const Sujets = () => {
        try {
          axios.get(`https://localhost:7287/gateway/Sujets`)
          .then(response => {
            console.log(response.data);
            setSujets(response.data);
            show();
          });
        } catch (error) {
            console.error(error);
        }};


        const [statusFilter, setStatusFilter] = useState('');

        const handleStatusFilterChange = (e) => {
          setStatusFilter(e.target.value);
        };
      
        const filteredData = data.filter((item) => {
            if (statusFilter === '') return true;
            return item.status.toString() === statusFilter;
          });

    const show = () => {
      const token = localStorage.getItem('token');
      const userRef=localStorage.getItem('userId');
      console.log(token);
      console.log(userRef);
      setToken(token);
      axios.get(`https://localhost:7287/gateway/TicketsByUser?userIdRef=${userRef}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      
    useEffect(() => {
    setUserId(localStorage.getItem("userId"));
      show();
    }, []);
    const [isModalOpen, setIsModalOpen] = useState(false)

    function openModal() {
      setIsModalOpen(true)
    }
  
    function closeModal() {
      setIsModalOpen(false)
    }

    const renderTicket = (id) => {
      history.push(`/app/discuss/${id}`);
    };

  return (
    <>
          <div className="mb-2">
            <br/>
            <Card >
              <CardBody>
                <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Tickets d'assistance</p>
                <p className="text-gray-600 dark:text-gray-400">
                Suivez et gérez facilement tous vos tickets d'assistance liés à la facturation électronique. Obtenez un aperçu clair de l'état de vos demandes et assurez un traitement rapide et efficace.
                </p>
              </CardBody>
              <Button className="mb-4 ml-4" onClick={openModal}>
                    Ouvrir un ticket
                </Button>
            </Card>
          </div>
          <div>
          <p className="mb-2 mt-4 font-semibold text-gray-600 dark:text-gray-300">La liste des Tickets</p>
        <Select value={statusFilter} onChange={handleStatusFilterChange}>
        <option value="">Chercher par état du ticket</option>
        <option value="0">En attente</option>
        <option value="1">Traitement en cours</option>
        <option value="2">Fermé</option>
        </Select>
    <br/>

    <div className="grid grid-cols-2 gap-4 pt-1">
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
                {data.discussions.length > 0 && <Button icon={ChatIcon} aria-label="Edit" onClick={() => renderTicket(data.id)} />}
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
  
  <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Ticket demande d'assistance</ModalHeader>
        <ModalBody>
        <Card>
    <CardBody>
      <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Informations du ticket</p>
      <p className="text-gray-600 dark:text-gray-400"></p>
      <div className=" mt-2">
        <div className="w-full">
        <Label>
                <span className='mt-2'>Sujet</span>
                <Select
                id="sujetId"
                className="mt-1"
                onChange={handleSujetChange}
                value={selectedSujetId}
                >
                <option value="">Sélectionner le sujet</option>
                {sujets.map((sujet) => (
                    <option key={sujet.sujetId} value={sujet.id}>
                    {sujet.description}
                    </option>
                ))}
                </Select>
            </Label>
            
            </div>
            <div className="w-full mt-4">
            <Label>
                <span>Description</span>
                <Input
                className="mt-1 h-10"
                type="text"
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                />
            </Label>
            {errorMessage && <span className="mt-2 mb-2 text-gray-600 dark:text-gray-300">{errorMessage}</span>}
            </div>
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
          <div className="hidden sm:block" >
            <Button onClick={handleaddticket}>Confirmer</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button onClick={handleaddticket} block size="large">
              Confirmer
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}
export default TicketDoctor
