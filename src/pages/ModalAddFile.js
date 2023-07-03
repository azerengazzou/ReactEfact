import React ,{ useState } from 'react'
import routes from '../../routes/sidebar'
import { NavLink, Route } from 'react-router-dom'
import * as Icons from '../../icons'
import SidebarSubmenu from './SidebarSubmenu'
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { useHistory } from 'react-router-dom'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from '@windmill/react-ui'

import { Card, CardBody } from '@windmill/react-ui'

function Icon({ icon, ...props }) {
  const Icon = Icons[icon]
  return <Icon {...props} />
}

function ModalAddFile() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [fileName, setFileName] = useState('');
  const [description, setDescription] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [fileStatus, setFileStatus] = useState('aucun fichier');
  const [fileContent, setFileContent] = useState('');

  const history = useHistory();
  const [userRole, setUserRole] = useState('');

  const onFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);  
  };

  function openModal() {
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
  }
  
  const onFileUpload = async () => {
    const token=localStorage.getItem('token');
    const userRole=localStorage.getItem('role');
    setUserRole(userRole);
    console.log(token);
    const UserRef=localStorage.getItem('userID');
    const formData = new FormData();
    formData.append('fileuploaded', selectedFile);
    console.log(formData);

    try {
      const response = await axios.post(
        'https://localhost:7287/gateway/AddFiles?UserRef=' + UserRef,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log(response.data.description);
      setDescription(response.data.description);
      setFileName(selectedFile.name);
      setFileSize(selectedFile.size);
      setFileContent(response.data.fileUploadedContent);
      setFileStatus('traitée et sauvegardée');
      
      history.push('/app/dashboard');
  } catch (error) {

    console.error(error);
      if (error.response && error.response.status === 400) {
        // Authentication failed, show an error message to the user
        setErrorMessage('Vérifiez votre fichier ! ');
        // You can set a state variable to display the error message in your component
      }
      else {
        // Other error occurred, handle as needed
        setErrorMessage('Un problème est survenue, contacter le support technique !');
      }
  }
};
  return (
    <div className="py-4 text-gray-500 dark:text-gray-400">
      
      <div className="px-6 my-6">
      <Button onClick={openModal}>
        Télécharger une facture
        <span className="ml-2" aria-hidden="true">
          +
        </span>
    </Button>
  </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>Importer et traiter vos fichiers de facturation</ModalHeader>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        {fileStatus === 'traitée et sauvegardée' && <p className="text-green-500">Le fichier a été traité et sauvegardé avec succès !</p>}
        <br/>
        <ModalBody>
        <p className="mb-2 font-semibold text-gray-600 dark:text-gray-300">Importez votre fichier :</p>
        <input type="file" className='mb-2' onChange={onFileSelect} />
        <Card>
        <CardBody>
          <p className="mb-2 font-semibold text-gray-600 dark:text-gray-300">Nom de fichier : {fileName}</p>
          <p className="mb-2 font-semibold text-gray-600 dark:text-gray-300">Description : {description}</p>
          <p className="mb-2 font-semibold text-gray-600 dark:text-gray-300">Taille de fichier en byte : {fileSize}</p>
          <p className="mb-2 font-semibold text-gray-600 dark:text-gray-300">État : {fileStatus}</p>
          <textarea
            className="w-full h-40 p-2 border border-gray-300 rounded-md"
            value={fileContent}
            readOnly
          />
        </CardBody>
        </Card>
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={onFileUpload} >Accept</Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button block size="large" layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="block w-full sm:hidden">
            <Button onClick={onFileUpload} block size="large">
              Accept
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
          
  )
}

export default ModalAddFile
