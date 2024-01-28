var arbre = {
    prenom: "Clement",
    age: 45,
    variants: ["Zombie-A"],
    immune: false,
    mort: false,
    peutInfecter: true,
    groupe: [{
        prenom: "Killian",
        age: 25,
        infecte: false,
        variants: [],
        immune: false,
        mort: false,
        peutInfecter: true,
        groupe: [{
            prenom: "Chris",
            age: 22,
            variants: [],
            immune: false,
            mort: false,
            peutInfecter: true,
            groupe: [
                {
                    prenom: "Louis",
                    age: 33,
                    variants: [],
                    immune: false,
                    mort: false,
                    peutInfecter: true,
                    groupe: []
                }
            ]
        },
        {
            prenom: "Corentin",
            age: 45,
            variants: ["Zombie-B"],
            immune: false,
            mort: false,
            peutInfecter: true,
            groupe: []
        }
        ]
    },
    {
        prenom: "William",
        age: 32,
        variants: [],
        immune: false,
        mort: false,
        peutInfecter: true,
        groupe: [{
            prenom: "Adrien",
            age: 67,
            variants: ["Zombie-32"],
            immune: false,
            mort: false,
            peutInfecter: true,
            groupe: []
        },
        {
            prenom: "Jacques",
            age: 26,
            variants: [],
            immune: false,
            mort: false,
            peutInfecter: true,
            groupe: [{
                prenom: "Paul",
                age: 20,
                variants: ["Zombie-Ultime"],
                immune: false,
                mort: false,
                peutInfecter: true,
                groupe: []
            }
            ]
        }
        ]
    }]
};


///////////////////////VARIANTS//////////////////////////////////////

function VersLeBas(personne, variant, condition = () => true) {
    if (peutInfect(personne, variant, condition)) {

        personne.variants.push(variant)
        console.log(personne.prenom + " a ete infecte par " + variant)
    }


    personne.groupe.forEach((groupe) => {
        VersLeBas(groupe, variant, condition);
    });

}

function VersLeHaut(personne, variant, condition = () => true) {
    if (peutInfect(personne, variant, condition)) {

        personne.variants.push(variant)
        console.log(personne.prenom + " a ete infecte par " + variant)
    }

    if (personne.parent !== null) {
        VersLeHaut(personne.parent, variant, condition);
    }
}

function UnSurDeux(personne, variant) {
    if (personne.parent) {
        personne.parent.groupe.forEach((groupe) => {
            if (peutInfect(groupe, variant, () => personne.parent.groupe.indexOf(groupe) % 2 === 0)) {
                console.log(groupe.prenom + " a ete infecte par " + variant)
                groupe.variants.push(variant);
            }
        });
    }

}


function infecter(personne) {

    personne.variants.forEach((variant) => {

        switch (variant) {
            case "Zombie-A":
                VersLeBas(personne, "Zombie-A")
                break;
            case "Zombie-B":
                VersLeHaut(personne, "Zombie-B")
                break;
            case "Zombie-32":
                VersLeBas(personne, "Zombie-32", (personne) => personne.age >= 32)
                VersLeHaut(personne, "Zombie-32", (personne) => personne.age >= 32)
                break;
            case "Zombie-C":
                UnSurDeux(personne, "Zombie-C")
                break;
            case "Zombie-Ultime":
                VersLeHaut(personne, "Zombie-Ultime", (personne) => personne.parent === null)
                break;
        }


    })



    personne.groupe.map((groupe) => infecter(groupe));


}


///////////////////////////////////VACCINS/////////////////////////////////////////////////////


function VaccinA1(personne) {

    var devraitVacciner = (personne.variants.includes("Zombie-A") || personne.variants.includes("Zombie-32"));

    if (devraitVacciner && personne.age <= 30) {
        personne.immune = true;
        personne.variants = [];
        console.log("Le vaccin est efficace sur " + personne.prenom)
    } else {
        console.log("le vaccin est inneficace sur " + personne.prenom)
    }

    personne.groupe.forEach((pers) => VaccinA1(pers));

}

function VaccinB1(personne) {

    var devraitVacciner = (personne.variants.includes("Zombie-B") || personne.variants.includes("Zombie-C"));

    if (devraitVacciner) {
        if (i % 2 === 0) {
            const zombieBIndex = personne.variants.indexOf('Zombie-B');
            const zombieCIndex = personne.variants.indexOf('Zombie-C');

            if (zombieBIndex !== -1) {
                personne.variants.splice(zombieBIndex, 1);
            }

            if (zombieCIndex !== -1) {
                personne.variants.splice(zombieCIndex, 1);
            }
            console.log(personne.prenom + " a ete vaccine contre les Zombies B et C")
        } else {
            personne.mort = true;
            console.log(personne.prenom + " est mort");
        }

    } else {
        console.log(personne.prenom + " n'as pas le zombie B ou C")
    }

    i++;

    personne.groupe.forEach((pers) => VaccinB1(pers));
}

function VaccinUltime(personne) {
    var devraitVacciner = personne.variants.includes("Zombie-Ultime")

    if (devraitVacciner) {

        personne.peutInfecter = false;
        personne.variants = []
        personne.imunise = true;

        console.log(personne.prenom + " a ete vaccine par le vaccin ultime")
    }

    personne.groupe.forEach((pers) => VaccinUltime(pers));
}

///////////////////////////////////////Utils////////////////////////////////////////////////

function peutInfect(personne, variant, condition = () => true) {
    return !personne.variants.includes(variant) && condition(personne);
}

function InitParents(personne, parent) {
    personne.groupe.forEach((groupe) => InitParents(groupe, personne));
    personne.parent = parent;
    return personne;
}

function afficherInfos(personne) {
    console.log("Nom: " + personne.prenom + ", Age: " + personne.age + ", Immunise:" + personne.immune + ",peut infecter : " + personne.peutInfecter + ", Variants: " + (personne.variants.length > 0 ? personne.variants.join(', ') : 'Aucun'));

    personne.groupe.forEach((child) => {
        afficherInfos(child);
    });
}



//Init
InitParents(arbre, null);


//Infection
infecter(arbre);

//Vaccins
VaccinA1(arbre);
var i = 0;
VaccinB1(arbre);
VaccinUltime(arbre);

//result
afficherInfos(arbre);
