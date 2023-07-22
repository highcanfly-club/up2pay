export type Params = {
  payboxSandbox: boolean;
  payboxSite: Request["PBX_SITE"];
  payboxRang: Request["PBX_RANG"];
  payboxIdentifiant: Request["PBX_IDENTIFIANT"];
  payboxHmac: Request["PBX_HMAC"];
  payboxEffectue: Request["PBX_EFFECTUE"];
  payboxRefuse: Request["PBX_REFUSE"];
  payboxAnnule: Request["PBX_ANNULE"];
  payboxAttente: Request["PBX_ATTENTE"];
  payboxRepondreA: Request["PBX_REPONDRE_A"];
  amount: number | string;
  devise?: Request["PBX_DEVISE"];
  reference: Request["PBX_CMD"];
  email: Request["PBX_PORTEUR"];
  firstname: string,
  lastname: string,
  address1: string,
  address2?: string,
  zipcode: string,
  city: string,
  totalquantity: string, //string representation of a number from 1 to 12
  countrycode: string, // Code ISO-3166-1
};

export type Document = {
  request: Request;
  sandbox: boolean;
};

export type FormElement = {
  name: string;
  value: string;
};

export type Billing = {
  firstname: string;
  lastname: string;
  address1: string;
  address2?: string;
  zipcode: string;
  city: string;
  countrycode: string; // Code ISO-3166-1
}

export type Request = {
  /**
   * C’est le numéro de site (TPE) fourni par la banque du commerçant
   * Format: 7 chiffres
   */
  PBX_SITE: string;

  /**
   * C’est le numéro de rang (ou « machine ») fourni par la banque du commerçant
   * Format: 2 chiffres.
   */
  PBX_RANG: string;

  /**
   * Identifiant Verifone e-commerce fourni par Verifone au moment de l’inscription du commerçant
   * Format : 1 à 9 chiffres
   */
  PBX_IDENTIFIANT: string;

  /**
   * Montant total de la transaction en centimes (sans virgule ni point)
   * Format : 3 à 10 chiffres (Ex: 19,90€ => 1990)
   */
  PBX_TOTAL: string;

  /**
   * Code monnaie de la transaction suivant la norme ISO 4217
   * Format : 3 chiffres (Ex: EURO => 978)
   * 826 - Livre Sterling
   * 840 - Dollar US
   * 978 - Euro
   */
  PBX_DEVISE: "826" | "840" | "978";

  /**
   * C’est la référence commande côté commerçant (champ libre)
   * Format : 1 à 250 caractères (Ex: CMD9542124-01A5G)
   */
  PBX_CMD: string;

  /**
   * Adresse email de l’acheteur (porteur de carte)
   * Format : 6 à 120 caractères (Ex: test@verifone.com)
   */
  PBX_PORTEUR: string;

  /**
   * Variables renvoyées par Up2Pay
   * Format : <nom de variable que vous souhaitez>:<lettre>;
   * M - Montant de la transaction (précisé dans PBX_TOTAL)
   * R - Référence commande (précisée dans PBX_CMD) : espace URL encodé
   * T - Numéro d’appel Up2Pay
   * A - numéro d’Autorisation (numéro remis par le centre d’autorisation) : URL encodé
   * B - numéro d’aBonnement (numéro remis par Up2Pay)
   * C - Type de Carte retenu (cf. PBX_TYPECARTE)
   * D - Date de fin de validité de la carte du porteur. Format : AAMM
   * E - Code réponse de la transaction
   * F - Etat de l’authentiFication du porteur vis-à-vis du programme 3-D Secure
   * G - Garantie du paiement par le programme 3-D Secure. Format : O ou N
   * H - Empreinte de la carte
   * I - Code pays de l’adresse IP de l’internaute. Format : ISO 3166 (alphabétique)
   * J - 2 derniers chiffres du numéro de carte du porteur
   * K - Signature sur les variables de l’URL. Format : url-encodé
   * N - 6 premiers chiffres (« biN6 ») du numéro de carte de l’acheteur
   * O - Enrôlement du porteur au programme 3-D Secure
   * o - Spécifique Cetelem : Option de paiement sélectionnée par le client :
   * P - Type de Paiement retenu (cf. PBX_TYPEPAIEMENT)
   * Q - Heure de traitement de la transaction. Format : HH:MM:SS (24h)
   * S - Numéro de TranSaction Up2Pay
   * U - Gestion des abonnements avec le traitement Up2Pay Direct Plus.
   * V - Nouvel identifiant de l’abonné sigmaplus.
   * W - Date de traitement de la transaction sur la plateforme Up2Pay. Format : JJMMAAAA
   * Y - Code paYs de la banque émettrice de la carte. Format : ISO 3166 (alphabétique)
   * Z - Index lors de l’utilisation des paiements mixtes (cartes cadeaux associées à un complément par carte CB/Visa/MasterCard/Amex)
   */
  PBX_RETOUR: string;

  /**
   * Définit l’algorithme de hachage utilisé lors du calcul du HMAC
   * Format : Texte
   */
  PBX_HASH: "SHA512" | "SHA256" | "RIPEMD160" | "SHA384" | "SHA224" | "MDC2";

  /**
   * Date à laquelle l’empreinte HMAC a été calculée. Doit être URL-encodée
   * Format : Date au format ISO8601
   */
  PBX_TIME: string;

  /**
   * Permet l’authentification du commerçant et la vérification de l’intégrité du message. Il est calculé à partir de la liste des autres variables envoyées à Up2Pay System
   * Format : Texte (format hexadécimal)
   */
  PBX_HMAC?: string;

  /**
   * Référence transmise à la banque du commerçant au moment de la télécollecte.
   * Elle devrait être unique et peut permettre à la banque du commerçant de lui fournir une information en cas de litige sur un paiement.
   * Format : jusqu’à 12 caractères alphanumériques (hors caractères spéciaux)
   */
  PBX_ARCHIVAGE?: string;

  /**
   * Si la variable vaut « O », la transaction sera uniquement en mode autorisation, c'est-à-dire qu’elle ne sera pas envoyée à la banque du commerçant au moment de la télécollecte.
   * Format : O ou N
   */
  PBX_AUTOSEULE?: "O" | "N";

  /**
   * Page de retour de Up2Pay vers le site Marchand après paiement annulé
   * Format : jusqu’à 150 caractères (Ex: http://www.commerce.fr/annulation.html)
   */
  PBX_ANNULE?: string;

  /**
   * Page de retour de Up2Pay vers le site Marchand après paiement en attente de validation par l’émetteur.
   * Format : jusqu’à 150 caractères (Ex: http://www.commerce.fr/attente.html)
   */
  PBX_ATTENTE?: string;

  /**
   * Date d’expiration à ne pas dépasser
   * Ceci est utile dans le cas des paiements en N fois et pour éviter qu’une reconduction échoue pour cause de date d’expiration de la carte dépassée.
   * Format : Date au format AAMM
   */
  PBX_DATEVALMAX?: string;

  /**
   * Date de la seconde échéance d’un paiement fractionné
   * Format : Date au format JJ/MM/AAAA (Ex: 30/06/2012)
   */
  PBX_DATE1?: string;

  /**
   * Date de la troisième échéance d’un paiement fractionné
   * Format : Date au format JJ/MM/AAAA (Ex: 30/06/2012)
   */
  PBX_DATE2?: string;

  /**
   * Date de la quatrième échéance d’un paiement fractionné
   * Format : Date au format JJ/MM/AAAA (Ex: 30/06/2012)
   */
  PBX_DATE3?: string;

  /**
   * Nombre de jours de différé (entre la transaction et sa capture)
   * Format : 2 chiffres (Ex: 04)
   */
  PBX_DIFF?: string;

  /**
   * TimeOut de la page de paiement (en secondes)
   * Une fois cette période dépassée, la transaction est comptée comme annulée
   * Format : 3 à 10 chiffres (Ex: 900)
   */
  PBX_DISPLAY?: string;

  /**
   * Page de retour de Up2Pay vers le site Marchand après paiement accepté.
   * Format : jusqu’à 150 caractères (Ex: http://www.commerce.fr/effectue.html)
   */
  PBX_EFFECTUE?: string;

  /**
   * Empreinte fournie par Verifone au moment d’un premier paiement via la variable « H » de « PBX_RETOUR »
   * Format : 64 caractères
   */
  PBX_EMPREINTE?: string;

  /**
   * Référence numérique d’une subdivision géographique, fonctionnelle, commerciale, ...
   * Format : 1 à 9 chiffres
   */
  PBX_ENTITE?: string;

  /**
   * Code erreur à retourner lors de l’intégration dans l’environnement de pré-production
   * Variable non prise en compte dans l’environnement de production
   * Format : 5 chiffres
   */
  PBX_ERRORCODETEST?: string;

  /**
   * Définit le groupe de commerçants qui pourront réutiliser la même référence abonné pour débiter un même client
   * Format : jusqu’à 10 chiffres
   */
  PBX_GROUPE?: string;

  /**
   * Numéro d’abonnement renvoyé via la variable ‘B’ de PBX_RETOUR
   * Format : 9 chiffres
   */
  PBX_IDABT?: string;

  /**
   * Langue utilisée par Verifone pour l’affichage de la page de paiement
   * Format : 3 caractères (Ex: FRA)
   */
  PBX_LANGUE?: "FRA" | "GBR" | "ESP" | "ITA" | "DEU" | "NLD" | "SWE" | "PRT";

  /**
   * Nom du marchand affiché sur la page de paiement
   * Format : 40 caractères
   */
  PBX_NOM_MARCHAND?: string;

  /**
   * Référence abonné affectée par le commerçant via le produit Up2Pay Direct Plus ou Up2Pay System version PLUS
   * Format : jusqu’à 250 caractères
   */
  PBX_REFABONNE?: string;

  /**
   * Page de retour de Up2Pay vers le site Marchand après paiement refusé
   * Format : jusqu’à 150 caractères (Ex: http://www.commerce.fr/refus.html)
   */
  PBX_REFUSE?: string;

  /**
   * URL d’appel serveur à serveur après chaque tentative de paiement
   * Aussi appelée « IPN », cette URL est appelée séparément du navigateur du client, et permet donc de valider les commandes de manière sûre
   * Format : jusqu’à 150 caractères (Ex: http://www.commerce.fr/validation_paiement)
   */
  PBX_REPONDRE_A?: string;

  /**
   * Méthode (au sens HTTP) utilisée pour l’appel de l’IPN, cette variable permet de choisir la méthode qui sera utilisée par Verifone pour réaliser l’appel IPN
   */
  PBX_RUF1?: "POST" | "GET";

  /**
   * Définit le format de la page du choix du moyen de paiement. Cette variable est à modifier en fonction du type de navigateur.
   * Format : 3 à 5 caractères (Ex: HTML)
   */
  PBX_SOURCE?: "HTML" | "WAP" | "IMODE" | "XHTML" | "RWD";

  /**
   * Privilégie un type de carte
   * Format : 5 à 10 caractères
   */
  PBX_TYPEPAIEMENT?: string;

  /**
   * Définit le type de carte à utiliser sur la page de paiement, dans le cas où la page de présélection du moyen de paiement fournie par Verifone n’est pas utilisée
   * Format : min. 2 caractères
   */
  PBX_TYPECARTE?:
    | "CARTE"
    | "PAYPAL"
    | "CREDIT"
    | "NETRESERVE"
    | "PREPAYEE"
    | "FINAREF"
    | "LEETCHI"
    | "PAYBUTTONS";

  /**
   * Montant en centimes (donc sans virgule ni point) de la deuxième échéance d’un paiement fractionné.
   * Format : 3 à 10 chiffres (Ex: 20€ => 2000)
   */
  PBX_2MONT1?: string;

  /**
   * Montant en centimes (donc sans virgule ni point) de la troisième échéance d’un paiement fractionné.
   * Format : 3 à 10 chiffres (Ex: 20€ => 2000)
   */
  PBX_2MONT2?: string;

  /**
   * Montant en centimes (donc sans virgule ni point) de la quatrième échéance d’un paiement fractionné.
   * Format : 3 à 10 chiffres (Ex: 20€ => 2000)
   */
  PBX_2MONT3?: string;

  /**
   * Permet de ne pas effectuer une authentification 3-D Secure du porteur, uniquement pour cette transaction, même si le commerçant est enrôlé au programme 3-D Secure.
   * Format : 'N'
   */
  PBX_3DS?: "N";

  /**
   * Champs de facturation 3DSv2 cf: https://www.ca-moncommerce.com/espace-client-mon-commerce/up2pay-e-transactions/ma-documentation/manuel-dintegration-focus-3ds-v2/principes-generaux/#integration-3dsv2-developpeur-webmaster
   */
  PBX_BILLING: string;

  /**
   * Champs de panier 3DSv2 cf: https://www.ca-moncommerce.com/espace-client-mon-commerce/up2pay-e-transactions/ma-documentation/manuel-dintegration-focus-3ds-v2/principes-generaux/#integration-3dsv2-developpeur-webmaster
   */

  PBX_SHOPPINGCART: string;
};

// See 11.1.7 documentation section for PBX_RETOUR
export type Result = {
  /**
   * Montant de la transaction (précisé dans PBX_TOTAL)
   */
  amount: string;

  /**
   * Référence commande (précisé dans PXB_CMD)
   */
  paymentId: string;

  /**
   * Numéro d'appel Up2Pay
   */
  transactionId: string;

  /**
   * Numéro d'autorisation remis par le centre d'autorisation
   */
  authorizationId: string;

  /**
   * Type de carte retenu
   */
  cardType: string;

  /**
   * 6 premiers chiffres (bin6) du numéro de carte de l'acheteur
   */
  cardNumber: string;

  /**
   * Date de fin de validité de la carte du porteur
   * Format: AAMM
   */
  cardExpiration: string;

  /**
   * Code réponse de la transaction
   */
  error: string;

  /**
   * Numéro de transaction Up2Pay
   */
  payboxRef: string;

  date?: string;
  time?: string;
  /**
   * Signature sur les variables de l’URL
   * Format : url-encodé
   */
  signature?: string;

  result?: string;
};
