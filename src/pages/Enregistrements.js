import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { EditIcon, TrashIcon, MenuIcon, SearchIcon } from '../icons';
import { Doughnut, Line } from 'react-chartjs-2';
import ChartLegend from '../components/Chart/ChartLegend';
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
  Button,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  HelperText,
  Label,
  Select,
  Textarea,
} from '@windmill/react-ui';
import axios from 'axios';
import PageTitle from '../components/Typography/PageTitle';
import SectionTitle from '../components/Typography/SectionTitle';
import InfoCard from '../components/Cards/InfoCard';
import { CartIcon, ChatIcon, MoneyIcon, PeopleIcon } from '../icons';
import RoundIcon from '../components/RoundIcon';
import moment from 'moment';

function TypeMessages() {
  const [formattedDate, setFormattedDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const history = useHistory();
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [token, setToken] = useState('');
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [deletionKey, setDeletionKey] = useState([]);
  const [msgTypeCount, setMsgTypeCount] = useState(0);
  const [msgTypeData, setMsgTypeData] = useState(null);
  const [selectedMessageType, setSelectedMessageType] = useState(null);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [records, setRecords] = useState(null);
  const [selectedMsgTypeId, setSelectedMsgTypeId] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const [formData, setFormData] = useState({
    recordNumber: "",
    description: "",
    recordLength: 0,
    recordPlacement: "",
    messageTypeId: 0
  });

  function openModalAdd() {
    setIsModalAddOpen(true)
  }

  function closeModal() {
    setIsModalAddOpen(false)
  }
  
  function closeTheAddModal() {
    setIsModalOpen(false);
  }
  
  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalAddOpen(false)
  }
  const handleSearchClick = (record) => {
    setSelectedRecord(record);
    openModalAdd();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log(formData);
    axios.post('https://localhost:7287/gateway/RecordConfig', formData).then((response) => {
        console.log(formData);
        if (response.status === 200) {
          setMessage('Enregistrement a été crée avec succès !');
        }
      })
      .catch((error) => {
        console.error(error);
      if (error.response && error.response.status === 400) {
        setMessage('Vérifiez les champs !');
      }
      else {
        setMessage('vérifiez les champs !');}
      });
  };

  const show = () => {
    const token = localStorage.getItem('token');
    const userRef = localStorage.getItem('userId');
    console.log(token);
    console.log(userRef);
    setToken(token);
    axios
      .get('https://localhost:7287/gateway/MessageType&Records')
      .then((MessageTypeResponse) => {
        setMsgTypeData(MessageTypeResponse.data);
        console.log(MessageTypeResponse.data);
        setMsgTypeCount(MessageTypeResponse.data.length);
        setRecords(MessageTypeResponse.data.map((msgType) => msgType.recordConfigs).flat());
      })
      .catch((error) => {
        // Handle the error
        console.log(error);
      });
  };
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };
  useEffect(() => {
    show();
  }, [deletionKey]);
  
  const handleCardClick = (messageType) => {
    setSelectedMsgTypeId((prevId) => (prevId === messageType.id ? null : messageType.id));
  };

  return (
    <>
      <PageTitle>La liste des enregistrements pour chaque fichier :</PageTitle>
      <div className="mb-8">
        <Card>
          <CardBody>
            <Button className="mb-2" onClick={openModal}>Ajouter un nouveau enregistrement</Button>
            {msgTypeData &&
              msgTypeData.map((data) => (
                <Card
                  className={`m-2 ${selectedMsgTypeId === data.id ? 'cursor-default' : 'cursor-pointer'}`}
                  key={data.id}
                >
                  <CardBody className="flex justify-between" onClick={() => handleCardClick(data)}>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Les enregistrements pour le type message eFact "{data.messageCode}"
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Nombre d'enregistrements : {data.recordConfigs.length}
                      </p>
                    </div>
                  </CardBody>

                  {selectedMsgTypeId === data.id && (
                    <TableContainer key={data.id}>
                      <Table>
                        <TableHeader>
                          <tr>
                            <TableCell>Type d'enregistrement</TableCell>
                            <TableCell>Libellé d'enregistrement</TableCell>
                            <TableCell>Placement dans le fichier</TableCell>
                            <TableCell>Actions</TableCell>
                          </tr>
                        </TableHeader>
                        <TableBody>
                          {data.recordConfigs.map((record, j) => (
                            <TableRow key={j}>
                              <TableCell>
                                <div className="flex items-center text-sm">
                                  <div>
                                    <p className="font-semibold">{record.recordNumber}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center text-sm">
                                  <div>
                                    <p className="font-semibold">{record.description}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm">
                                  {record.recordPlacement === 'header' && <Badge type="success">header</Badge>}
                                  {record.recordPlacement === 'footer' && <Badge type="success">footer</Badge>}
                                  {record.recordPlacement === 'body' && <Badge type="success">body</Badge>}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-4">
                                <Button layout="link" size="icon" aria-label="details" onClick={() => handleSearchClick(record)}>
                                  <SearchIcon className="w-5 h-5" aria-hidden="true" />
                                </Button>

                                  <Button layout="link" size="icon" aria-label="Delete">
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
                  )}
                </Card>
              ))}
          </CardBody>
        </Card>
      </div>

      <Modal isOpen={isModalAddOpen} onClose={closeModal}>
        <ModalHeader>Ajouter un nouvel utilisateur</ModalHeader>
        <ModalBody>
          {selectedRecord && (
            <Card>
              <CardBody>
                <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Informations d'enregistrement : </p>
                <p className="text-gray-600 dark:text-gray-400">Numéro d'enregistrement : {selectedRecord.recordNumber}</p>
                <p className="text-gray-600 dark:text-gray-400">Longueur d'enregistrement : {selectedRecord.recordLength}</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Placement dans le fichier : 
                  {selectedRecord.recordPlacement === 'header' && <Badge type="success">Entête</Badge>}
                  {selectedRecord.recordPlacement === 'footer' && <Badge type="success">Bas de fichier</Badge>}
                  {selectedRecord.recordPlacement === 'body' && <Badge type="success">Corps de fichier</Badge>}
                </p>
                <p className="text-gray-600 dark:text-gray-400">Date d'ajout : {moment(selectedRecord.dateCreation).format('DD/MM/YYYY HH:mm')}</p>

              </CardBody>
            </Card>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block" >
            <Button>Ajouter</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" >
              Ajouter
            </Button>
          </div>
        </ModalFooter>
      </Modal>


      
      <Modal isOpen={isModalOpen} onClose={closeTheAddModal}>
        <ModalHeader>Ajouter un nouvel utilisateur</ModalHeader>
        <ModalBody>
         
            <Card>
              <CardBody>
              
        <div className="w-full ">
          <Label>
            <span>Numéro d'enregistrement</span>
            <Input id="recordNumber"
                    placeholder="numéro enregistrement"
                    onChange={handleChange} className="" type="number" />
          </Label>
        </div>
        <div className="w-full ">
          <Label>
            <span >Description</span>
            <Input type="text"  id="description"
                    placeholder="libellé"
                    onChange={handleChange} className=""/>
          </Label>
        </div>
        <div className="w-full">
          <Label>
            <span >Longueur</span>
            <Input type="text"  id="recordLength"
                    placeholder="longueur"
                    onChange={handleChange} className=""/>
          </Label>
        </div>
        <div className="w-full">
          <Label>
            <span>Placement</span>
            <Select
              value={formData.recordPlacement}
              onChange={(e) => setFormData({ ...formData, recordPlacement: e.target.value })}
            >
              <option value="header">header</option>
              <option value="footer">footer</option>
              <option value="body">body</option>
            </Select>
          </Label>
        </div>

        <div className="w-full">
  <Label>
    <span>Type de message</span>
    <Select
      value={formData.messageTypeId}
      onChange={(e) => setFormData({ ...formData, messageTypeId: e.target.value })}
    >
      {msgTypeData && msgTypeData.map((message) => (
        <option key={message.id} value={message.id}>
          {message.messageCode}
        </option>
      ))}
    </Select>
  </Label>
</div>
              </CardBody>
            </Card>
       
            </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeTheAddModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block" onClick={handleSubmit}>
            <Button>Ajouter</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeTheAddModal}>
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
  );
}

export default TypeMessages;
