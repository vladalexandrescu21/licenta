import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useNavigate } from 'react-router-dom';

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
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Incarcati cererea semnata (se accepta doar fisier pdf):</p> :
          <p>Incarcati cererea semnata (se accepta doar fisier pdf):</p>
      }
    </div>
  )
}

export default Dropzone;
