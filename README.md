# React-Native-Video-Player-App
Minimalistyczna aplikacja mobilna (iOS/Android) stworzona przy użyciu React Native (Expo), symulująca interfejs YouTube. Projekt wykorzystuje bibliotekę react-native-video do odtwarzania wideo z lokalnych zasobów oraz Redux Toolkit Query (RTK Query) do asynchronicznego pobierania metadanych wideo z YouTube Data API.

# Instrukcja uruchomienia 

```bash
# Klonowanie repozytorium
git clone
cd video-app

# Instalacja zależności
npm install
# lub
yarn install
```

# konfiguracja środowiska

1. Utwórz plik .env w katalogu głównym projektu
2. Umieść w nim swój klucz YoutubeAPI 
3. Uruchom aplikacja komendą 
```bash
npx expo start
```

# Uwaga w przypadku nie odczytywanie YOUTUBE_API_KEY, należy go wkleić bezpośrednio do pliku youtubeApi.ts