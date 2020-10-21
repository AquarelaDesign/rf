import React from 'react'
import { Image } from 'react-bootstrap'

import { 
  FaTruck, 
  FaBoxOpen, 
  FaArrowAltCircleRight, 
  FaBox, 
  FaBell, 
  FaDiscourse,
  FaFilter,
  FaRegEdit,
  FaHeadphonesAlt,
  FaUserTie,
  FaTruckLoading,
  FaHandPaper,
  FaRegThumbsUp,
  FaCircle,
  FaSave,
  FaFileUpload,
} from 'react-icons/fa'

import { BsBackspaceFill } from 'react-icons/bs'
import { AiOutlineCloseCircle, AiTwotoneLike } from 'react-icons/ai'
import { GoChecklist } from 'react-icons/go'
import { GrDeliver, GrUpdate, GrHostMaintenance, GrSecure } from 'react-icons/gr'
import { GiExitDoor, GiStopwatch, GiReturnArrow } from 'react-icons/gi'
import { RiSearchLine } from 'react-icons/ri'
import { FcPlus, FcCancel, FcDocument, FcInTransit } from 'react-icons/fc'
import { FiAlertOctagon, FiAlertTriangle } from 'react-icons/fi'
import { MdDeleteForever, MdAddCircle, MdBlock, MdCheckCircle, MdCancel, MdZoomOutMap } from 'react-icons/md'

import blank from '../assets/transparent.png'
import supplier from '../assets/supplier.png'
import entregue from '../assets/entregue.png'
import whats from '../assets/whatsApp.png'
import pb_whats from '../assets/pb_whats.png'
import pb_email from '../assets/pb_email.png'
import pb_fone from '../assets/pb_fone.png'

export const FaIcon = ({ icon, size, height, width }) => {
  switch (icon) {
    case 'Return': return <BsBackspaceFill size={size} />
    case 'FecharImg': return <AiOutlineCloseCircle size={size} />
    case 'FaTruck': return <FaTruck size={size} style={{ paddingTop: 10 }} />
    case 'FaBoxOpen': return <FaBoxOpen size={size} style={{ paddingTop: 10 }} />
    case 'FaArrowAltCircleRight': return <FaArrowAltCircleRight size={size} style={{ paddingTop: 10 }} />
    case 'FaBox': return <FaBox size={size} style={{ paddingTop: 10 }} />
    case 'FaDiscourse': return <FaDiscourse size={size} style={{ marginLeft: 10, marginRight: 5 }} />
    case 'FaBell': return <FaBell size={size} style={{ marginLeft: 5, marginRight: 10 }} />
    case 'Usuario': return <FaHeadphonesAlt size={size} style={{ marginRight: 10 }} />
    case 'FaFilter': return <FaFilter size={size} style={{ marginLeft: 0, marginRight: 5 }} />
    case 'GiExitDoor': return <GiExitDoor size={size} style={{ marginLeft: 0, marginRight: 10 }} />
    case 'RiSearchLine': return <RiSearchLine size={size} style={{ marginTop: '1px' }} />
    case 'FaRegEdit': return <FaRegEdit size={size} style={{ color: 'blue', marginTop: '1px' }} />
    case 'GrUpdate': return <GrUpdate size={size} style={{ marginTop: '1px' }} />
    case 'FcPlus': return <FcPlus size={size} style={{ marginTop: '1px' }} />
    case 'FaTruck1': return <FaTruck size={size} style={{ marginTop: 10 }} />
    case 'FaHeadphonesAlt': return <FaHeadphonesAlt size={size} style={{ marginTop: 10 }} />
    case 'FaUserTie': return <FaUserTie size={size} style={{ marginTop: 10 }} />
    case 'FaTruckLoading': return <FaTruckLoading size={size} style={{ marginTop: 10 }} />
    case 'FaHandPaper': return <FaHandPaper size={size} style={{ marginTop: 10 }} />
    case 'FaRegThumbsUp': return <FaRegThumbsUp size={size} style={{ marginTop: 10 }} />
    case 'GrDeliver': return <GrDeliver size={size} style={{ marginTop: 10 }} />
    case 'FcCancel': return <FcCancel size={size} style={{ marginTop: 10 }} />
    case 'FiAlertOctagon': return <FiAlertOctagon size={size} style={{ marginTop: 10 }} />
    case 'FiAlertTriangle': return <FiAlertTriangle size={size} style={{ marginTop: 10 }} />
    case 'FaCircle': return <FaCircle size={size} style={{ marginTop: 10 }} />
    case 'FileUpload': return <FaFileUpload size={size} />
    case 'blank': return <Image src={blank} alt="" height={size} width={size} />
    case 'supplier': return <Image src={supplier} alt="" style={{ height: 20, width: 20 }} />
    case 'Documentos': return <FcDocument size={size} />
    case 'Ampliar': return <MdZoomOutMap size={size} />
    case 'Deletar': return <MdDeleteForever size={size} style={{ color: '#FF0000' }} />
    case 'Add': return <MdAddCircle size={size} />
    case 'Save': return <FaSave size={size} />
    case 'Seguranca': return <GrSecure size={size} />
    case 'Bloqueado': return <MdBlock size={size} />
    case 'Recusado': return <FiAlertOctagon size={size} />
    case 'Suspenso': return <FiAlertTriangle size={size} />
    case 'Aguardando': return <GiStopwatch size={size} />
    case 'Disponivel': return <MdCheckCircle size={size} />
    case 'Transporte': return <FcInTransit size={size} />
    case 'Confere': return <GoChecklist size={size} />
    case 'Cancelado': return <MdCancel size={size} />
    case 'Manutencao': return <GrHostMaintenance size={size} />
    case 'Entregue': return <Image src={entregue} alt="" style={{ height: {size}, width: {size} }} />
    case 'Aprovado': return <AiTwotoneLike size={size} style={{ marginBottom: 2, color: '#90D284' }} />
    case 'Whats': return <Image src={whats} alt="" style={{ height: 16, width: 16 }} />
    case 'pbWhats': return <Image src={pb_whats} alt="" style={{ height: 16, width: 16 }} />
    case 'pbEmail': return <Image src={pb_email} alt="" style={{ height: 16, width: 16 }} />
    case 'pbFone': return <Image src={pb_fone} alt="" style={{ height: 16, width: 16 }} />
    default: return null
  }
}