import React, { useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { uniqueId } from 'lodash'
// import filesize from 'filesize'

import api from '../../../services/rf'
import semImagem from '../../../assets/sem_foto.png'

const foto = {
  display: "block",
  width: "100%",
  height: "130px",
  borderRadius: "65px",
  cursor: "pointer",
  objectFit: 'contain',
};

const img = {
  display: "block",
  width: "100%",
  height: "130px",
  borderRadius: "5px",
  cursor: "pointer",
  objectFit: 'contain',
};

function Dropzone(props) {
  const [prev, setPrev] = useState(null)
  const [files, setFiles] = useState([])

  useEffect(() => {
    if (prev === null) {
      setPrev(semImagem)
    }
  }, [prev])

  useEffect(() => {
    if (props.input.value !== null && 
        props.input.value !== undefined && 
        props.input.value !== "")
    {
      setPrev(`images/${props.input.value}`)
    }
  }, [props.input.value])

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: false,
    noDrag: true,
    onDrop: acceptedFiles => {
      const files = acceptedFiles.map(file => {
          setPrev(URL.createObjectURL(file))
          return Object.assign(file, {
            preview: URL.createObjectURL(file),
            id: uniqueId(),
          })
        }
      )
      setFiles(files)
      if (props.input.onChange) {
        files.forEach(processUpload)
      }
    }
  })

  useEffect(
    () => () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  )

  const updateFile = (id, data) => {
    setFiles(
      files.map(file => {
        return id === file.id 
          ? {...file, ...data} 
          : file
      })
    )
  }

  const processUpload = (file) => {
    const data = new FormData()

    data.append('file', file, file.name)

    api.post(`/images/${props.userID}/${file.id}`, data, {
      onUploadProgress: e => {
        const progress = parseInt(Math.round((e.loaded * 100) / e.total))
        updateFile(file.id, {
          progress,
        })
      }
    }).then(response => {
      props.input.onChange(response.data.name)
    }).catch(() => {
      updateFile(file.id, {
        error: true,
      })
    })
  }

  return (
    <div className="d-inline-block mt-4">
      <div {...getRootProps({ className: "btn-dropzone" })}>
        <input {...getInputProps()} />
        <img 
          src={prev} 
          style={props.name === 'foto' ? foto : img} 
          alt="" 
        />
      </div>
    </div>
  );
}

export default Dropzone;
