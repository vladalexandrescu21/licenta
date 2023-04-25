Pentru crearea containerului bazei de date postgre in docker rulati fisierul docker-compose.yml din Server/docker/

Pentru instalarea modulelor necesare rulati comanda npm i in terminal in folderul server si in folderul client

Pentru pornirea serverului de back-end rulati in folderul server in terminal npm run back-start

Pentru pornirea serverului de client rulati in folderul client in terminal npm start

Functionalitatile implementate pana in prezent:

-login/register cu parola salavata in baza de date cu hashing

-paginii principale pentru contul de angajat si contul de sef de departament

-in pagina de angajat se poate utiliza butonul de creare cerere pentru a intra pe pagina de generare a cererii de concediu

-zilele de inceput si sfarsit a concediului pot fi selectate dintr-un calendar

-descarcare in PC-ul angajatului a cererii in format PDF pentru a fi semnata

-salvare a PDF-ului in format BLOB in baza de date

Functionalitati viitoare:

-posibilitatea de a vizualiza toate cererile (si statusurile acestora) create de un utilizator de tip angajat

-posibilitatea pentru un utilizator de tip sef de a vizualiza toate cererile create de angajatii departamentului sau

-utilizatorul de tip sef de departament poate aproba sau respinge cereriile de concediu

-calendarul in care se selectează zilele de inceput si sfarsit ale concediului va avea anumite zile care nu vor putea fi alese (in functie de o logica de ex. daca minim 2 angajati din acelasi departament au concediu intr-o anumita zi, un al treilea angajat nu isi poate lua concediu in ziua respectiva)

-inbunatatirea designului
