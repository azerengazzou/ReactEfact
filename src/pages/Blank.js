

import PageTitle from '../components/Typography/PageTitle'
import Dashboard from './Dashboard';
import React, { useState } from 'react';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { useHistory } from 'react-router-dom'
import { Button } from '@windmill/react-ui'

function Blank() {
  const [selectedFile, setSelectedFile] = useState(null);
  const history = useHistory();
  const onFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
    
  };

  const onFileUpload = async () => {
    
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
      const response = await axios.post('https://localhost:7075/api/FileAPI', formData);
      console.log(response.data);
      history.push('/app/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    
   /* <div>
      <input type="file" onChange={onFileSelect} />
      <Button onClick={onFileUpload}>Upload</Button>
      
    </div>*/
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 mx-auto p-8 bg-gray-100 border rounded-lg">
        <input type="file" onChange={onFileSelect} />
        <Button className="bg-red-500"   onClick={onFileUpload}>Upload</Button>
      </div>
    </div>
    
  );
}

export default Blank
