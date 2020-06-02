export function loadLists() {
  return [
    { 
      title: 'MOTORISTAS ONLINE', 
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
      ]
    },
    { 
      title: 'CARGAS DISPONÍVEIS', 
      creatable: true,
      cards: [
      ]
    },
    { 
      title: 'TRANSPORTES', 
      creatable: false,
      cards: [
      ]
    },
    { 
      title: 'ENTREGAS', 
      creatable: false,
      done: true,
      cards: [
      ]
    },
  ];
}