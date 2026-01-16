# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## InPost Integration

### Environment variables
Configure the following variables in Supabase Edge Functions (and your local `.env` if you use `supabase start`):

```
INPOST_API_URL=https://api-shipx-pl.easypack24.net/v1
INPOST_TOKEN=your_inpost_token
INPOST_ORG_ID=your_org_id_optional
INPOST_SENDER_NAME=ServiceLab
INPOST_SENDER_PHONE=+48123123123
INPOST_SENDER_EMAIL=kontakt@servicelab.pl
INPOST_SENDER_ADDRESS_LINE1=ul. Serwisowa 15
INPOST_SENDER_ADDRESS_LINE2=
INPOST_SENDER_POSTAL_CODE=00-001
INPOST_SENDER_CITY=Warszawa
INPOST_SENDER_COUNTRY=PL
INPOST_DEFAULT_WEIGHT=1
INPOST_DEFAULT_LENGTH=10
INPOST_DEFAULT_WIDTH=10
INPOST_DEFAULT_HEIGHT=10
INPOST_WEBHOOK_SECRET=optional_hmac_secret
MOCK_INPOST=true
```

Supabase service role is required for the Edge Functions that write to DB/storage:

```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Local run

```
npm install
npm run dev

# Supabase (local dev)
supabase start
supabase functions serve
supabase db push
```

### Test endpoints

```
supabase functions invoke inpost-methods --method GET
supabase functions invoke inpost-points --method GET --query "query=Warszawa"
```

### Definition of Done (manual QA)

- Wybor metody dostawy pokazuje pelne nazwy uslug, cene i ETA; "Paczka w Weekend" jest na gorze.
- Po wyborze dostawy do punktu otwiera sie modal z mapa i lista punktow.
- Wyszukiwarka dziala (debounce), filtry Paczkomat/PaczkoPunkt dzialaja.
- Wybrany punkt zapisuje sie w localStorage i (jesli zalogowany) w profilu uzytkownika.
- Bez wybranego punktu lub adresu kuriera nie mozna przejsc dalej.
- Utworzenie zgloszenia tworzy przesylke InPost i zapisuje ja w tabeli `shipments`.
- Etykieta jest dostepna przez endpoint `inpost-label` i zapisywana w storage.
- Tracking i webhook aktualizuja status w `shipments` oraz zapisuja `shipment_events`.
