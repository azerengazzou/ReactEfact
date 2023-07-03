import React, { useState, useEffect } from 'react'
import { EditIcon, TrashIcon,MenuIcon } from '../icons'
import { Link } from 'react-router-dom';

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
import moment from 'moment';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@windmill/react-ui'
import { Card, CardBody } from '@windmill/react-ui'
import Header from '../components/Header'
import axios from 'axios'
import '../pages/override.css'
import { Input, HelperText, Label, Select, Textarea } from '@windmill/react-ui'
import { useParams } from 'react-router-dom';
const TicketsSupport = () => {
  const history = useHistory();

const handleRedirect = () => {
  history.push('/app/DiscussionSupport'); // Replace '/other-page' with the desired URL
};

const { id } = useParams();
const [token, setToken] = useState('');
const [data, setData] = React.useState([]);
const [discussion, setDiscussion] = useState([]);
const [userData, setUserData] = useState([]);
const [userReference,setUserReference]=useState(null);


const [isRequestSuccessful,setIsRequestSuccessful]=useState(false);
const [userIdRef,setUserIdRef]=useState(null);
const [discussionId,setDiscussionId]=useState(null);
const [sujetId,setSujetId]=useState(null);
const [discussionStatus,setDiscussionStatus]=useState("0");

const show = async () => {
  try {
    console.log(token);
    setToken(token);

    const response = await axios.get(`https://localhost:7287/gateway/Ticket/${id}`);
    const data = response.data;
    console.log(data);
    setData(data);
    setDiscussion(data.discussions);
    setUserReference(data.userRef);
    setDiscussionId();
    setSujetId(data.sujetId);

    const userResponse = await axios.get(`https://localhost:7287/gateway/Auth/${data.userRef}`);
    const userData = userResponse.data;
    setUserData(userData);
  } catch (error) {
    // Handle error
    console.log(error);
  }
};

const handleDiscussion = () => {
    try {
      const requestData = {
        ticketId: data.id,
        statusDiscussion: 1, // Assuming discussionStatus is hardcoded to 0
      };
      axios.post('https://localhost:7287/gateway/Discussion', requestData)
        .then(response => {
          console.log('Request successful');
          console.log(response);
         // window.location.reload(); // Refresh the page
         const TicketData={
            id:response.data.ticketId,
            status:1,
         };
              axios.put(`https://localhost:7287/gateway/TicketUpdate/${response.data.ticketId}`, TicketData)
              .then(responseUpdate => {
                console.log('Request successful');
                console.log(responseUpdate);
                setIsRequestSuccessful(true);
               window.location.reload(); // Refresh the page
              })
              .catch(error => {
                console.error('Request failed:', error);
              });
        })
        .catch(error => {
          console.error('Request failed:', error);
        });
    } catch (error) {
      console.error('An error occurred:', error);
    }
};

const handleTicketClose = () => {
  const TicketData={
    id:data.id,
    status:2,
 };
      axios.put(`https://localhost:7287/gateway/TicketUpdate/${data.id}`, TicketData)
      .then(responseUpdate => {
        console.log('Request successful');
        console.log(responseUpdate);
        setIsRequestSuccessful(true);
       window.location.reload(); // Refresh the page
      })
      .catch(error => {
        console.error('Request failed:', error);
      });
};

const sendNewMessage = () => {
  const idUser = parseInt(localStorage.getItem('userId'));
  const messageContent = document.getElementById('messageContent').value;
  const messageData = {
    contenuMessage: messageContent,
    discussionId: data.discussions[0].id,
    userRef: idUser,
  };

  axios.post(`https://localhost:7287/gateway/NewMessage`, messageData)
    .then(responseMsg => {
      console.log('Request successful');
      console.log(responseMsg);
      window.location.reload(); // Refresh the page
    })
    .catch(error => {
      console.error('Request failed:', error);
    });
};


useEffect(() => {
  show();
  const idUser = parseInt(localStorage.getItem('userId'));
  setUserIdRef(idUser);
  
}, []);

  return (
    <div>
        <div className="flex items-center justify-between">
            <PageTitle>Discussion du ticket</PageTitle>
            <PageTitle>Code du ticket : {data.codeTicket}</PageTitle>
            {data.status !== 0 && (
        <div className="mb-2">
          <Button onClick={handleTicketClose}>Fermer ce ticket</Button>
        </div>
      )}
        </div>
        
    <div className="mb-2">
        <Card>
          <CardBody>
            <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Information sur le ticket</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-1">
            <Card>
              <CardBody>
                <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Sujet : {data.sujetTicket?.description}</p>
                <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Description Supplémentaire : {data.description}</p>
                <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Etat : 
                  {data.status === 0 && (
                    <Badge type="primary">En attente </Badge>)}
                  {data.status === 1 && (
                    <Badge type="success">Traitement en cours</Badge>)}
                  {data.status === 2 && (
                    <Badge type="warning">Fermé</Badge>)}
                </p>
              </CardBody>
            </Card>
              </div>
      <div className="mb-1">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Code Ticket : {data.codeTicket}</p>
              <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Date de création : {moment(data.upload_date).format('DD/MM/YYYY HH:mm')}</p>
            </div>
              <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Médecin : {userData.firstName} {userData.lastName}</p>
              <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Identifiant : {userData.identifiant}</p>
          </CardBody>
        </Card>
      </div>
      <div className='mb-4'>
        <Button onClick={handleDiscussion} >Traiter cette ticket</Button>
      </div>
    </div>
    <div>
    {data.discussions && data.discussions.length !== 0 && (
    <div>
    <p>Discussion avec: {userData.firstName} {userData.lastName}</p>
    <div className="flex flex-col flex-wrap mt-2">
  <div className="mb-4">
    {discussion.map((discuss, i) => (
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg" key={i}>
        {discuss.messages.map((msg, im) => (
          <div className={`flex ${msg.userRef === userIdRef ? 'justify-start' : 'justify-end'} mb-2`} key={im}>
            <div className={`bg-green-500 text-white rounded-lg p-2 max-w-xs ${msg.userRef === userIdRef ? 'ml-2' : 'mr-2'}`}>
              <p>{msg.contenuMessage}</p>
              
            </div>
          </div>
        ))}
      </div>
    ))}
    <div className="mb-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-4">
        <textarea id="messageContent" className="w-full h-20 resize-none rounded-lg" placeholder="Ecrivez votre message"></textarea>
        <div>
          <Button onClick={sendNewMessage}>Envoyer</Button>
        </div>
      </div>
    </div>
  </div>
</div>
  </div>
)}

    </div>
  </CardBody>
</Card>

</div>

 
</div>
  );
}

export default TicketsSupport;