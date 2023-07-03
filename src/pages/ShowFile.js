import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Card, CardBody } from '@windmill/react-ui';
import PageTitle from '../components/Typography/PageTitle';
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
} from '@windmill/react-ui'
import axios from 'axios'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button ,Input, HelperText, Label, Select, Textarea} from '@windmill/react-ui';
import { useParams } from 'react-router-dom';
import { ColorizeOutlined } from '@material-ui/icons';

function ShowFile() {
  const { id } = useParams();
  const [list, setList] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedPrestation, setSelectedPrestation] = useState(null);
  const [zone, setZone] = useState(null); // Define the zone state variable

  const [errorDetails, setErrorDetails] = useState(null);
  const [errorCount, setErrorCount] = useState(0);

  const [dataDetails, setDataDetails] = useState(null);
  const [filteredPrestationRows, setFilteredPrestationRows] = useState([]);
  const [expandedRecord, setExpandedRecord] = useState(null);
  const [expandedGroup, setExpandedGroup] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7287/gateway/AllFields/${id}`
        );
        if (!Array.isArray(response.data) || response.data.length === 0) {
          setList([]);
          setError(null);
          setErrorDetails(null);
          setErrorCount(0);
          setIsModalOpen(false);
        } else {
          const newRows = response.data.map((item, index) => {
            const zoneConfig = item.zoneConfig || {};
            const recordConfig = zoneConfig.recordConfig || {};
            return {
              id: index,
              zoneNumber: zoneConfig.zoneNumber || null,
              description: zoneConfig.description || null,
              recordDescription: recordConfig.description || null,
              numAttestation: item.numAttestation || null,
              numPrestation: item.numPrestation || null,
              zoneContent: item.zoneContent.content || null,
              isError: item.isError || false,
              errorDetails: {
                descriptionError: item.zoneError ? item.zoneError.descriptionError : '',
                maj: item.zoneError ? item.zoneError.maj : '',
                typeModification: item.zoneError ? item.zoneError.typeModification : '',
                natureErreur: item.zoneError ? item.zoneError.natureErreur : '',
              },
            };
          });
    
          setList(newRows);
          console.log(newRows);
          setError(null);
    
          // Calculer le nombre d'erreurs
          const errorRows = newRows.filter((row) => row.isError);
          setErrorCount(errorRows.length);
    
          // Récupérer les détails d'erreur
          const firstErrorRow = errorRows[0];
          setErrorDetails(firstErrorRow ? firstErrorRow.errorDetails : null);
        }
      } catch (error) {
        console.error(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

function closeModal() {
  setIsModalOpen(false);
}


const handleRecordClick = (numAttestation, recordDescription) => {
  setSelectedPrestation(null);
  clearTimeout(handleRecordClick.timeoutId);
  handleRecordClick.timeoutId = setTimeout(() => {
    setExpandedRecord(recordDescription === expandedRecord ? null : recordDescription);
    setSelectedRecord({ numAttestation, recordDescription });
    setExpandedGroup(numAttestation); // Mettre à jour le groupe d'attestation étendu

    // Filtrer les lignes en fonction du numPrestation sélectionné
    const filteredRows = groupedRows[numAttestation][recordDescription]
      .filter(row => row.numPrestation === selectedPrestation || selectedPrestation === null);
    
    setFilteredPrestationRows(filteredRows);
  }, 300);
};



const handlePrestationClick = (numAttestation, recordDescription, numPrestation) => {
  setSelectedPrestation(numPrestation);
  clearTimeout(handleRecordClick.timeoutId);
  handleRecordClick.timeoutId = setTimeout(() => {
    setSelectedRecord({ numAttestation, recordDescription, numPrestation });
  }, 300);
};

const openModal = (id) => {
  axios.get(`https://localhost:7289/api/ZoneErrorAPI/${id}`)
    .then(response => {
      setIsModalOpen(true);
      const datadetails = response.data;
      setDataDetails(datadetails);
      console.log(response.data);
      const z = extractZoneNumber(datadetails.codeError);
      const zone = findZone(z); // Store the result of findZone in a state variable
      setZone(zone); // Set the zone variable
      console.log(z);
    });
};


const extractZoneNumber = (zoneNumber) => {
  if (typeof zoneNumber === 'string' && zoneNumber.length >= 3) {
    // Extraire les 2 caractères du numéro de zone à partir de la position 3
    let z=zoneNumber.substr(2, 2);
    if(z.startsWith('0')){
      return zoneNumber.substr(3,1);
    }else{
      return z;
    }

  } else {
    return null;
  }
};

const findZone = (zoneNumber) => {
  // Rechercher la zone correspondante dans filteredRows
  const zone = filteredRows.find((row) => {
    const rowZoneNumberWithoutSpaces = row.zoneNumber.replace(/\s/g, ''); // Remove spaces from row.zoneNumber
    const zoneNumberWithoutSpaces = zoneNumber.replace(/\s/g, ''); // Remove spaces from zoneNumber
    if (rowZoneNumberWithoutSpaces.includes(zoneNumberWithoutSpaces) && rowZoneNumberWithoutSpaces.length === zoneNumberWithoutSpaces.length) {
      return row;
    }
  });
  // Retourner les détails de la zone s'il est trouvé, sinon null
  return zone || null;
};

//Deux objets pour stocker les données groupées
  const groupedRows = {};
  const groupedRowsPrestation = {};

  /* *************************Explication***************

   - Deux objets vides groupedRows et groupedRowsPrestation sont créés pour stocker les données groupées.
   - Une boucle forEach est utilisée pour parcourir chaque élément de la liste (list).
   - Pour chaque élément, le code vérifie si groupedRows ne contient pas déjà une clé correspondant 
    à la propriété row.numAttestation. Si la clé n'existe pas, elle est ajoutée à groupedRows en tant 
    que clé d'objet vide.
   - Ensuite, le code vérifie si groupedRows[row.numAttestation] ne contient pas déjà 
    une clé correspondant à la propriété row.recordDescription.Si la clé n'existe pas,
    elle est ajoutée en tant que clé d'un tableau vide à groupedRows[row.numAttestation].
   - L'élément row est ensuite ajouté au tableau correspondant à 
   groupedRows[row.numAttestation][row.recordDescription].
   - Si les propriétés row.numPrestation et row.numAttestation ne sont pas nulles,
   le code effectue des vérifications similaires pour groupedRowsPrestation.
   - Le code crée des clés d'objets et des tableaux vides dans groupedRowsPrestation pour stocker les éléments row en fonction de row.numAttestation, row.recordDescription et row.numPrestation.
   - Finalement, la boucle se termine et nous avons deux objets (groupedRows et groupedRowsPrestation)
    qui contiennent les données groupées en fonction des clés row.numAttestation, row.recordDescription 
    et row.numPrestation.

  */
  list.forEach((row) => {
    if (!groupedRows[row.numAttestation]) {
      groupedRows[row.numAttestation] = {};
    }

    if (!groupedRows[row.numAttestation][row.recordDescription]) {
      groupedRows[row.numAttestation][row.recordDescription] = [];
    }

    groupedRows[row.numAttestation][row.recordDescription].push(row);

    if (row.numPrestation !== null && row.numAttestation !== null) {
      if (
        typeof groupedRowsPrestation[row.numAttestation] === "undefined" ||
        typeof groupedRowsPrestation[row.numAttestation][row.recordDescription] === "undefined"
      ) {
        groupedRowsPrestation[row.numAttestation] =
          groupedRowsPrestation[row.numAttestation] || {};
        groupedRowsPrestation[row.numAttestation][row.recordDescription] = {};
      }

      if (
        typeof groupedRowsPrestation[row.numAttestation][row.recordDescription][row.numPrestation] ===
        "undefined"
      ) {
        groupedRowsPrestation[row.numAttestation][row.recordDescription][row.numPrestation] = [];
      }

      groupedRowsPrestation[row.numAttestation][row.recordDescription][row.numPrestation].push(row);

    }
  });

  const filteredRows = selectedRecord ?
    groupedRows[selectedRecord.numAttestation][selectedRecord.recordDescription]
      .filter(row =>
        (selectedRecord.numPrestation === undefined || row.numPrestation === selectedRecord.numPrestation)
      )
      .filter(row => {
        if (row.numPrestation !== null && row.numPrestation !== 0) {
          const prestationRows = groupedRowsPrestation[row.numAttestation][row.recordDescription][row.numPrestation];
          return prestationRows.includes(row);
        }
        return true;
      })
      
    : [];

    return(
      <div>
          <PageTitle></PageTitle>
          <div className="mb-8">
            <Card>
              <CardBody>
                <p className="mb-4 font-semibold text-gray-600 dark:text-gray-300">Contenu de votre fichier eFact</p>
                <p className="text-gray-600 dark:text-gray-400">
                La présente page a pour vocation de vous fournir un aperçu détaillé du contenu de votre fichier Efact. 
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                Dans l'éventualité où vous rencontreriez des difficultés ou des problèmes, n'hésitez pas à solliciter l'assistance de notre équipe de support dévouée en ouvrant un ticket. Nous nous engageons à vous fournir toute l'aide nécessaire pour résoudre efficacement vos soucis.
                </p>
                <div className="flex flex-col flex-wrap mt-2">
                <div>
                <Button tag={Link} >
                    Ouvrir un ticket
                </Button>
                </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <>
          {Object.entries(groupedRows)
  .sort(([numAttestationA], [numAttestationB]) => {
    if (numAttestationA === null && numAttestationB === null) return 0;
    if (numAttestationA === null) return -1;
    if (numAttestationB === null) return 1;
    return numAttestationA.localeCompare(numAttestationB);
  })
  .map(([numAttestation, rowsByRecordDescription]) => {
    const showNumAttestation = numAttestation !== null && numAttestation !== 0;
    return (
      <div>
        <Card>
          <CardBody>
            <div style={{ paddingTop: '5px', paddingLeft: '5px' }} key={numAttestation} >
              <h5 style={{ paddingBottom: '10px' }} className="mb-1 font-semibold text-gray-600 dark:text-gray-300">
                {showNumAttestation ? `Attestation numéro : ${numAttestation}` : '---'}
              </h5>
              <hr className="mt-2 mb-3" />
              {Object.entries(rowsByRecordDescription).map(([recordDescription, rows]) => (
                <div
                  className="text-gray-600 dark:text-gray-400 pl-5"
                  key={recordDescription}
                  style={{ marginBottom: '0.5rem', cursor: 'pointer' }}
                  onClick={() => handleRecordClick(numAttestation, recordDescription)}
                >
                  {recordDescription}
                  {/* Display numPrestation if it exists */}
                  {groupedRowsPrestation[numAttestation] &&
                    groupedRowsPrestation[numAttestation][recordDescription] &&
                    Object.keys(groupedRowsPrestation[numAttestation][recordDescription]).map((numPrestation) => (
                      <div key={numPrestation} onClick={() => handlePrestationClick(numAttestation, recordDescription, numPrestation)}>
                        Prestation numéro : {numPrestation}
                      </div>
                    ))}
                </div>
              ))}
                {expandedRecord && selectedRecord && expandedRecord === selectedRecord.recordDescription && expandedGroup === numAttestation && (
                <TableContainer style={{ maxWidth: '100%', animation: 'fade-in 0.5s' }} className="animated-table">
                  <Table>
                    <TableHeader>
                      <tr>
                        <TableCell style={{ width: '20%' }}>{`Attestation ${selectedRecord.numAttestation} - ${selectedRecord.recordDescription}`}</TableCell>
                      </tr>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <Table>
                          <TableHeader>
                            <tr>
                              <TableCell style={{ width: '20%' }}>Numéro Zone</TableCell>
                              <TableCell style={{ width: '20%' }}>Description</TableCell>
                              <TableCell style={{ width: '20%' }}>Contenu</TableCell>
                            </tr>
                          </TableHeader>
                          <TableBody>
                          {filteredRows &&
                            filteredRows.map((row, index) => (
                              <TableRow key={index} onClick={row.isError ? () => openModal(row.id) : null}
                              style={{ cursor: row.isError ? 'pointer' : 'default' }}
                              >
                                <TableCell style={{ width: '20%',
                                    background: row.isError ? 'red' : 'inherit',
                                    color:row.isError? 'white':'inherit'
                                  }}
                                >
                                  {row.zoneNumber}
                                </TableCell>
                                <TableCell
                                  style={{
                                    width: '20%',
                                    background: row.isError ? 'red' : 'inherit',
                                    color:row.isError? 'white':'inherit'
                                  }}
                                >
                                  {row.description}
                                </TableCell>
                                <TableCell
                                  style={{
                                    width: '20%',
                                    background: row.isError ? 'red' : 'inherit',
                                    color:row.isError? 'white':'inherit'
                                  }}
                                >
                                  {row.zoneContent}
                                </TableCell>
                              </TableRow>
                            ))}

                          </TableBody>
                        </Table>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>
          </CardBody>
        </Card>
        <br/>
      </div>
    );
  })}

          <Modal isOpen={isModalOpen} onClose={closeModal}>
            {dataDetails && dataDetails.id && (
              <div>
                <React.Fragment key={dataDetails.id}>
                <ModalHeader>Détails sur l'erreur indiqué dans votre fichier de réponse :</ModalHeader>
                <ModalBody> 
                  <div className="px-4 py-3 mb-8 bg-white rounded-lg shadow-md dark:bg-gray-800">
                    <Label className='p-1'>
                      <h6>Code Erreur :</h6>
                      <p className='pl-2' style={{color:'red'}}>{dataDetails.codeError}</p>
                    </Label>
                    <Label className='p-1'>
                      <h6>Description : </h6>
                      <p className='pl-2'style={{color:'red'}}>{dataDetails.descriptionError}</p>
                    </Label>
                    <Label className='p-1'>
                      <h6>Nature d'Erreur : </h6>
                      <p className='pl-2' style={{color:'red'}}>{dataDetails.natureErreur}</p>
                    </Label>
                    <TableContainer>
  <Table>
    <TableHeader>
      <tr>
        <TableCell>Numéro de Zone</TableCell>
        <TableCell>Description</TableCell>
        <TableCell>Contenu</TableCell>
      </tr>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>
          <div className="flex items-center text-sm">
            <div>
              <p className="font-semibold">{zone?.zoneNumber}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center text-sm">
            <div>
              <p className="font-semibold">{zone?.description}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center text-sm">
            <div>
              <p className="font-semibold">{zone?.zoneContent}</p>
            </div>
          </div>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>
                  </div>   
                </ModalBody>
              </React.Fragment>
            </div>
            )}
          </Modal>
          </>
          </div>
      );
}
export default ShowFile