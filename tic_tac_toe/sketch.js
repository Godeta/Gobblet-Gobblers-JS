let plateau, tailleCase, tailleFen;
let joueurTour;
let finPartie;
//compte le nombre de pièces posées sur une case
let compte;
let vainqueur;
let boutton;
//partie indiquant le tour du joueur
let infoJoueur;
//selecteur de mode
let selectMode;
let mode = "PvP";
let textMode;

function setup() {
  tailleFen = 400;
  tailleCase = tailleFen / 3;
  createCanvas(tailleFen, tailleFen);
  recommencer(); // état initial de la partie

  //boutton pour recommencer la partie
  bouttonSetup(550, 500, 300, 60);
  //paragraphe pour les infos du joueur dont c'est le tour de jouer
  infoJoueur = createP();
  infoJoueur.position(550, 400);
  infoJoueur.style('font-size', '200%');
  //choisir le mode
  selectMode = createSelect();
  selectMode.position(550, 630);
  selectMode.option('PvP');
  selectMode.option('IA random');
  selectMode.option('IA minmax');
  selectMode.changed(mySelectEvent); //si on change de valeur alors ça lance la fonction mySelectEvent
  //paragraphe pour afficher le mode actuel
  textMode = createP();
  textMode.position(550, 600);
  textMode.style('font-size', '100%');

}

function bouttonSetup(x, y, w, h) {
  boutton = createButton('recommencer');
  boutton.position(x, y);
  boutton.size(w, h);
  boutton.style('font-size', '250%');
  boutton.mouseReleased(recommencer);
}

function recommencer() {
  plateau = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  compte = 0;
  //tour du joueur 1
  joueurTour = true;
  finPartie = false;
}

function draw() {
  background(51, 40, 255);
  plateauAff();
  texteMode();

  if (finPartie) { // si la partie est finie
    if (compte === 9) { // vérifie si toutes les cases sont remplies et affiche égalité si c'est le cas
      textAlign(CENTER, CENTER);
      textSize(64);
      fill(255);
      stroke(51);
      strokeWeight(3);
      text("Egalité !", width / 2, height / 2);
      infoJoueur.html("Egalité");
      return;
    }
    ligneVictoire();
  }
}

//affichage du plateau + infos joueur
function plateauAff() {
  for (i = 0; i < 9; i++) {
    fill(51, 100, 200);
    strokeWeight(3);
    stroke(255);
    push();
    translate(((i % 3) * tailleCase), (floor((i / 3)) * tailleCase));
    rect(0, 0, tailleCase, tailleCase);
    stroke(50, 20, 60);
    if (plateau[i] == 0) { // affiche O
      ellipse(tailleCase / 2, tailleCase / 2, tailleCase / 2, tailleCase / 2);
    } else if (plateau[i] == -1) { // affiche X
      line(tailleCase / 4, tailleCase / 4, 3 * (tailleCase / 4), 3 * (tailleCase / 4));
      line(3 * (tailleCase / 4), (tailleCase / 4), (tailleCase / 4), 3 * (tailleCase / 4));
    }
    pop();
    infoJoueur.html("Tour du joueur " + ((joueurTour) ? "1 (X) " : "2 (O) ") + " !"); // met à jour les infos du joueur 
  }
}

//affichage du texte indiquant le mode actuel
function texteMode() {
  textMode.html("Le mode actuel est : <b>" + mode + "</b> cliquez sur le selecteur ci dessous pour changer de mode.");
}

// detecte les clics sur une cellule
function mouseReleased() {
  if (finPartie) {
    return;
  } // si la partie est finie on ne détecte plus les nouveaux clics
  mx = mouseX;
  my = mouseY;
  if (mx > tailleFen || my > tailleFen) {
    return;
  } // si on clique en dehors de la fenêtre alors aucun effet
  x = floor(mx / tailleCase);
  y = floor(my / tailleCase);
  ind = (y * 3) + x;
  if (plateau[ind] <= 0) {
    return;
  } // si la case est déjà remplie le clic n'aura aucun effet
  plateau[ind] = (joueurTour) ? -1 : 0; // Sinon on met le symbole
  joueurTour = !joueurTour;
  compte++;
  verifVictoire();
}

function keyPressed() { // on peut recommencer en pressant "r"
  if (key === 'r' || key === 'R') {
    recommencer();
  }
}

function verifVictoire() { // Vérifie si le joueur a gagné
  if (compte === 9) { // si les 9 tours sont finis et aucun joueur n'a gagné alors égalité
    finPartie = true;
  }
  for (i = 0; i < 3; i++) // vérifie les colonnes
    if (plateau[i] == (plateau[i + 3]) && plateau[i] == (plateau[i + 6])) {
      finPartie = true;
      vainqueur = [i, i + 6]; // garde les premiers et derniers coordonnées des cases gagnantes
    }
  for (i = 0; i < 9; i += 3) // vérifie les lignes
    if (plateau[i] == (plateau[i + 1]) && plateau[i] == (plateau[i + 2])) {
      finPartie = true;
      vainqueur = [i, i + 2]; // coord cases gagnantes
    }
  for (i = 0, b = 4; i < 3; i += 2, b -= 2) // vérifie les diagonales
    if (plateau[i] === (plateau[i + b]) && plateau[i] === (plateau[i + b + b])) {
      finPartie = true;
      vainqueur = [i, i + b + b]; // coord cases gagnantes
    }
}

function ligneVictoire() {
  // Déssine une ligne rejoignant les deux cases menant à la vitoire
  x1 = (vainqueur[0] % 3) * tailleCase + tailleCase / 2;
  y1 = (floor(vainqueur[0] / 3)) * tailleCase + tailleCase / 2;
  x2 = (vainqueur[1] % 3) * tailleCase + tailleCase / 2;
  y2 = (floor(vainqueur[1] / 3)) * tailleCase + tailleCase / 2;
  stroke(50, 150, 255);
  strokeWeight(20);
  line(x1, y1, x2, y2);
  infoJoueur.html("Joueur " + ((plateau[vainqueur[0]] === -1) ? "1 (X) " : "2 (O) ") + "Won!"); // maj infos joueurs
}

//changement de mode
function mySelectEvent() {
  mode = selectMode.value();
}