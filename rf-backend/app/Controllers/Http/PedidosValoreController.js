'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Usuario = use('App/Models/Usuario')
const Pedido = use('App/Models/PedidosValore')
const PedidoCli = use('App/Models/Pedido')
// const Veiculo = use('App/Models/Veiculo')
// const Rota = use('App/Models/Rota')
const ValoresAdicionais = use('App/Models/ValoresAdicionai')
const Seguro = use('App/Models/Seguro')

/**
 * Resourceful controller for interacting with pedidosvalores
 */
class PedidosValoreController {
  /**
   * Show a list of all pedidosvalores.
   * GET pedidosvalores
   */
  async index({ auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const pedidosvalores = Pedido.all()
    return pedidosvalores
  }

  /**
   * Show a list of rota with pedido.
   * POST buscavalped/:id
   */
  async busca({auth, params, request, response}) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }

    try {    
      const query = Pedido.query()
      if (params.id !== null){
        query.andWhere('pedido_id','=', params.id)
      }
      const pedidosvalores = await query.fetch()
      return pedidosvalores

    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Rota não encontrada ${e}`
      })
    }

  }

  /**
   * Returns the calculation of Order values.
   * GET calculaValor/:id (pedido)
   */
  async calculaValor({ params, request, response }) {
    try {  

      const data = request.only([
        "valor_desconto", 
        "percentual_desconto",
        "percentual_imposto",
        "exclusivo",
      ])

      let valoresAgregados = 0
  
      // --------> Pedido
      const queryPedido = PedidoCli.query()
            queryPedido.where('id',params.id)
            queryPedido.with('veiculos')
                       .with('rotas', (builder) => {
                          builder.orderBy('rota_relacionada', 'asc') 
                       })
      const pedidos = await queryPedido.fetch()

      const pedido = JSON.parse(JSON.stringify(pedidos))
      const veiculos = pedido[0].veiculos
      const rotas = pedido[0].rotas

      if (veiculos.length === 0) {
        return response.status(404).send({
          status: 404,
          message: 'Não foram encontrados veículos cadastrados no pedido!'
        })
      }

      if (rotas.length === 0) {
        return response.status(404).send({
          status: 404,
          message: 'Não foram encontradas rotas cadastradas no pedido!'
        })
      }

      let str_val = '0'
      if (data.valor_desconto !== null && data.valor_desconto !== undefined) {  
        str_val = data.valor_desconto.toString()
        str_val.replace('.', '')
        str_val = str_val.replace(',', '.')
      }

      let str_per = '0'
      if (data.percentual_desconto !== null && data.percentual_desconto !== undefined) {  
        str_per = data.percentual_desconto.toString()
        str_per.replace('.', '')
        str_per = str_per.replace(',', '.')
      }

      let str_imp = '0'
      if (data.percentual_imposto !== null && data.percentual_imposto !== undefined) {  
        str_imp = data.percentual_imposto.toString()
        str_imp.replace('.', '')
        str_imp = str_imp.replace(',', '.')
      }

      let percentual_imposto = parseFloat(str_imp)
      let valor_total_pedido = 0
      let valor_total_veiculos_pedido = 0
      let valor_rotas_pedido = 0
      let valor_seguro_pedido = 0
      let valor_seguro_roubo_pedido = 0
      let valor_agregados_pedido = 0
      let valor_imposto_pedido = 0
      let valor_desconto_pedido = parseFloat(str_val)
      let percentual_desconto_pedido = parseFloat(str_per)

      let RotaDesc = ''
      let rotaOk = false
      let valores = []

      veiculos.forEach(vei => {
        let tipoVei = 1
        let val_km = 0

        if (vei.tipo === "motos") {
          tipoVei = 3
        } else {
          tipoVei = 1
        }

        let valor_veiculo = vei.valor // Valor do Veiculo

        // Busca valores agregados
        const buscavalad = async (tipoVei) => {
          const queryvalad = ValoresAdicionais.query()
                queryvalad.where('tipo_de_veiculo_id', tipoVei)
                queryvalad.where('imposto', 0)
          
          if (data.exclusivo !== null && data.exclusivo !== undefined) {
            queryvalad.where('exclusivo', 1)
          } else {
            queryvalad.where('exclusivo', 0)
          }

          queryvalad.sum('valor as valor_agregados_veiculo')

          const valoresadicionais = await queryvalad.fetch()
          const tmp = JSON.parse(JSON.stringify(valoresadicionais))
          return parseFloat(tmp[0].valor_agregados_veiculo)
        }

        const valor_agregados_veiculo = buscavalad(tipoVei)

        // Busca os valores do seguro conforme a tabela
        let valor_seguro_veiculo = 0
        let valor_rotas_veiculo = 0

        let rtSeg = []
        let cont = 0
        let reg = {
          origem: '',
          destino: ''
        }
        
        let _tipo = 'O'
        rotas.forEach(r => {
          // console.table('**** PedidosModal.calculaValorPedido.r', r)
          reg['rota'] = r.rota_relacionada - 1 < 0 ? 0 : r.rota_relacionada - 1
          if (r.tipo === 'V') {
            reg['exclusivo'] = true
          } else {
            reg['exclusivo'] = false
          }

          if (_tipo === 'O') {
            reg['origem'] = {cidade: r.cidade, uf: r.uf}
            _tipo = 'D'
          } else {
            reg['destino'] = {cidade: r.cidade, uf: r.uf}
          }

          if (cont > 0) {
            rtSeg.push(reg)
            cont = 0
            reg = {
              origem: '',
              destino: ''
            }

            if (r.rota_relacionada +1 < rotas.length) {
              reg['origem'] = {cidade: r.cidade, uf: r.uf}
            } 
            
          } else {
            if (r.rota_relacionada +1 === rotas.length) {
              rtSeg.push(reg)
            }

            cont++
          }
        })
        
        let ValoresRotas = []
        
        rtSeg.forEach(r => {

          RotaDesc = `${r.origem.cidade}/${r.origem.uf} X ${r.destino.cidade}/${r.destino.uf}`
          // Busca os valores dos seguros para rotas
          const buscavalseg = async (uf_origem, uf_destino) => {
            const query = Seguro.query()
                  query.where('uf', uf_origem)
  
            const seguro = await query.fetch()
            const seg = JSON.parse(JSON.stringify(seguro))
            const val = (valor_veiculo * seg[0][uf_destino.toLowerCase()]) / 100
            
            return [{
              valor_veiculo,
              indice: seg[0][uf_destino.toLowerCase()],
              valor: val
            }]
          }
  
          const tab_seguro = buscavalseg(r.origem.uf, r.destino.uf)
          // const tabela_seguro = tab_seguro
          // const tabela_seguro = JSON.parse(JSON.stringify(tab_seguro))

          // const uf_destino = r.destino.uf
          // const tmp = tabela_seguro[0][uf_destino.toLowerCase()]

          valoresAgregados = tab_seguro[0]
          // valor_seguro_veiculo = (valor_veiculo * indice_seguro) / 100
  
          // valoresAgregados = {valor_seguro_veiculo, indice_seguro, valor_veiculo, origem: r.origem.uf, destino: r.destino.uf }

          /*
          seguros.forEach(seg => {

            let uf1 = seg.uf
            let uf2 = r.origem.uf
                
            if (uf1.toLowerCase() === uf2.toLowerCase()) {
              valor_seguro_veiculo += (valor_veiculo * seg[r.destino.uf.toLowerCase()]) / 100
            }
          })

          // Busca o valor adicional para Rota
          if (r.exclusivo === true) { // Rota exclusiva - valor por km
            valor_rotas_veiculo += distancia[r.rota].value * val_km
          } else {
            
            for (var i = 0; i < tabelaDeRotas.length; ++i) {
              const rot = tabelaDeRotas[i]

              let cidade_origem = rot.cidade_origem.toLowerCase()
              let cidade_destino = rot.cidade_destino.toLowerCase()
              let cid_origem = r.origem.cidade.toLowerCase()
              let cid_destino = r.destino.cidade.toLowerCase()

              cidade_origem = cidade_origem.normalize("NFD").replace(/[^a-zA-Zs]/g, "")
              cidade_destino = cidade_destino.normalize("NFD").replace(/[^a-zA-Zs]/g, "")
              cid_origem = cid_origem.normalize("NFD").replace(/[^a-zA-Zs]/g, "")
              cid_destino = cid_destino.normalize("NFD").replace(/[^a-zA-Zs]/g, "")

              if (
                cidade_origem === cid_origem &&
                rot.uf_origem.toLowerCase() === r.origem.uf.toLowerCase() &&
                cidade_destino === cid_destino &&
                rot.uf_destino.toLowerCase() === r.destino.uf.toLowerCase() &&
                rot.tipo_de_veiculo_id === tipoVei
              ) {
                ValoresRotas.push({
                  rota: RotaDesc,
                  valor_rota: rot.valor,
                })
    
                valor_rotas_veiculo += rot.valor
                rotaOk = true
                break
              } 
            }
          }
          */
        }) // rtSeg.forEach
        /*
        // console.table('**** PedidosModal.calculaValorPedido.ValoresRotas', ValoresRotas)

        let valor_seguro_roubo_veiculo = (valor_veiculo * 0.03) / 100
        
        let valor_bruto = valor_rotas_veiculo + valor_seguro_veiculo + valor_seguro_roubo_veiculo + valor_agregados_veiculo
        let valor_desconto_veiculo = 0
        
        if (percentual_desconto_pedido > 0) {
          valor_desconto_veiculo = (valor_bruto * percentual_desconto_pedido) / 100
        } 
        
        if (valor_desconto_pedido > 0) {
          valor_desconto_veiculo = valor_bruto - (valor_desconto_pedido / veiculos.length)
        }

        let valor_imposto_veiculo = (valor_bruto - valor_desconto_veiculo) * (percentual_imposto - 1)
        let valor_total_veiculo = (valor_bruto - valor_desconto_veiculo) + valor_imposto_veiculo
        
        // Salvar na tabela 'valores_do_pedido' (por veiculo)
        valores.push({
          placa: vei.placachassi,
          percentual_imposto,
          percentual_desconto: percentual_desconto_pedido,
          valor_veiculo,
          valor_rotas_veiculo,
          valor_seguro_veiculo,
          valor_seguro_roubo_veiculo,
          valor_agregados_veiculo,
          valor_desconto_veiculo,
          valor_imposto_veiculo,
          valor_total_veiculo,
        })

        // valor_total_pedido += valor_veiculo
        valor_total_veiculos_pedido += valor_veiculo
        valor_rotas_pedido += valor_rotas_veiculo
        valor_seguro_pedido += valor_seguro_veiculo
        valor_seguro_roubo_pedido += valor_seguro_roubo_veiculo
        valor_agregados_pedido += valor_agregados_veiculo
        // valor_imposto_pedido += valor_imposto_veiculo

        */
      })

      /*
      let valor_bruto_pedido = valor_rotas_pedido + valor_seguro_pedido + valor_seguro_roubo_pedido + valor_agregados_pedido
      
      // Calculo do valor sem desconto
      let valor_total_pedido_sem_desconto = valor_bruto_pedido * percentual_imposto
      
      // Calculo do valor com desconto aplicado
      let valor_total_desconto_pedido = 0
      if (percentual_desconto_pedido > 0) {
        valor_total_desconto_pedido = (valor_bruto_pedido * percentual_desconto_pedido) / 100
      } else if (valor_desconto_pedido > 0) {
        valor_total_desconto_pedido = parseFloat(valor_desconto_pedido)
      }
      valor_imposto_pedido = (valor_bruto_pedido - valor_total_desconto_pedido) * (percentual_imposto - 1)
      valor_total_pedido = (valor_bruto_pedido - valor_total_desconto_pedido) + valor_imposto_pedido

      if (!rotaOk) {
        let msg = `A rota [${RotaDesc}] não foi localizada na tabela de rotas patio a patio, ` +
                  `por favor verifique as rotas cadastradas para que possam ser efetuados os cálculos de valores`
        toast(msg, { 
          type: 'info',
          autoClose: 7000, 
          closeOnClick: true,
          pauseOnHover: true,
        })
        return
      } 

      let val = valor_total_pedido.toFixed(2)
      val = val.replace(',', '.')
      val = val.replace('.', ',')
      window.setFormValue('valor', val)

      // console.table('**** PedidosModal.calculaValorPedido.percentual_desconto_pedido', percentual_desconto_pedido > 0, valor_total_desconto_pedido.toFixed(2))
      if (percentual_desconto_pedido > 0) {
        window.setFormValue('valor_desconto', 0)
        // window.setFormValue('valor_desconto', valor_total_desconto_pedido.toFixed(2))
      }

      if (percentual_desconto_pedido === 0 && valor_desconto_pedido > 0) {
        let percentual_aplicado = ((valor_total_pedido_sem_desconto - valor_total_pedido) / valor_total_pedido_sem_desconto) * 100
        percentual_desconto_pedido = percentual_aplicado.toFixed(0)
        window.setFormValue('percentual_desconto', 0)
        // window.setFormValue('percentual_desconto', percentual_desconto_pedido)
      }

      console.log('**** PedidosModal.calculaValorPedido', {
        valor_veiculos: valor_total_veiculos_pedido.toFixed(2),
        valor_transporte_rotas: valor_rotas_pedido.toFixed(2),
        valor_do_seguro: valor_seguro_pedido.toFixed(2),
        valor_do_seguro_roubo: valor_seguro_roubo_pedido.toFixed(2),
        valor_custo_operacional: valor_agregados_pedido.toFixed(2),
        valor_impostos: valor_imposto_pedido.toFixed(2),
        percentual_desconto_pedido: percentual_desconto_pedido,
        valor_desconto_pedido: valor_total_desconto_pedido.toFixed(2),
        valor_total_pedido: valor_total_pedido.toFixed(2),
        valor_total_pedido_sem_desconto: valor_total_pedido_sem_desconto.toFixed(2),
      })
      */
      
      return valoresAgregados
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado ${e}`
      })
    }

  }

  /**
   * Create/save a new pedidosvalore.
   * POST pedidosvalores
   */
  async store({ auth, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const data = request.only([
      "pedido_id", 
      "cliente_id",
      "veiculos",
      "transporte_rotas",
      "seguro",
      "seguro_roubo",
      "custo_operacional",
      "impostos",
      "percentual_desconto",
      "desconto",
      "total",
      "total_sem_desconto",
    ])

    const pedidosvalores = await Pedido.create(data)
    return pedidosvalores
  }

  /**
   * Display a single pedidosvalore.
   * GET pedidosvalores/:id
   */
  async show({ auth, params, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {  
      const pedidosvalores = await Pedido.findOrFail(params.id)
      return pedidosvalores
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Update pedidosvalore details.
   * PUT or PATCH pedidosvalores/:id
   */
  async update({ auth, params, request, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    const pedidosvalores = await Pedido.findOrFail(params.id);
    const data = request.only([
      "pedido_id", 
      "cliente_id",
      "veiculos",
      "transporte_rotas",
      "seguro",
      "seguro_roubo",
      "custo_operacional",
      "impostos",
      "percentual_desconto",
      "desconto",
      "total",
      "total_sem_desconto",
    ])

    try {
      pedidosvalores.merge(data)
      await pedidosvalores.save()
      return pedidosvalores
    }
    catch(e) {
      return response.status(404).send({
        status: 404,
        message: `Nenhum registro encontrado`
      })
    }

  }

  /**
   * Delete a pedidosvalore with id.
   * DELETE pedidosvalores/:id
   */
  async destroy({ params, auth, response }) {
    const usuarios = await Usuario.findOrFail(auth.user.id)
    if (usuarios.tipo !== 'O') {
      return response.status(401).send({ 
        error: `Não autorizado [${usuarios.tipo}]`
      })
    }
  
    try {
      const pedidosvalores = await Pedido.findOrFail(params.id)
      await pedidosvalores.delete()
      return response.status(200).send({
        status: 200,
        message: `Registro excluído com sucesso`
      })
    } catch (e) {
      return response.status(404).send({
        status: 404,
        message: `O registro não existe`
      })
    }
  }
}

module.exports = PedidosValoreController
