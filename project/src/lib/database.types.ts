export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Creator: {
        Row: {
          id: string
          nome: string
          cognome: string
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          cognome: string
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          cognome?: string
          created_at?: string
        }
      }
      Operatori: {
        Row: {
          id: string
          nome: string
          cognome: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          cognome: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          cognome?: string
          email?: string
          created_at?: string
        }
      }
      Responsabili: {
        Row: {
          id: string
          nome: string
          cognome: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          cognome: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          cognome?: string
          email?: string
          created_at?: string
        }
      }
      responsabili_operatori: {
        Row: {
          id: string
          id_operatore: string
          id_responsabile: string
          created_at: string
        }
        Insert: {
          id?: string
          id_operatore: string
          id_responsabile: string
          created_at?: string
        }
        Update: {
          id?: string
          id_operatore?: string
          id_responsabile?: string
          created_at?: string
        }
      }
      disponibilita: {
        Row: {
          id: string
          data_prenotazione: string
          data_disponibilita: string
          fascia_03_07: string
          fascia_07_12: string
          fascia_12_17: string
          fascia_17_22: string
          fascia_22_03: string
          id_operatore_responsabile: string
          id_creator: string
          created_at: string
        }
        Insert: {
          id?: string
          data_prenotazione: string
          data_disponibilita: string
          fascia_03_07: string
          fascia_07_12: string
          fascia_12_17: string
          fascia_17_22: string
          fascia_22_03: string
          id_operatore_responsabile: string
          id_creator: string
          created_at?: string
        }
        Update: {
          id?: string
          data_prenotazione?: string
          data_disponibilita?: string
          fascia_03_07?: string
          fascia_07_12?: string
          fascia_12_17?: string
          fascia_17_22?: string
          fascia_22_03?: string
          id_operatore_responsabile?: string
          id_creator?: string
          created_at?: string
        }
      }
      incassi_per_turni: {
        Row: {
          id: string
          incasso: number
          id_disponibilita: string
          created_at: string
        }
        Insert: {
          id?: string
          incasso: number
          id_disponibilita: string
          created_at?: string
        }
        Update: {
          id?: string
          incasso?: number
          id_disponibilita?: string
          created_at?: string
        }
      }
      utenti: {
        Row: {
          id: string
          nickname_utente: string
          id_univoco_of: string
          created_at: string
        }
        Insert: {
          id?: string
          nickname_utente: string
          id_univoco_of: string
          created_at?: string
        }
        Update: {
          id?: string
          nickname_utente?: string
          id_univoco_of?: string
          created_at?: string
        }
      }
      note_utente: {
        Row: {
          id: string
          nota: string
          id_utente: string
          created_at: string
        }
        Insert: {
          id?: string
          nota: string
          id_utente: string
          created_at?: string
        }
        Update: {
          id?: string
          nota?: string
          id_utente?: string
          created_at?: string
        }
      }
      richieste: {
        Row: {
          id: string
          tipo_richiesta: number
          note_richiesta: string
          importo: number
          stato_richiesta: string
          data_consegna_prevista: string
          data_consegna_effettiva: string | null
          note_su_consegna: string | null
          id_operatore_responsabile: string
          id_utente: string
          created_at: string
        }
        Insert: {
          id?: string
          tipo_richiesta: number
          note_richiesta: string
          importo: number
          stato_richiesta: string
          data_consegna_prevista: string
          data_consegna_effettiva?: string | null
          note_su_consegna?: string | null
          id_operatore_responsabile: string
          id_utente: string
          created_at?: string
        }
        Update: {
          id?: string
          tipo_richiesta?: number
          note_richiesta?: string
          importo?: number
          stato_richiesta?: string
          data_consegna_prevista?: string
          data_consegna_effettiva?: string | null
          note_su_consegna?: string | null
          id_operatore_responsabile?: string
          id_utente?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}