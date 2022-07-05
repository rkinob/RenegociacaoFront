import { Cliente } from "src/app/models/cliente";
import { Contrato } from "src/app/models/contrato";
import { Oferta } from "src/app/models/oferta";

export class RenegociacaoDadosTestes {

  public static randomIntFromInterval(min: number, max: number):number { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  public static GerarContratos(): Contrato[] {
      let contratos: Contrato[] = [];
      for (var i = 0; i < 10; i++) {
          contratos.push(
              {
                  idContrato: i.toString(),
                  idAgrupamento: i%2==0? 1:2,
                  numero: "" + Math.random().toString(),
                  descricao: "Divida " + i.toString(),
                  valor: this.randomIntFromInterval(100, 1000),
                  dataVencimento: new Date(),
                  idCliente: "",
                  cliente: new Cliente()
              });
      }
      return contratos;
  }

  public static GerarOfertas(contratos: Contrato[]): Oferta[] {
    const agrupamentos = [...new Set(contratos.map(item => item.idAgrupamento))]; // [ 'A', 'B']

      let ofertas: Oferta[] = [];
      for (var i = 0; i < agrupamentos.length; i++) {
        var contratosParaAOferta = contratos.filter(item => item.idAgrupamento == agrupamentos[i]);
        var valorTotal = contratosParaAOferta.reduce((acc, item) => acc + item.valor, 0);

        let oferta = {
          idOferta: Math.random().toString(),
          valor: valorTotal,
          valorOferta: RenegociacaoDadosTestes.randomIntFromInterval(100, 1000),
          dataVencimento: new Date(),
          idCliente: "",
          contratos: contratosParaAOferta
        };
        oferta.valorOferta = oferta.valor - (0.25 * oferta.valor);
          ofertas.push(oferta);
      }
      return ofertas;
  }
}
