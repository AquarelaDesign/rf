export function loadMotoristas() {
  return { 
    title: "MOTORISTAS ONLINE", 
    icon: "FaTruck",
    tipo: "M",
    creatable: true,
    cards: [
      {
        id: 1,
        tipo: "M",
        nome: "Maciel Oliveira",
        whats: "41999998888",
        email: "maciel.oliveira@transtora.com.br",
        fone: "41999998888",
        rate: 3.5,
        tipoveiculo: "Cegonha",
        rota: "Curitiba/PR x São Luís/MA",
        vagas: 11,
        localizacao: "São José dos Pinhais/PR",
        user: "https://jakweb.com.br/rf/motorista01.png",
        status: true,
        estado: "D",
      },
      {
        id: 2,
        tipo: "M",
        nome: "Letícia Soares",
        whats: "41988887777",
        email: "leticia.soares@transdiva.com.br",
        fone: "41988887777",
        rate: 5,
        tipoveiculo: "Cegonha",
        rota: "Natal/RN x São Bernardo/SP",
        vagas: 7,
        localizacao: "Natal/RN",
        user: "https://jakweb.com.br/rf/motorista02.png",
      },
      {
        id: 3,
        tipo: "M",
        nome: "Eliel Santos",
        whats: "41977776666",
        email: "eliel.santos@transmano.com.br",
        fone: "41977776666",
        rate: 5,
        tipoveiculo: "Plataforma",
        rota: "São Bernardo/SP x Curitiba/PR",
        vagas: 3,
        localizacao: "São Bernardo do Campo/SP",
        user: "https://jakweb.com.br/rf/motorista03.png",
        status: true,
        estado: "D",
      },
      {
        id: 4,
        tipo: "M",
        nome: "Maciel Oliveira",
        whats: "41999998888",
        email: "maciel.oliveira@transtora.com.br",
        fone: "41999998888",
        rate: 3.5,
        tipoveiculo: "Cegonha",
        rota: "Curitiba/PR x São Luís/MA",
        vagas: 11,
        localizacao: "São José dos Pinhais/PR",
        user: "https://jakweb.com.br/rf/motorista01.png",
        status: true,
        estado: "D",
      },
      {
        id: 5,
        tipo: "M",
        nome: "Letícia Soares",
        whats: "41988887777",
        email: "leticia.soares@transdiva.com.br",
        fone: "41988887777",
        rate: 5,
        tipoveiculo: "Cegonha",
        rota: "Natal/RN x São Bernardo/SP",
        vagas: 7,
        localizacao: "Natal/RN",
        user: "https://jakweb.com.br/rf/motorista02.png",
        status: true,
        estado: "D",
      },
      {
        id: 6,
        tipo: "M",
        nome: "Eliel Santos",
        whats: "41977776666",
        email: "eliel.santos@transmano.com.br",
        fone: "41977776666",
        rate: 5,
        tipoveiculo: "Plataforma",
        rota: "São Bernardo/SP x Curitiba/PR",
        vagas: 3,
        localizacao: "São Bernardo do Campo/SP",
        user: "https://jakweb.com.br/rf/motorista03.png",
        status: true,
        estado: "D",
      },
    ]
  }
}

export function loadCargas() {
  return { 
    title: "CARGAS DISPONÍVEIS", 
    icon: "FaBoxOpen",
    tipo: "C",
    creatable: true,
    cards: [
      {
        id: 1,
        tipo: "C",
        pedido: 2450,
        local: "NATAL/RN",
        limitecoleta: "23/04/2020",
        limiteentrega: "11/05/2020",
        rota: "NATAL/RN x CURITIBA/PR",
        veiculos: [
          {
            modelo: "STRADA",
            placachassi: "PZY2451",
            estado: "Funcionando",
          },
          {
            modelo: "STRADA",
            placachassi: "PZY2452",
            estado: "Pane",
          },
          {
            modelo: "STRADA",
            placachassi: "PZY2453",
            estado: "Sinistrado",
          },
        ],
        localcoleta: 1,
        localentrega: 2,
      },
      {
        id: 2,
        tipo: "C",
        pedido: 2451,
        local: "CURITIBA/PR",
        limitecoleta: "15/06/2020",
        limiteentrega: "30/06/2020",
        rota: "CURITIBA/PR x SAO PAULO/SP",
        veiculos: [
          {
            modelo: "RENAULT SANDERO",
            placachassi: "1234567",
            estado: "Funcionando",
          },
          {
            modelo: "RENAULT SANDERO",
            placachassi: "1234568",
            estado: "Funcionando",
          },
          {
            modelo: "RENAULT SANDERO",
            placachassi: "1234569",
            estado: "Funcionando",
          },
          {
            modelo: "RENAULT SANDERO",
            placachassi: "1234510",
            estado: "Funcionando",
          },
          {
            modelo: "RENAULT SANDERO",
            placachassi: "1234511",
            estado: "Funcionando",
          },
        ],
        localcoleta: 1,
        localentrega: 2,
      },
    ]
  }
}

export function loadTransportes() {
  return { 
    title: "TRANSPORTES", 
    icon: "FaArrowAltCircleRight",
    tipo: "T",
    creatable: false,
    cards: [
      {
        motorista: {
          id: 3,
          tipo: "M",
          nome: "Eliel Santos",
          whats: "41977776666",
          email: "eliel.santos@transmano.com.br",
          fone: "41977776666",
          rate: 5,
          tipoveiculo: "Plataforma",
          rota: "São Bernardo/SP x Curitiba/PR",
          vagas: 3,
          localizacao: "São Bernardo do Campo/SP",
          user: "https://jakweb.com.br/rf/motorista03.png"
        },
        carga: {
          id: 1,
          tipo: "C",
          pedido: 2450,
          local: "NATAL/RN",
          limitecoleta: "23/04/2020",
          limiteentrega: "11/05/2020",
          rota: "NATAL/RN x CURITIBA/PR",
          veiculos: [
            {
              modelo: "STRADA",
              placachassi: "PZY2451",
              estado: "Funcionando",
            },
            {
              modelo: "STRADA",
              placachassi: "PZY2452",
              estado: "Pane",
            },
            {
              modelo: "STRADA",
              placachassi: "PZY2453",
              estado: "Sinistrado",
            },
          ],
          localcoleta: 1,
          localentrega: 2,
        }
      }
    ]
  }
}

export function loadEntregas() {
  return { 
    title: "ENTREGAS", 
    icon: "FaBox",
    tipo: "E",
    creatable: false,
    done: true,
    cards: [
    ]
  }
}

export function loadRotas() {
  return [
    { 
      id: 1,
      descricao: "BR AUTO SERVICO MECANICA LTDA", 
      logradouro: "R DOS CAICOS",
      numero: "1986",
      complemento: "",
      bairro: "ROSADO",
      cidade: "NATAL",
      uf: "RN",
      pais: "BRASIL",
      cep: "12345678",
      contato: "Bruno",
      fone: "84998113770",
    },
    { 
      id: 2,
      descricao: "OURO VERDE", 
      logradouro: "R JOAO BETTEGA",
      numero: "3300",
      complemento: "",
      bairro: "CIDADE INDUSTRIAL",
      cidade: "CURITIBA",
      uf: "PR",
      pais: "BRASIL",
      cep: "12345678",
      contato: "Khelim",
      fone: "41991655253",
    },
  ]
}

export function cadMotoristas() {
  return [
    {
      "nome":"JOSE AUGUSTO FREIRE", 
      "email":"aquarela.design1@gmail.com",
      "cpfcnpj":"03516782714",
      "ierg":"10288367-5",
      "contato":"",
      "celular":"41997289892",
      "telefone":"",
      "whats":"41997289892",
      "codigopush":"",
      "logradouro":"RUA BOM JUSUS DE IGUAPE",
      "numero":"1335",
      "complemento":"FUNDOS",
      "bairro":"HAUER",
      "cidade":"CURITIBA",
      "uf":"PR",
      "foto":"https://jakweb.com.br/rf/sem_foto.png",
      "cep":"81610040",
      "rate":0,
      "latitude":0,
      "longitude":0,
      "status":"A",
      "estado":"",
      "tipo":"O"
    },
    {
      "tipo": "M",
      "nome": "Maciel Oliveira",
      "whats": "41999998888",
      "email": "maciel.oliveira@transtora.com.br",
      "telefone": "41999998888",
      "rate": 3.5,
      "foto": "https://jakweb.com.br/rf/motorista01.png",
      "status": "A",
      "estado": "D",
      "cpfcnpj":"28325940000",
      "ierg":"123456",
      "celular":"41999998888",
      "logradouro":"RUA",
      "bairro":"REBOUCAS",
      "cidade":"CURITIBA",
      "uf":"PR",
      "cep":"80220000"
    },
    {
      "tipo": "M",
      "nome": "Letícia Soares",
      "whats": "41988887777",
      "email": "leticia.soares@transdiva.com.br",
      "telefone": "41988887777",
      "rate": 5,
      "foto": "https://jakweb.com.br/rf/motorista02.png",
      "status": "A",
      "estado": "D",
      "cpfcnpj":"52883455031",
      "ierg":"123456",
      "celular":"41988887777",
      "logradouro":"RUA",
      "bairro":"25 DE DEZEMBRO",
      "cidade":"NATAL",
      "uf":"RN",
      "cep":"81220000"
    },
    {
      "tipo": "M",
      "nome": "Eliel Santos",
      "whats": "41977776666",
      "email": "eliel.santos@transmano.com.br",
      "telefone": "41977776666",
      "rate": 5,
      "foto": "https://jakweb.com.br/rf/motorista03.png",
      "status": "A",
      "estado": "D",
      "cpfcnpj":"55415841083",
      "ierg":"123456",
      "celular":"41977776666",
      "logradouro":"RUA",
      "bairro":"MONTADORAS",
      "cidade":"SAO BERNARDO DO CAMPO",
      "uf":"SP",
      "cep":"82220000"
    },
    {
      "tipo": "M",
      "nome": "Maciel Oliveira",
      "whats": "41999998888",
      "email": "maciel.oliveira@transtora.com.br",
      "telefone": "41999998888",
      "rate": 3.5,
      "foto": "https://jakweb.com.br/rf/motorista01.png",
      "status": "A",
      "estado": "D",
      "cpfcnpj":"46347102005",
      "ierg":"123456",
      "celular":"41999998888",
      "logradouro":"RUA",
      "bairro":"REBOUCAS",
      "cidade":"CURITIBA",
      "uf":"PR",
      "cep":"80220000"
    },
    {
      "tipo": "M",
      "nome": "Letícia Soares",
      "whats": "41988887777",
      "email": "leticia.soares@transdiva.com.br",
      "telefone": "41988887777",
      "rate": 5,
      "foto": "https://jakweb.com.br/rf/motorista02.png",
      "status": "A",
      "estado": "D",
      "cpfcnpj":"64757830050",
      "ierg":"123456",
      "celular":"41988887777",
      "logradouro":"RUA",
      "bairro":"25 DE DEZEMBRO",
      "cidade":"NATAL",
      "uf":"RN",
      "cep":"81220000"
    },
    {
      "tipo": "M",
      "nome": "Eliel Santos",
      "whats": "41977776666",
      "email": "eliel.santos@transmano.com.br",
      "telefone": "41977776666",
      "rate": 5,
      "foto": "https://jakweb.com.br/rf/motorista03.png",
      "status": "A",
      "estado": "D",
      "cpfcnpj":"91432364057",
      "ierg":"123456",
      "celular":"41977776666",
      "logradouro":"RUA",
      "bairro":"MONTADORAS",
      "cidade":"SAO BERNARDO DO CAMPO",
      "uf":"SP",
      "cep":"82220000"
    }
  ]
}

export function cadPedidos() {
  return [
    {
      "tipo": "C",
      "limitecoleta": "2020-04-23",
      "limiteentrega": "2020-05-11"
    },
    {
      "tipo": "C",
      "limitecoleta": "2020-06-15",
      "limiteentrega": "2020-06-30"
    }
  ]
}