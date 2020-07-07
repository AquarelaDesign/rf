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
} from 'react-icons/fa'

import { GrDeliver } from 'react-icons/gr'
import { GiExitDoor } from 'react-icons/gi'
import { RiSearchLine } from 'react-icons/ri'
import { FcPlus, FcCancel } from 'react-icons/fc'
import { FiAlertOctagon, FiAlertTriangle } from 'react-icons/fi'
import { MdDeleteForever, MdAddCircle, MdBlock } from 'react-icons/md'

import blank from '../assets/transparent.png'
import supplier from '../assets/supplier.png'

export const FaIcon = ({ icon, size, height, width }) => {
  switch (icon) {
    case 'FaTruck': return <FaTruck size={size} style={{ paddingTop: 10 }} />
    case 'FaBoxOpen': return <FaBoxOpen size={size} style={{ paddingTop: 10 }} />
    case 'FaArrowAltCircleRight': return <FaArrowAltCircleRight size={size} style={{ paddingTop: 10 }} />
    case 'FaBox': return <FaBox size={size} style={{ paddingTop: 10 }} />
    case 'FaDiscourse': return <FaDiscourse size={size} style={{ marginLeft: 10, marginRight: 5 }} />
    case 'FaBell': return <FaBell size={size} style={{ marginLeft: 5, marginRight: 10 }} />
    case 'FaFilter': return <FaFilter size={size} style={{ marginLeft: 0, marginRight: 5 }} />
    case 'GiExitDoor': return <GiExitDoor size={size} style={{ marginLeft: 0, marginRight: 10 }} />
    case 'RiSearchLine': return <RiSearchLine size={size} style={{ marginTop: '1px' }} />
    case 'FaRegEdit': return <FaRegEdit size={size} style={{ color: 'red', marginTop: '1px' }} />
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
    case 'blank': return <Image src={blank} alt="" height={size} width={size} />
    case 'supplier': return <Image src={supplier} alt="" style={{ height: 20, width: 20 }} />
    case 'Deletar': return <MdDeleteForever size={size} />
    case 'Add': return <MdAddCircle size={size} />
    case 'Save': return <FaSave size={size} />
    case 'Bloqueado': return <MdBlock size={size} />
    case 'Recusado': return <FiAlertOctagon size={size} />
    case 'Suspenso': return <FiAlertTriangle size={size} />
    default: return null
  }
}