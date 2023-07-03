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
import {SearchIcon } from '../icons'

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
import moment from 'moment';
import { Card, CardBody } from '@windmill/react-ui'

import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
} from '../utils/demo/chartsData'
import Header from '../components/Header'
import axios from 'axios'
import '../pages/override.css'
import {
  barOptions,
  barLegends,
} from '../utils/demo/chartsData'
import { Bar } from 'react-chartjs-2'

const DashboardSupport = () => {
  const [doctorCount, setDoctorCount] = useState(0);
  const [supportCount, setSupportCount] = useState(0);
  const [administrators,setAdministrators]=useState(null);
  const [msgTypeCount, setMsgTypeCount] = useState(0);
  const [msgTypeData,setMsgTypeData]=useState(null);
  const [ticketsData,setTicketsData]=useState(null);
  const [ticketsCount,setTicketsCount]=useState(0);
  const [dashOptions, setDashOptions] = useState(null);
  const [sujets, setSujets] = useState(null);
  const [sujetCount, setSujetCount] = useState(null);

  const DashLegend = [
    { title: 'En attente', color: 'bg-blue-500' },
    { title: 'Traitement en cours', color: 'bg-teal-600' },
    { title: 'Fermé', color: 'bg-purple-600' },
  ]
  
  useEffect(() => {
    show();
  }, []);

const show = () => {
  axios.get("https://localhost:7287/gateway/Users")
    .then(response => {
      console.log(response.data);
      const users = response.data;
      const doctorCount = users.filter(user => user.role === 'Doctor').length;
      const supportCount = users.filter(user => user.role === 'Support').length;
      const administrators = users.filter(user => user.role === 'Administrator');
      setAdministrators(administrators);
      setDoctorCount(doctorCount);
      setSupportCount(supportCount);
// Fetch additional data for date and counts
const allMonths = generateAllMonthsArray();
const addDates = users.map(user => moment(user.addDate).format('MM'));
const adminCountByMonth = countByMonth(users.filter(user => user.role === 'Administrator'));
const doctorCountByMonth = countByMonth(users.filter(user => user.role === 'Doctor'));
const supportCountByMonth = countByMonth(users.filter(user => user.role === 'Support'));

const updatedBarOptions = {
  ...barOptions,
  data: {
    ...barOptions.data,
    labels: allMonths,
    datasets: [
      {
        ...barOptions.data.datasets[0],
        label: 'Administrateur',
        data: mapDataByMonth(allMonths, addDates, adminCountByMonth),
      },
      {
        ...barOptions.data.datasets[1],
        label: 'Docteur',
        data: mapDataByMonth(allMonths, addDates, doctorCountByMonth),
      },
      {
        ...barOptions.data.datasets[2],
        label: 'Support',
        data: mapDataByMonth(allMonths, addDates, supportCountByMonth),
      },
    ],
  },
};
setBarOptions(updatedBarOptions);
})
.catch(error => {
console.log(error);
});

    const generateAllMonthsArray = () => {
      const allMonths = [];
      for (let month = 1; month <= 12; month++) {
        allMonths.push(moment(month, 'MM').format('MM'));
      }
      return allMonths;
    };
    
    const countByMonth = (data) => {
      const countByMonth = {};
      data.forEach(item => {
        const month = moment(item.addDate).format('MM');
        countByMonth[month] = (countByMonth[month] || 0) + 1;
      });
      return Object.values(countByMonth);
    };
    
    const mapDataByMonth = (allMonths, dataMonths, countByMonth) => {
      return allMonths.map(month => {
        const index = dataMonths.indexOf(month);
        if (index !== -1) {
          return countByMonth[index];
        }
        return 0;
      });
    };

  axios.get("https://localhost:7287/gateway/MessageType")
    .then(MessageTypeResponse => {
      setMsgTypeData(MessageTypeResponse.data);
      console.log(MessageTypeResponse.data);
      setMsgTypeCount(MessageTypeResponse.data.length);
    })
    .catch(error => {
      // Gérer l'erreur
      console.log(error);
    });

    axios.get("https://localhost:7287/gateway/Sujets")
    .then(responseSujet => {
      setSujets(responseSujet.data);
      console.log(responseSujet.data);
      setSujetCount(responseSujet.data.length);
    })
    .catch(error => {
      // Gérer l'erreur
      console.log(error);
    });

 
    axios.get("https://localhost:7287/gateway/AllTickets")
    .then(Tickets => {
      const ticketsData = Tickets.data;
      setTicketsData(ticketsData);
      setTicketsCount(ticketsData.length);

      const countByStatus = {
        0: 0, // En attente
        1: 0, // Traitement en cours
        2: 0, // Fermé
      };
      ticketsData.forEach(ticket => {
        countByStatus[ticket.status]++;
      });

      const updatedDashOptions = {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: [countByStatus[0],countByStatus[1],countByStatus[2]],
              backgroundColor: ['#0694a2', '#1c64f2', '#7e3af2'],
              label: 'Dataset 1',
            },
          ],
          labels: ['En attente', 'Traitement en cours', 'Fermé'],
        },
        options: {
          responsive: true,
          cutoutPercentage: 80,
        },
      };
      setDashOptions(updatedDashOptions);
      console.log(updatedDashOptions);
    })
    .catch(error => {
      console.log(error);
    });
};

const DashOptions = {
  type: 'doughnut',
  data: {
    datasets: [
      {
        data: [0, 1, 0],
        backgroundColor: ['#0694a2', '#1c64f2', '#7e3af2'],
        label: 'Dataset 1',
      },
    ],
  },
  options: {
    responsive: true,
    cutoutPercentage: 80,
  },
};
moment.locale('fr');
const barLegends = [
  { title: 'Administrateur', color: 'bg-teal-600' },
  { title: 'Docteur', color: 'bg-purple-600' },
  { title: 'Support', color: 'bg-blue-500' },
];
const [barOptions, setBarOptions] = useState({
  data: {
    labels: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Aout','Septembre','Octobre','Novembre','Décembre' ],
    datasets: [
      {
        label: 'Administrateur',
        backgroundColor: '#0694a2',
        borderWidth: 2,
        data: [],
      },
      {
        label: 'Docteur',
        backgroundColor: '#7e3af2',
        borderWidth: 2,
        data: [],
      },
      {
        label: 'Support',
        backgroundColor: '#1c64f2',
        borderWidth: 2,
        data: [],
      },
    ],
  },
  options: {
    responsive: true,
  },
  legend: {
    display: false,
  },
});
  return (
    <>
      <PageTitle>Tableau de board</PageTitle>
      <div className="grid gap-6 mb-4 md:grid-cols-1">
        <Card>
          <CardBody>
            <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Valeurs importantes : </p>
            
            <div className="grid gap-2 mb-2 md:grid-cols-2 xl:grid-cols-2">
              <InfoCard title="Nombre total des médecins enregistrés" value={doctorCount}>
                <RoundIcon
                  icon={PeopleIcon}
                  iconColorClass="text-orange-500 dark:text-orange-100"
                  className="mr-4"
                />
              </InfoCard>
              <InfoCard title="Nombre total d'agents de support" value={supportCount}>
                <RoundIcon
                  icon={PeopleIcon}
                  iconColorClass="text-orange-500 dark:text-orange-100"
                  className="mr-4"
                />
              </InfoCard>
              <InfoCard title="Types de messages configurées" value={msgTypeCount}>
                <RoundIcon
                  icon={FormsIcon}
                  iconColorClass="text-green-500 dark:text-orange-100"
                  className="mr-4"
                />
              </InfoCard>
              
              <InfoCard title="Total des tickets" value={ticketsCount}>
                <RoundIcon
                  icon={FormsIcon}
                  iconColorClass="text-orange-500 dark:text-orange-100"
                  className="mr-4"
                />
              </InfoCard>
              <Card>
          <CardBody>
            <Card>
              <CardBody>
                <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Types de messages configurés :</p>
                {msgTypeData &&
                  msgTypeData.map((msg, index) => (
                    <div key={index}>
                      <div className="flex items-center text-sm m-1">
                        <div>
                          <p className="font-semibold">
                            <span className="text-s text-gray-600 dark:text-gray-400 mr-1">•</span>
                            {msg.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardBody>
            </Card>
          </CardBody>
        </Card>
       
        <Card>
          <CardBody>
          <InfoCard title="Types de sujets" value={sujetCount}>
                <RoundIcon
                  icon={FormsIcon}
                  iconColorClass="text-green-500 dark:text-orange-100"
                  className="mr-4"
                />
              </InfoCard>
          </CardBody>
        </Card>
        
              </div>
              </CardBody>
      </Card>
      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Description de sujet</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
          {sujets && sujets.map((data, i) => (
              <TableRow key={i}>
                <TableCell>
                  <span className="text-sm"> {data.description}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">{moment(data.upload_date).format('DD/MM/YYYY HH:mm')}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button layout="link" size="icon" aria-label="View"  >
                      <MenuIcon className="w-5 h-5" aria-hidden="true" />
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
        <TableFooter>
          
        </TableFooter>
      </TableContainer>
        
      </div>
   
    </>
  );
}

export default DashboardSupport;