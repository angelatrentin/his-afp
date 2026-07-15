# Blue/Green Deployment e Tunnel Database HIS-AFP

## Task 2 — Il "Cambio di Binario" delle API (Blue/Green Deploy)

### Contesto

Il backend è attualmente un "punto di fallimento singolo": ogni aggiornamento
richiede un riavvio con conseguente downtime delle API.

### Soluzione implementata

Sono stati definiti due servizi backend nel `docker-compose.yml`:

- **sio-backend-blue**: versione stabile, sempre attiva
- **sio-backend-green**: nuova versione, commentata di default

Entrambi condividono lo stesso database `db` nella rete `backend-net`.

### Come eseguire il cambio di binario (Blue → Green)

**Step 1**: Decommentare `sio-backend-green` in `docker-compose.yml`

**Step 2**: Avviare solo il container green senza fermare il blue

```bash
docker-compose up -d sio-backend-green
```

**Step 3**: Modificare `gateway/default.conf` — cambiare in tutti e tre i blocchi server:

```nginx
# DA:
proxy_pass http://sio-backend-blue:3000;

# A:
proxy_pass http://sio-backend-green:3000;
```

**Step 4**: Ricaricare la configurazione NGINX senza downtime

```bash
docker exec sio-gateway nginx -s reload
```

Il traffico viene ora instradato verso green. Blue rimane attivo per rollback immediato.

### Procedura di Rollback

In caso di bug nella versione green, il rollback è istantaneo:

**Step 1**: Ripristinare `proxy_pass http://sio-backend-blue:3000` in `default.conf`

**Step 2**: Ricaricare NGINX

```bash
docker exec sio-gateway nginx -s reload
```

**Step 3**: Fermare e rimuovere il container green

```bash
docker-compose stop sio-backend-green
```

Il sistema torna immediatamente alla versione blue senza alcun downtime.

### Riflessione: cosa succede ai dati scritti da Green?

Se la versione green ha scritto dati nel database prima del rollback, quei
dati **rimangono nel database**. Questo è il "dilemma del database" nel
Blue/Green deployment:

- Se green ha aggiunto nuove colonne → blue potrebbe non saperle gestire
- Se green ha modificato dati esistenti → blue li vedrà comunque

La soluzione è descritta nella Task 3.

---

## Task 3 — Zero-Downtime e Database Migration

### Il dilemma del Database

Quando green richiede una modifica allo schema del database (es. nuova colonna
obbligatoria), blue è ancora attivo e non conosce quella colonna.

### Strategia: Migrazioni Additive

La regola fondamentale è: **mai modificare, solo aggiungere**.

| Operazione | Sicura | Motivazione |
|------------|--------|-------------|
| Aggiungere colonna nullable | ✅ | Blue la ignora, Green la usa |
| Aggiungere colonna con default | ✅ | Blue scrive il default, Green la gestisce |
| Rinominare colonna | ❌ | Blue usa il vecchio nome → errore |
| Eliminare colonna | ❌ | Blue la cerca → errore |
| Cambiare tipo colonna | ❌ | Incompatibilità immediata |

### Esempio pratico

```sql
-- CORRETTO: aggiunta additiva, compatibile con Blue
ALTER TABLE pazienti ADD COLUMN telefono VARCHAR(20) DEFAULT NULL;

-- SBAGLIATO: rompe Blue immediatamente
ALTER TABLE pazienti RENAME COLUMN cf TO codice_fiscale;
```

### Impact sul Frontend

Il frontend **non deve essere ricaricato** durante lo switch Blue/Green,
perché il gateway cambia solo il backend di destinazione, non il frontend.

Le sessioni JWT degli utenti rimangono valide purché entrambe le versioni
condividano lo stesso `JWT_SECRET` (come nella nostra configurazione).

### Configurazione Docker per condivisione DB senza conflitti di porta

Entrambi i backend condividono lo stesso servizio `db` nella rete `backend-net`
senza esporre porte verso l'host:

```yaml
sio-backend-blue:
  networks:
    - backend-net

sio-backend-green:
  networks:
    - backend-net

db:
  networks:
    - backend-net
  # Nessuna sezione "ports" → non accessibile dall'esterno
```

---

## Task 4 — Tunnel TCP per il Database via Gateway

### Contesto

Il team di Data Analysis necessita di accedere al database con strumenti
come DBeaver o TablePlus. La porta 5432 non è esposta direttamente dal
container `db` per policy di sicurezza.

### Soluzione: NGINX Stream Module

Il gateway agisce da tunnel TCP trasparente usando il modulo `stream` di NGINX,
configurato in `gateway/nginx.conf`:

```nginx
stream {
    upstream sio-db {
        server db:5432;
    }
    server {
        listen 5432 so_keepalive=on;
        proxy_pass sio-db;
    }
}
```

### Perché il modulo stream e non un blocco server HTTP?

Il database PostgreSQL comunica tramite **protocollo TCP binario**, non HTTP.
Il modulo `stream` di NGINX lavora a livello TCP/UDP (Layer 4), mentre
i blocchi `server` nella porta 80/8080/8999 lavorano a livello HTTP (Layer 7).
Inserire il tunnel nel blocco HTTP causerebbe errori di protocollo.

### Come connettersi al database tramite gateway

Configurare il proprio client (DBeaver, TablePlus, psql) con:

| Campo | Valore |
|-------|--------|
| Host | localhost |
| Port | 5432 |
| Database | sio_db |
| Username | sio_user |
| Password | sio_password |

Il traffico arriva al gateway sulla porta 5432 e viene inoltrato
trasparentemente al container `db` nella rete `backend-net`.

### Test di validazione

```bash
# Da host locale, verifica che il tunnel funzioni
psql -h localhost -p 5432 -U sio_user -d sio_db -c "\dt"
# Risultato atteso: lista delle tabelle ✓
```

### Vantaggi di questo approccio

- **Unico punto di ingresso**: per bloccare l'accesso al DB basta commentare
  il blocco `stream` in `nginx.conf` e ricaricare NGINX, senza riavviare il database.
- **Audit centralizzato**: tutti gli accessi al DB passano dal gateway e
  possono essere loggati.
- **Sicurezza**: il container `db` non espone porte verso l'host, è
  raggiungibile solo tramite il gateway controllato.