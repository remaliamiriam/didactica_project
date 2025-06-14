# Didactica Project

**Didactica Project** este o aplicație educațională interactivă creată cu **React**, care ajută utilizatorii să parcurgă etape pentru elaborarea și evaluarea testelor de cunoștințe.  

⚠️ *Proiectul este în dezvoltare activă — anumite componente există dar nu sunt încă utilizate.*

---

## Funcționalități

- Navigare ghidată prin 7 etape (teorie + quiz pentru fiecare)
- Animații și tranziții fluide (Framer Motion)
- Confetti la finalizarea tuturor etapelor
- Salvare progres local (localStorage)
- Design modern cu efect **glassmorphism**

---

## Stack tehnologic

- [React](https://react.dev)
- [React Router](https://reactrouter.com)
- [React Bootstrap](https://react-bootstrap.github.io/)
- [Framer Motion](https://www.framer.com/motion/)
- [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)

---

## Instalare locală

1. Clonează proiectul:
git clone https://github.com/remaliamiriam/didactica_project.git
cd didactica_project
2. Instalează dependențele:
npm install
3. Rulează aplicația:
npm start

Aplicația va fi disponibilă la http://localhost:3000.

##Contribuții
Contribuțiile sunt binevenite!

➡ Cum contribui:
Fork-uiți repository-ul
Creați un branch nou: git checkout -b feature-nume-funcționalitate
Faceți modificările și commit: git commit -m "Descriere clară a schimbării"
Push: git push origin feature-nume-funcționalitate
Deschideți un Pull Request

❗ Notă:
Proiectul este public, dar nimeni nu poate da push direct pe main — toate modificările sunt integrate prin Pull Request + review.
Vă rugăm să verificați dacă există un issue înainte de a începe lucrul sau să deschideți unul nou.

##⚠️ Stare actuală
✅ Etapele 1-7 (teorie + quiz) funcționale
⚠️ Pagina Resurse: în lucru
⚠️ Modul de creare test: în lucru
⚠️ Design mobil: optimizare în curs
⚠️ Unele fișiere componente există dar nu sunt încă integrate

##Structură proiect
src/
 ├── components/
 │    ├── Theory.jsx        # Conținut teorie
 │    ├── Quiz.jsx          # Componentă quiz
 │    └── (altele: planificat pentru viitor)
 ├── pages/
 │    ├── GuidePage.jsx     # Pagina ghid principal
 │    ├── StepPage.jsx      # Pagina etapă + quiz
 │    └── ...
 ├── App.js                 # Rutare și layout principal
 └── index.js               # Entry point

Roadmap
 Finalizare pagina Resurse
 Modul complet creare test
 Feedback și statistici utilizator
 Salvare progres server-side
 Optimizare pentru mobil și tablete
 Integrare autentificare (opțional)

Licență
Acest proiect este distribuit sub licența MIT. Vezi fișierul LICENSE pentru detalii.

## Mulțumim tuturor celor care aleg să contribuie! 
Orice feedback e binevenit — deschideți un issue sau un pull request!
