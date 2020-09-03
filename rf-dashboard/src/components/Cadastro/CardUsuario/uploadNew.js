import React, { useEffect, useState, useRef } from "react"
import { useDropzone } from "react-dropzone"
import { uniqueId } from 'lodash'
// import filesize from 'filesize'

import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'

import api from '../../../services/rf'
import semImagem from '../../../assets/sem_foto.png'
import { FaIcon } from '../../Icone'

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

const foto = {
  display: "block",
  width: "100%",
  height: "130px",
  borderRadius: "65px",
  // cursor: "pointer",
  objectFit: 'contain',
}

const img = {
  display: "block",
  width: "100%",
  height: "130px",
  borderRadius: "5px",
  // cursor: "pointer",
  objectFit: 'contain',
}

const zoomImage = {
  display: "block",
  width: "100%",
  height: "100%",
  borderRadius: "5px",
  // cursor: "pointer",
  objectFit: 'contain',
}

const dev = window.location.hostname === "localhost" ? 'https://www.retornofacil.com.br/rf/' : ''

function rand() {
  return Math.round(Math.random() * 20) - 10
}

function getModalStyle() {
  const top = 50 + rand()
  const left = 50 + rand()

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  }
}

function Dropzone(props) {
  const thisRef = useRef(null)
  const [prev, setPrev] = useState(null)
  const [files, setFiles] = useState([])
  const [width, setWidth] = useState(0)

  const classes = useStyles()
  const [modalStyle] = React.useState(getModalStyle)
  const [open, setOpen] = React.useState(false)

  useEffect(() => {
    if (prev === null) {
      setPrev(semImagem)
    }
  }, [prev])

  useEffect(() => {
    setWidth(thisRef.current ? thisRef.current.offsetWidth : 0)
  }, [thisRef.current])

  useEffect(() => {
    if (props.input.value !== null &&
      props.input.value !== undefined &&
      props.input.value !== "") {
      setPrev(`${dev}images/${props.input.value}`)
    }
  }, [props.input.value])

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    multiple: false,
    noDrag: true,
    disabled: props.disabled,
    onDrop: acceptedFiles => {
      const files = acceptedFiles.map(file => {
        setPrev(URL.createObjectURL(file))
        console.log('**** URL', URL.createObjectURL(file))
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
          ? { ...file, ...data }
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

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  console.log('**** width', width)

  return (
    <>
      <div className="d-inline-block mt-4" ref={thisRef}>
        <button 
          type="button" 
          onClick={handleOpen}
          style={{
            backgroundColor: "transparent"
          }}
        >
          <img
            src={prev}
            style={props.name === 'foto' ? foto : img}
            alt=""
          />
        </button>
        <div {...getRootProps({ className: "btn-dropzone" })} style={{ 
          position: 'relative',
          bottom: 5,
          left: `${width - 22}px`,
          cursor: "pointer",
          width: '30px',
          zIndex: 502,
        }}>
          <input {...getInputProps()} />
          <FaIcon icon='FileUpload' size={20} />
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <button 
          type="button" 
          onClick={handleClose} 
          style={{
            top: '20px', 
            width: "100%", 
            height: "98%", 
            backgroundColor: "transparent"
          }}
        >
          <img
            src={prev}
            style={zoomImage}
            alt=""
          />
        </button>
      </Modal>
    </>
  )
}

export default Dropzone
