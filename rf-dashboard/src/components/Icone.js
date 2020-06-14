import React from 'react';

import { 
  FaTruck, 
  FaBoxOpen, 
  FaArrowAltCircleRight, 
  FaBox, 
  FaBell, 
  FaDiscourse,
  FaFilter,
} from 'react-icons/fa';

import { GiExitDoor } from 'react-icons/gi'

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
    default: return null
  }
}