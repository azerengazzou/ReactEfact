import React, { useState, useEffect } from 'react'

import { Link } from 'react-router-dom';
import { EditIcon, TrashIcon,MenuIcon } from '../icons'
import ChartCard from '../components/Chart/ChartCard'
import { Doughnut, Line,Bar} from 'react-chartjs-2'
import ChartLegend from '../components/Chart/ChartLegend'
import { useHistory } from "react-router-dom";
import { SearchIcon } from '../icons'
import moment from 'moment';
import { FormsIcon } from '../icons'

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
import {
  doughnutOptions,
  lineOptions,
  barOptions,
  doughnutLegends,
  lineLegends,
  barLegends,
} from '../utils/demo/chartsData'
import PageTitle from '../components/Typography/PageTitle'
import SectionTitle from '../components/Typography/SectionTitle'
import InfoCard from '../components/Cards/InfoCard'
import { Card, CardBody } from '@windmill/react-ui'
import { CartIcon, ChatIcon, MoneyIcon, PeopleIcon } from '../icons'
import RoundIcon from '../components/RoundIcon'
function Dashboard() {
  
  const history = useHistory();
  const history2=useHistory();
  const [page, setPage] = useState(1)
  const [data, setData] = React.useState([]);
  const [token, setToken] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [deletionKey, setDeletionKey] = React.useState([]);
  const [filesCount, setFilesCount] = useState(0);
  useEffect(() => {
    // Retrieve token from localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(token);
    }
    show();
    
  }, []);
  

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
          const filesCount = data.filter(data => data.description !== 'Message contenant le fichier de facturation transmis par le prestataire').length;
          setFilesCount(filesCount);
        })
        .catch(error => {
          // Handle error
          console.log(error);
        });
    };
    

  return (
    <>
          <PageTitle>Tableau de board</PageTitle>
          <div className="mb-4">
            <Card>
              <CardBody>
                <p className="text-gray-600 dark:text-gray-400">
                Système Gestionnaire eFact : Solution de gestion des facturations électroniques pour les prestataires de soin en Belgique. Automatisez la gestion, détectez les erreurs et améliorez la traçabilité des actes médicaux. Gérez les tickets d'assistance pour une meilleure qualité de service. 
                </p>
                <div className="flex flex-col flex-wrap mt-2">
                <div className="grid gap-2 mb-2 md:grid-cols-2 xl:grid-cols-2">
              <InfoCard title="Vos fichiers de réponse rejetées" value={filesCount}>
                <RoundIcon
                  icon={FormsIcon}
                  iconColorClass="text-orange-500 dark:text-orange-100"
                  className="mr-4"
                />
              </InfoCard>
            </div>
                <div>
                </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="mb-4">
            <Card>
              <CardBody>
                <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Derniers fichiers de réponse (15 jours)</p>
                <div className="grid grid-cols-2 gap-4">
            {data.map((data, i) => (
          <div className="mb-8">
            <Card  style={{ borderWidth: '1px' }}>
              <CardBody key={i}>
                <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Nom de fichier : {data.fileName}</p>
                <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Type de message : {data.description}</p>
                <div className="flex items-center justify-between">
                <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Etat :  {data.status === 0 && (
                            <Badge type="danger">Non traité</Badge>
                          )}
                          {data.status === 1 && (
                            <Badge type="warning">Enregistré</Badge>
                          )}
                          {data.status === 2 && (
                            <Badge type="success">Enregistré avec succès</Badge>
                          )}</p>
                <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">{moment(data.upload_date).format('DD/MM/YYYY HH:mm')}</p>
                </div>
                </CardBody>
              </Card>
            </div>
            ))}
          </div>
          <div>
      </div>
                <div className="flex flex-col flex-wrap mt-2">
                <div>
                </div>
                </div>
              </CardBody>
            </Card>
          </div>
         
      
    </>
  )
}

export default Dashboard
