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

function TypeMessages() {
  const[formattedDate,setFormattedDate]=("");
    const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const history2=useHistory();
  const [page, setPage] = useState(1)
  const [data, setData] = React.useState([]);
  const [token, setToken] = useState('');
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [deletionKey, setDeletionKey] = React.useState([]);
  const [msgTypeCount,setMsgTypeCount]=useState(0);
  const [msgTypeData,setMsgTypeData]=useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedMessageType, setSelectedMessageType] = useState(null);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false)

  const [message,setMessage]=useState("");

 function openModal(data) {
  setSelectedMessageType(data);
  setIsModalOpen(true);
}

function openModalAdd() {
    setIsModalAddOpen(true);
}


  function closeModal() {
    setIsModalOpen(false);
    setIsModalAddOpen(false);
  }
    const handleViewMsg = (msg) => { // new function
      setSelectedMsg(msg);
    };
    
    const handleDeleteMsg = (id) => {
      axios
        .delete(`https://localhost:7287/gateway/MessageType/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then(response=>{
            show();
        });
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [id]: value,
        }));
      };
      
  const [formData, setFormData] = useState({
    messageCode: '',
    description: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log(formData);
    axios.post('https://localhost:7287/gateway/MessageType', formData).then((response) => {
        console.log(formData);
          setMessage('Nouveau type ajouté avec succès ! Continuez à configurer les Enregistrements et les Zones');
            show();
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

    const show = () => {
      const token = localStorage.getItem('token');
      const userRef=localStorage.getItem('userId');
      console.log(token);
      console.log(userRef);
      setToken(token);
        axios.get("https://localhost:7287/gateway/MessageType&Records")
        .then(MessageTypeResponse => {
            setMsgTypeData(MessageTypeResponse.data);
            console.log(MessageTypeResponse.data);
            setMsgTypeCount(MessageTypeResponse.data.length);
        })
        .catch(error => {
            // Gérer l'erreur
            console.log(error);
        });
    };
    useEffect(() => {
      show();
    }, [deletionKey]);

  return (
    <>
          <PageTitle>Les types des messages configurées</PageTitle>
          <div className="mb-8">
            <Card>
              <CardBody>
                <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Revenue</p>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Tableau de gestion des fichiers de réponse eFact: organisez et suivez vos fichiers de réponse avec notre outil de suivi intuitif et nos options d'actions rapides.
                </p>
                <Button onClick={openModalAdd}>
                    Ajouter un nouveau type de message
                </Button>
              </CardBody>
            </Card>
          </div>
          <div>
             
      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Code Message</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date de création</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
          {msgTypeData && msgTypeData.map((data, i) => (
            <TableRow key={i}>
                <TableCell>
                <div className="flex items-center text-sm">
                    <div>
                    <p className="font-semibold">
                        {data.messageCode}
                    </p>
                    </div>
                </div>
                </TableCell>
                
                <TableCell>
                  <span className="text-sm"> {data.description}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{moment(data.upload_date).format('DD/MM/YYYY HH:mm')}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                  <Button layout="link" size="icon" aria-label="Delete" onClick={() => openModal(data)}>
                    <SearchIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button layout="link" size="icon" aria-label="Delete" onClick={() => handleDeleteMsg(data.id)}>
                      <TrashIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          
        </TableFooter>
      </TableContainer>
      </div>

  <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Détails du type de message</ModalHeader>
        <ModalBody>
    {selectedMessageType && (
      <Card>
        <CardBody>
          <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Code Message {selectedMessageType.messageCode}</p>
          <p className="mb-4 font-semibold text-gray-600 dark:text-gray-400">Description : {selectedMessageType.description}</p>
          <p className="mb-4 font-semibold text-gray-600 dark:text-gray-400">Date d'ajout au système : {moment(selectedMessageType.dateCreation).format('DD/MM/YYYY HH:mm')}</p>
          <p className="mb-4 font-semibold text-gray-600 dark:text-gray-400">Nombre d'enregistrements qui appartients à ce type de message : {selectedMessageType.recordConfigs.length}</p>
          {/* Affichez les autres informations du type sélectionné ici */}
        </CardBody>
      </Card>
    )}
  </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Fermer
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Fermer
            </Button>
          </div>
        </ModalFooter>
      </Modal>



      <Modal isOpen={isModalAddOpen} onClose={closeModal}>
        <ModalHeader>Ajouter un type de message</ModalHeader>
        <p className="text-gray-600 dark:text-gray-400 mb-2">{message && <p >{message}</p>}</p>
        <ModalBody>
      <Card>
        <CardBody>
        <div className="mb-4 md:mb-2">
          <Label>
            <span>Code Message</span>
            <Input type="text"  id="messageCode"
                    placeholder="Code Message"
                    onChange={handleChange} className="mt-1"/>
          </Label>
        </div>
        <div className="mb-4 md:mb-2">
          <Label>
            <span>Description de type de message</span>
            <Input className="mt-1" type="text" id="description"
                    placeholder="Premier message de réponse eFact"
                    onChange={handleChange}/>
          </Label>
        </div>
        
        <p style={{ color:'#eb8e05'}}className="text-gray-600 dark:text-gray-400 mb-2">
            Nb : Vous devez ajouter les enregistrements et les Zones de chaque nouveau type de message.
        </p>
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
  )
}

export default TypeMessages
