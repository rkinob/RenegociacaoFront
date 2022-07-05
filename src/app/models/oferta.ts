import { Contrato } from "./contrato";

export class Oferta {
  idOferta: string;
  valor: number;
  valorOferta: number;
  dataVencimento: Date;
  idCliente: string;
  contratos: Contrato[];
}
