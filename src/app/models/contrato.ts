import { Cliente } from "./cliente";

export class Contrato {
  idContrato: string;
  idAgrupamento: number;
  numero: string;
  descricao: string;
  valor: number;
  dataVencimento: Date;
  idCliente: string;
  cliente: Cliente;

}
