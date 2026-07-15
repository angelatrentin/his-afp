# Migrazione Architetturale HIS-AFP

## Architettura Prima della Migrazione

L'infrastruttura originale utilizzava una rete "piatta": tutti i container (frontend, backend, database) condividevano lo stesso spazio di rete Docker. Questo significa che un attaccante che compromettesse un container frontend avrebbe accesso diretto al database con i dati sensibili dei pazienti.

<pre>
[fe-prod] ─┐
[fe-test] ──┼── rete unica ── [backend] ── [db]
[fe-sio]  ─┘
[gateway] ─┘
</pre>

## Architettura Dopo la Migrazione

L'infrastruttura è stata trasformata in un'architettura **Multi-Tier** a compartimenti stagni, con due reti Docker separate:

- **fe-net**: contiene esclusivamente i container frontend
- **backend-net**: contiene backend e database

Il Gateway è l'**unico componente ponte** tra le due reti, agendo da singolo punto di controllo per tutto il traffico.

<pre>
fe-net:                    backend-net:
[fe-prod] ─┐               ┌─ [backend] ── [db]
[fe-test] ──┼── [gateway] ─┤
[fe-sio]  ─┘               └─ (db non raggiungibile da fe-net)
</pre>

## Perché Abbiamo Eseguito la Migrazione

1. **Sicurezza dei dati sanitari**: i dati dei pazienti sono dati sensibili soggetti al GDPR. Un'architettura piatta non supererebbe mai un audit di sicurezza per l'accreditamento sanitario regionale.
2. **Principio del minimo privilegio**: ogni container accede solo alle risorse strettamente necessarie. I frontend non hanno mai bisogno di parlare direttamente col database.
3. **Contenimento delle intrusioni**: se un frontend venisse compromesso, l'attaccante non potrebbe raggiungere il database perché la comunicazione è interrotta a livello di protocollo di rete.

## Configurazione Implementata

### Reti Docker

| Rete | Driver |
|------|--------|
| fe-net | bridge |
| backend-net | bridge |

### Segregazione dei servizi

| Container | Rete |
|-----------|------|
| fe-prod, fe-test, fe-sio | fe-net |
| backend | backend-net |
| db | backend-net |
| gateway | fe-net + backend-net |

### Hardening

La porta 5432 del database non è esposta verso l'host esterno. Solo il backend può interrogare il database dall'interno di backend-net.

## Test di Validazione

### Prerequisiti

```bash
cp .env.example .env
echo 'PROD_VERSION=1.0.0' > .env
echo 'TEST_VERSION=1.0.0' >> .env
echo 'SVI_VERSION=1.0.0' >> .env
docker-compose up -d --build
```

### Test 1 — Isolamento rete (deve FALLIRE)

```bash
docker exec sio-fe-prod ping -c 1 db
# Risultato atteso: ping: bad address 'db' ✓
```

### Test 2 — Gateway raggiungibile (deve PASSARE)

```bash
curl http://localhost/api/health
# Risultato atteso: {"status":"success","data":{"service":"UP",...}}
```

### Test 3 — Backend raggiunge il db (deve PASSARE)

```bash
docker exec sio-backend ping -c 1 db
# Risultato atteso: risposta positiva ✓
```

## Limiti e Miglioramenti Possibili

### Limiti rilevati

1. **Nessun rate limiting** sul gateway: rischio brute-force sulle API.
2. **Variabili d'ambiente in chiaro** nel docker-compose.yml: in produzione andrebbero gestite con Docker Secrets o HashiCorp Vault.
3. **Single point of failure**: se il gateway cade, l'intero sistema è irraggiungibile.

### Evoluzioni proposte

- **Kubernetes + Ingress Controller**: network policies native più granulari, con supporto a Traefik o NGINX Ingress.
- **Traefik come gateway**: service discovery automatico e riconfigurazione dinamica senza restart.
- **Feature Flags dinamici**: gestione del comportamento a runtime senza rebuild dei container (es. Unleash, LaunchDarkly).