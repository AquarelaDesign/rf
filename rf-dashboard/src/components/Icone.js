import React from 'react';

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
} from 'react-icons/fa';

import { GrDeliver } from 'react-icons/gr'
import { GiExitDoor } from 'react-icons/gi'
import { RiSearchLine } from 'react-icons/ri'
import { FcPlus } from 'react-icons/fc'

export const FaIcon = ({ icon, size }) => {
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
    default: return null
  }
}