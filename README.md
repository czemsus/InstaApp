# InstaApp

Prosta aplikacja społecznościowa do publikowania zdjęć, edycji profilu oraz
przeglądania i komentowania zdjęć. Projekt składa się z API w Node.js oraz
klienta Vue 3.

## Wymagania

- Node.js (zalecana wersja LTS) i npm
- PostgreSQL
- Klucz API Resend, jeśli rejestracja ma wysyłać e-maile z potwierdzeniem konta

## Konfiguracja bazy danych

Utwórz bazę PostgreSQL, na przykład:

```sql
CREATE DATABASE instaapp;
```

Serwer tworzy tabele automatycznie przy uruchomieniu. W `InstaAppServer/.env`
ustaw dane połączenia i sekret JWT:

```env
DATABASE_URL=postgresql://postgres:twoje_haslo@localhost:5432/instaapp
SECRET_KEY=wstaw_tutaj_dlugi_losowy_sekret
RESEND_API_KEY=wstaw_klucz_resend
PORT=3000
API_BASE_URL=http://localhost:3000
```

`DATABASE_URL` i `SECRET_KEY` są wymagane. `RESEND_API_KEY` jest potrzebny do
wysyłania e-maili potwierdzających rejestrację. `PORT` i `API_BASE_URL` są
opcjonalne; podane wartości odpowiadają domyślnemu lokalnemu uruchomieniu.
Nie publikuj pliku `.env` ani prawdziwych kluczy.

Jeśli hasło do bazy zawiera znaki specjalne, zakoduj je zgodnie z formatem URL.

## Potwierdzanie konta i Resend

Resend może ograniczać wysyłkę e-maili w trybie testowym, m.in. do zweryfikowanych
adresów. Jeśli wiadomość potwierdzająca nie dociera, możesz ręcznie potwierdzić
konto w bazie PostgreSQL. Połącz się z bazą skonfigurowaną w `DATABASE_URL` i
wykonaj polecenie, zastępując adres adresem użytym podczas rejestracji:

```sql
UPDATE users SET confirmed = true WHERE mail = 'twoj_mail';
```

W środowisku produkcyjnym skonfiguruj i zweryfikuj własną domenę nadawcy w
Resend, zamiast polegać na ręcznym potwierdzaniu kont.

## Instalacja

Otwórz terminal w katalogu projektu. Zainstaluj zależności serwera:

```powershell
cd InstaAppServer
npm ci
```

W drugim terminalu zainstaluj zależności klienta:

```powershell
cd InstaAppClient
npm ci
```

## Uruchomienie lokalne

Uruchom API w pierwszym terminalu:

```powershell
cd InstaAppServer
npm start
```

Serwer domyślnie działa pod adresem `http://localhost:3000`.

Uruchom klienta w drugim terminalu:

```powershell
cd InstaAppClient
npm run dev
```

Otwórz adres wyświetlony przez Vite, domyślnie `http://localhost:5173`.
Klient domyślnie łączy się z API pod `http://localhost:3000`. Aby zmienić ten
adres, utwórz `InstaAppClient/.env.local` i ustaw:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Po zmianie zmiennych środowiskowych uruchom ponownie odpowiedni proces.

## Build klienta

```powershell
cd InstaAppClient
npm run build
```

Gotowe pliki statyczne znajdą się w `InstaAppClient/dist`.

## Dane i pliki

Zdjęcia przesłane do aplikacji oraz pliki profili są przechowywane w
`InstaAppServer/uploads`. Baza danych przechowuje m.in. użytkowników, zdjęcia,
polubienia i komentarze. Nie usuwaj katalogu `uploads`, jeśli chcesz zachować
przesłane pliki.