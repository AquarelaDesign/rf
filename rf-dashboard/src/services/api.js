export function loadLists() {
  return [
    { 
      title: 'MOTORISTAS ONLINE', 
      icon: 'FaTruck',
      creatable: false,
      cards: [
        {
          id: 1,
          content: 'Maciel Oliveira',
          labels: ['#7159c1'],
          user: 'https://jakweb.com.br/rf/motorista01.png'
        },
        {
          id: 2,
          content: 'Letícia Soares',
          labels: ['#7159c1'],
          user: 'https://jakweb.com.br/rf/motorista02.png'
        },
        {
          id: 3,
          content: 'Eliel Santos',
          labels: ['#7159c1'],
          user: 'https://jakweb.com.br/rf/motorista03.png'
        },
        {
          id: 4,
          content: 'Maciel Oliveira',
          labels: ['#7159c1'],
          user: 'https://jakweb.com.br/rf/motorista01.png'
        },
        {
          id: 5,
          content: 'Letícia Soares',
          labels: ['#7159c1'],
          user: 'https://jakweb.com.br/rf/motorista02.png'
        },
        {
          id: 6,
          content: 'Eliel Santos',
          labels: ['#7159c1'],
          user: 'https://jakweb.com.br/rf/motorista03.png'
        },
        {
          id: 7,
          content: 'Maciel Oliveira',
          labels: ['#7159c1'],
          user: 'https://jakweb.com.br/rf/motorista01.png'
        },
        {
          id: 8,
          content: 'Letícia Soares',
          labels: ['#7159c1'],
          user: 'https://jakweb.com.br/rf/motorista02.png'
        },
        {
          id: 9,
          content: 'Eliel Santos',
          labels: ['#7159c1'],
          user: 'https://jakweb.com.br/rf/motorista03.png'
        },
      ]
    },
    { 
      title: 'CARGAS DISPONÍVEIS', 
      icon: 'FaBoxOpen',
      creatable: true,
      cards: [
      ]
    },
    { 
      title: 'TRANSPORTES', 
      icon: 'FaArrowAltCircleRight',
      creatable: false,
      cards: [
      ]
    },
    { 
      title: 'ENTREGAS', 
      icon: 'FaBox',
      creatable: false,
      done: true,
      cards: [
      ]
    },
  ];
}