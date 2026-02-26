export interface Paziente {
  id: string; // identificativo univoco del paziente
  nome: string; // nome del paziente
  cognome: string; //  cognome del paziente
  braccialetto: string; //  codice del braccialetto
  eta: number; //calcolata a partire da dataNascita
  codiceColore: string; //rosso, arancione, azzurro, verde, bianco
  note: string; //notetriage
  patologia: string; //patologiaCode
}

export interface PazienteDTO {
  id: number
  braccialetto: string
  dataOraIngresso: string
  stato: string
  noteTriage: string
  patologiaCode: string
  nome: string
  cognome: string
  dataNascita: string
  codiceFiscale: string
  patologiaDescrizione: string
  coloreCode: string
  coloreHex: string
  coloreNome: string
  modalitaArrivoCode: string
  modalitaArrivoDescrizione: string
}
