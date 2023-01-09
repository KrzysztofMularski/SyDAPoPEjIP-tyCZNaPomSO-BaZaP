# SyDAPoPEjIP-tyCZNaPomSO-BaZaP

## System Do Automatycznego Pomiaru Prędkości Ejekcji i Injekcji Płyty CD Z Natychmiastowym Pomiarem Szybkości Odczytu Baselinowej Zawartości Płyty

Setup:

```
git clone https://github.com/KrzysztofMularski/SyDAPoPEjIP-tyCZNaPomSO-BaZaP

cd ./SyDAPoPEjIP-tyCZNaPomSO-BaZaP

npm run setup

npm run dev
```

Jeszcze trzeba ręcznie skopiować plik `.env` znajdujący się w `resources/js/` i zamienić go na `.env-local` i wypełnić go kluczem z bazy Xata.

Aby generować automatycznie plik css po zmianach (najlepiej odpalić sobie w osobnym terminalu):

```
npm run css-watch
```

Aby zbudować .exe albo inne executables (będą w katalogu `/dist`):

```
npm run build
```
