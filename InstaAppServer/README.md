# InstaApp

## Przesłane pliki

Nie usuwaj katalogów `uploads` przy każdym uruchomieniu. Są w nich zdjęcia użytkowników, a Git ignoruje już nowe pliki w tym katalogu. Wersjonowany plik `uploads/pfp.png` pozostaje potrzebny jako domyślne zdjęcie profilowe.

Serwer przechowuje dane kont i listę postów tylko w pamięci, więc po restarcie Node pliki nadal będą na dysku, ale konta i powiązania zdjęć z postami znikną. Do zachowania danych między uruchomieniami potrzebna jest baza danych.