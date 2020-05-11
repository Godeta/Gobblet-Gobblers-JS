//les fondations du jeu
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
// l'intelligence artificielle
let AI;
let robot;

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
  selectMode.position(550, 650);
  selectMode.option('PvP');
  selectMode.option('IA random');
  selectMode.option('IA minmax');
  selectMode.changed(mySelectEvent); //si on change de valeur alors ça lance la fonction mySelectEvent
  //paragraphe pour afficher le mode actuel
  textMode = createP();
  textMode.position(550, 600);
  textMode.style('font-size', '100%');

  //image IA

  robot = loadImage("img/robot.png");

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
  //tour du joueur avec un boolean initialisé aléatoirement 
  joueurTour = Math.random() >= 0.5;
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
  //si on est en mode IA random et que ce n'est pas le tour du joueur
  if (mode == "IA random" && joueurTour == false) {

    wait();
    randomChoice();
  }
  //si on est en mode IA min max et que ce n'est pas le tour du joueur
  else if (mode == "IA minmax" && joueurTour == false) {
    minmaxChoice();
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
    if (mode != "PvP" && joueurTour == false) {
      infoJoueur.html('Tour de l\'IA (O) <img src="../img/robot.png" width="100" height="100">');
    }
  }
}

//affichage du texte indiquant le mode actuel
function texteMode() {
  textMode.html("Le mode actuel est : <b>" + mode + "</b> cliquez sur le selecteur ci dessous pour changer de mode.");
}

// detecte les clics sur une cellule
function mouseReleased() {
  // si la partie est finie on ne détecte plus les nouveaux clics
  if (finPartie) {
    return;
  }
  //si on est en mode IA random et que ce n'est pas le tour du joueur
  if (mode == "IA random" && joueurTour == false) {
    return;
  }
  mx = mouseX;
  my = mouseY;
  // si on clique en dehors de la fenêtre alors aucun effet
  if (mx > tailleFen || my > tailleFen) {
    return;
  }
  x = floor(mx / tailleCase);
  y = floor(my / tailleCase);
  ind = (y * 3) + x;
  // si la case est déjà remplie le clic n'aura aucun effet
  if (plateau[ind] <= 0) {
    return;
  }
  // Sinon on met le symbole-> -1 vrai, 0 faux
  plateau[ind] = (joueurTour) ? -1 : 0;
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
  for (i = 0; i < 3; i++) // vérifie les colonnes
    if (plateau[i] == (plateau[i + 3]) && plateau[i] == (plateau[i + 6])) {
      console.log(plateau[i], plateau[i + 3], plateau[i + 6]);
      finPartie = true;
      compte = -1; //la partie est finie suite à une victoire, le compte n'a plus d'importance
      vainqueur = [i, i + 6]; // garde les premiers et derniers coordonnées des cases gagnantes
    }
  for (i = 0; i < 9; i += 3) // vérifie les lignes
    if (plateau[i] == (plateau[i + 1]) && plateau[i] == (plateau[i + 2])) {
      console.log(plateau[i], plateau[i + 1], plateau[i + 2]);
      finPartie = true;
      compte = -1;
      vainqueur = [i, i + 2]; // coord cases gagnantes
    }
  for (i = 0, b = 4; i < 3; i += 2, b -= 2) // vérifie les diagonales
    if (plateau[i] === (plateau[i + b]) && plateau[i] === (plateau[i + b + b])) {
      console.log(plateau[i], plateau[i + b], plateau[i + b + b]);
      finPartie = true;
      compte = -1;
      vainqueur = [i, i + b + b]; // coord cases gagnantes
    }
  if (compte === 9) { // si les 9 tours sont finis et aucun joueur n'a gagné alors égalité
    finPartie = true;
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

//Ia aléatoire
function randomChoice() {
  // si la partie est finie on ne joue plus
  if (finPartie) {
    return;
  }
  let indi = floor(random(0, 9)); //on arrondi pour ne pas avoir de nombre à virgule
  //console.log(indi);
  //on vérifie aléatoirement si une case est disponible
  while (plateau[indi] <= 0) {
    //console.log(indi);
    indi = floor(random(0, 9));
  }
  wait();
  //on joue le coup
  //console.log("jouer le coup : "+indi);
  plateau[indi] = 0; // Sinon on met le symbole-> -1 vrai, 0 faux
  //fin du tour
  joueurTour = !joueurTour;
  compte++;
  verifVictoire();
}

//Ia min max
function minmaxChoice() {

}

//stopper temporairement le programme
function wait() {
  let frame = 0;
  while (frame < 2000) {
    frame++;
  }
}