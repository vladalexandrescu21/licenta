import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import styles from '../css/dropZone.module.css';
import Alert from 'react-bootstrap/Alert';

function Dropzone(props) {
  let navigate = useNavigate();
  const onDrop = useCallback(acceptedFiles => {
    let pdf = acceptedFiles[0];
    let reader = new FileReader();
    reader.readAsArrayBuffer(pdf);
    reader.onload = async function () {
      let user = JSON.parse(localStorage.getItem("user"));
      console.log(user.id);
      let item = {pdf: reader.result, status: "in asteptare", observatii: "Nimic", userId: user.id};
      let result = await fetch("http://localhost:8080/api/dropZone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(item)
      });
      if(result.status === 201){alert("Cererea a fost trimisa cu succes!")
      navigate("/paginaAngajat", { replace: true });}
      else{alert("Cererea nu a putut fi trimisa!");} 
    };

  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept: 'application/pdf'})

  return (
    <Container id='container' className={`${styles["font-link"]} font-link text-center mt-5 w-60 h-100`} {...getRootProps()}>
    {/* <div {...getRootProps()}> */}
      <input {...getInputProps()} />
      {
        isDragActive ?
          <Alert variant="warning" className='w-100 h-100 p-5'> <p>Eliberati click-ul pentru a incarca fisierul</p></Alert> :
          <Alert variant="success" className='w-100 h-100 p-5'> <p>Trageti fisierul aici sau dati click pentru a selecta un fisier (se accepta doar fisiere pdf)</p></Alert>
      }
    {/* </div> */}
    </Container>
  )
}

export default Dropzone;
