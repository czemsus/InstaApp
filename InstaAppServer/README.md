# Serwer InstaApp

Instrukcja konfiguracji bazy danych, zmiennych środowiskowych, instalacji
zależności i uruchomienia całej aplikacji znajduje się w głównym
[README](../README.md).

W skrócie: utwórz plik `.env` w tym katalogu, ustaw `DATABASE_URL` oraz
`SECRET_KEY`, a następnie uruchom:

```powershell
npm ci
npm start
```

API domyślnie nasłuchuje na porcie `3000`.
