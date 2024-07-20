/*
 * Copyright© 2024 Ronan LE MEILLAT for SCTG Development,
 * Association High Can Fly and Les Ailes du Mont-Blanc
 *
 * Up2Pay is free software: you can redistribute it and/or modify
 * it under the terms of the Affero General Public License version 3 as
 * published by the Free Software Foundation.
 *
 * Up2Pay is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * Affero General Public License for more details.
 *
 * You should have received a copy of the Affero General Public License
 * along with Up2Pay. If not, see <https://www.gnu.org/licenses/agpl-3.0.html>.
 */
export default <{ [index: string]: string }>{
  '00000': 'Paiement accepté',
  '00001': 'La connexion au centre d’autorisation a échoué ou une erreur interne est survenue',
  '00003': 'Erreur Up2Pay',
  '00004': 'Numéro de porteur ou cryptogramme visuel invalide.',
  '00006': 'Accès refusé ou site / rang incorrect',
  '00008': 'Date de fin de validité incorrect',
  '00009': 'Erreur de création d’un abonnement.',
  '00010': 'Devise inconnue',
  '00011': 'Montant incorrect',
  '00015': 'Paiement déjà effectué.',
  '00016': 'Abonne déjà existant',
  '00021': 'Carte non autorisée',
  '00022': 'Plafond atteint',
  '00029': 'Carte non conforme',
  '00030': "Temps d'attente supérieur au délai maximal par l'internaute/acheteur au niveau de la page de paiements",
  '00033': "Code pays de l'adresse IP du nbavigateur de l'acheteur non autorisé",
  '00040': 'Opération sans authentification 3-D Secure, bloquée par le filtre.',
  '00099': 'Opération en attente de validation par l’émetteur du moyen de paiement.',
}
