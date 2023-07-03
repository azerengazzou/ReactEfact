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

function FilesList() {
  const[formattedDate,setFormattedDate]=("");
    const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();
  const history2=useHistory();
  const [page, setPage] = useState(1)
  const [data, setData] = React.useState([]);
  const [token, setToken] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [deletionKey, setDeletionKey] = React.useState([]);
  const [fileData, setFileData] = React.useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false)

  function openModal(id) {
    showFile(id);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false)
  }
    const handleViewFile = (file) => { // new function
      setSelectedFile(file);
    };
    const renderFile = (id) => {
        history.push(`/app/file/${id}`);
      };
    const handleDeleteFile = (id) => {
      axios
        .delete(`https://localhost:7287/gateway/DeleteFile/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then(response=>{
            show();
        });
    };

    const show = () => {
      const token = localStorage.getItem('token');
      const userRef=localStorage.getItem('userId');
      console.log(token);
      console.log(userRef);
      setToken(token);
      axios.get(`https://localhost:7287/gateway/Files/userIdRef=${userRef}`, {
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

    const showFile = (id) => {
      setToken(token);
      axios.get(`https://localhost:7287/gateway/FileById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          const fileData = response.data;
          console.log(fileData);
          setFileData(fileData);
        })
        .catch(error => {
          // Handle error
          console.log(error);
        });
    };
    

    useEffect(() => {
      show();
    }, [deletionKey]);

  return (
    <>
          <PageTitle>Vos fichiers de réponse eFact</PageTitle>
          <div className="mb-8">
            <Card>
              <CardBody>
                <p className="mb-2 font-semibold text-gray-600 dark:text-gray-300">Messages de réponse eFact</p>
                <p className="text-gray-600 dark:text-gray-400">
                  Tableau de gestion des fichiers de réponse eFact: organisez et suivez vos fichiers de réponse avec notre outil de suivi intuitif et nos options d'actions rapides.
                </p>
              </CardBody>
            </Card>
          </div>
          <div>
      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Nom de fichier</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Type de fichier</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
          {data.map((data, i) => (
  <TableRow key={i}>
    <TableCell>
      <div className="flex items-center text-sm">
        <div>
          <p className={`font-semibold ${data.description !== 'Message contenant le fichier de facturation transmis par le prestataire' ? 'text-red-500' : ''}`}>
            {data.fileName}
          </p>
        </div>
      </div>
    </TableCell>
                
                <TableCell>
                  {data.status === 0 && (
                    <Badge type="danger">Non traité</Badge>
                  )}
                  {data.status === 1 && (
                    <Badge type="warning">Enregistré</Badge>
                  )}
                  {data.status === 2 && (
                    <Badge type="success">Enregistré avec succès</Badge>
                  )}
                </TableCell>
                
                <TableCell>
                  <span className="text-sm"> {data.description}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{moment(data.upload_date).format('DD/MM/YYYY HH:mm')}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                  <Button layout="link" size="icon" aria-label="Delete" onClick={() => openModal(data.id)}>
                      <SearchIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button layout="link" size="icon" aria-label="View"  onClick={() => renderFile(data.id)}>
                      <MenuIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button layout="link" size="icon" aria-label="Delete" onClick={() => handleDeleteFile(data.id)}>
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
        <ModalHeader>Importer et traiter vos fichiers de facturation</ModalHeader>
        <br/>
        <ModalBody>
        <Card>
        <CardBody>
          <p className="mb-2 font-semibold text-gray-600 dark:text-gray-300">Nom de fichier : {fileData.fileName}</p>
          <p className="mb-2 font-semibold text-gray-600 dark:text-gray-300">Description : {fileData.description}</p>
          <p className="mb-2 font-semibold text-gray-600 dark:text-gray-300">Date : {moment(fileData.upload_date).format('DD/MM/YYYY HH:mm')}</p>
          <p className="mb-2 font-semibold text-gray-600 dark:text-gray-300">Taille de fichier en byte : {fileData.size} </p>
          <p className="mb-2 font-semibold text-gray-600 dark:text-gray-300">État : {fileData.status === 0 && (
                    <Badge type="danger">Non traité</Badge>
                  )}
                  {fileData.status === 1 && (
                    <Badge type="warning">Enregistré</Badge>
                  )}
                  {fileData.status === 2 && (
                    <Badge type="success">Enregistré avec succès</Badge>
                  )}</p>
          <textarea
            className="w-full h-40 p-2 border border-gray-300 rounded-md"
            value={fileData.fileUploadedContent}
            readOnly
          />
        </CardBody>
        </Card>
        </ModalBody>
        <ModalFooter>
          {/* I don't like this approach. Consider passing a prop to ModalFooter
           * that if present, would duplicate the buttons in a way similar to this.
           * Or, maybe find some way to pass something like size="large md:regular"
           * to Button
           */}
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}

export default FilesList
