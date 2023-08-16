# Markeer (stewardapp)

Een applicatie die is bedoeld om inspecties en onderhoud te stroomlijnen voor stewards. Deze app stelt gebruikers in staat om check-ups bij te houden en te beheren, markers te monitoren en uitgebreide rapporten te genereren voor diverse waterwerkingen.

## Inleiding

Markeer stelt vrijwilligers in staat om de waterwerkingen te monitoren en te handhaven in verschillende waterlichamen, zoals meren, rivieren en beken.

## Features

- Registratie van check-ups, inclusief datum, locatie en informatie over de verantwoordelijke partij.
- Registratie en bijhouden van specifieke markers die verband houden met codes.
- Generatie van gedetailleerde rapporten met samenvattingen van check-up resultaten.
- Filteren en visualiseren van gegevens op basis van datum, locatie.
- Gebruikersauthenticatie en toegangsbeheer op basis van rollen voor beheerders en stewards.

## Aan de Slag

Volg deze stappen om Markeer lokaal in te stellen:

### Vereisten

- Node.js en npm geïnstalleerd op jouw systeem.
- Een Firebase-account voor gegevensopslag en authenticatie.

### Installatie

1. Kloon de repository:

```bash
git clone 
cd markeer
```

2. Installeer de packages:

```bash
npm install
```

3. Configureer de Firebase-instellingen:

Maak een `.env`-bestand in de root aan en voeg jouw Firebase-configuratie toe:

```plaintext
VUE_APP_FIREBASE_API_KEY=api-key
VUE_APP_FIREBASE_AUTH_DOMAIN=auth-domain
VUE_APP_FIREBASE_PROJECT_ID=project-id
VUE_APP_FIREBASE_STORAGE_BUCKET=storage-bucket
VUE_APP_FIREBASE_MESSAGING_SENDER_ID=sender-id
VUE_APP_FIREBASE_APP_ID=app-id
```

## Gebruik

1. Registreer en log in om toegang te krijgen tot de app.
2. Start een inspectie rondom jouw aangewezen waterwerking.
3. Bekijk, filter en analyseer gegevens op het dashboard.
4. Genereer rapporten met uitgebreide inzichten uit de evaluaties.

## Technologieën

- Vue.js: Frontend-framework voor het bojouwen van gebruikersinterfaces.
- Firebase: Backend-as-a-Service-platform voor authenticatie en gegevensopslag.
- Mapbox: Mapping-platform voor het visualiseren van geografische gegevens.

## Dankwoord

---
Rien Pieters
