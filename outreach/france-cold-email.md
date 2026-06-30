# FindYourStay — France cold outreach email (CNIL / PECR compliant)

Legal basis: B2B prospection by email is allowed in France **without prior consent** when the
offer is relevant to the recipient's profession (it is — a booking website for an accommodation
provider), on a legitimate-interest basis. Non-negotiable requirements baked in below:
- clear sender identity
- the offer relates to their professional activity
- a **one-click unsubscribe** in every email
- honour opt-outs fast (CNIL: ~immediately; legally within reason)

Merge fields: `{{nom}}` property name · `{{probleme}}` personalised issue line ·
`{{lien_apercu}}` their free-preview URL · `{{lien_desabonnement}}` one-click unsubscribe.

`{{probleme}}` is chosen from the scan flag:
| Scan flag | `{{probleme}}` |
|---|---|
| NO_HTTPS / CERT_INVALID / CERT_EXPIRED | votre site n'affiche pas de connexion sécurisée (HTTPS) valide |
| NO_HTTPS_REDIRECT | votre site ne bascule pas automatiquement vers une connexion sécurisée (HTTPS) |
| (no issue — soft version) | *use the soft variant below* |

---

## Variant A — security hook (sites with an HTTPS problem)

**Objet :** {{nom}} — vos visiteurs voient peut-être « Non sécurisé »

Bonjour,

Je me permets de vous écrire au sujet du site internet de **{{nom}}**.

En le consultant, j'ai remarqué que **{{probleme}}**. Concrètement, certains navigateurs
affichent alors un avertissement « Non sécurisé » à vos visiteurs, ce qui peut les dissuader
de réserver en direct avec vous et nuit à votre référencement Google.

Chez **FindYourStay**, nous créons et hébergeons des sites de réservation directe pour les
hébergeurs indépendants : un site moderne et sécurisé (HTTPS), sur votre propre nom de domaine,
avec réservation en ligne. Vos clients réservent et vous règlent directement — **vous gardez
100 %, sans commission**.

Vous pouvez voir gratuitement à quoi ressemblerait votre site, sans inscription :
👉 {{lien_apercu}}

Bien cordialement,
David Skillett — FindYourStay
[adresse postale] · contact@findyourstay.com

*Vous recevez ce message à titre professionnel. Pour ne plus être contacté, [cliquez ici pour vous désabonner]({{lien_desabonnement}}) — un seul clic, sans inscription.*

---

## Variant B — soft hook (sites with no detectable issue)

**Objet :** {{nom}} — gardez 100 % de vos réservations

Bonjour,

Je découvre le site de **{{nom}}** et votre travail donne envie de réserver.

Une question simple : quelle part de vos réservations passe encore par Booking.com ou Airbnb,
avec leurs commissions ? Chez **FindYourStay**, nous créons et hébergeons un site de réservation
directe sur votre propre domaine — vos clients réservent et vous paient directement, **vous gardez
100 %, sans commission**. Une seule réservation directe couvre souvent l'année.

Voir gratuitement votre site, sans inscription :
👉 {{lien_apercu}}

Bien cordialement,
David Skillett — FindYourStay
[adresse postale] · contact@findyourstay.com

*Vous recevez ce message à titre professionnel. Pour ne plus être contacté, [cliquez ici pour vous désabonner]({{lien_desabonnement}}) — un seul clic, sans inscription.*

---

## English gloss (for your reference, not sent)
> Subject: {{nom}} — your visitors may be seeing "Not secure"
> Hi, I'm writing about {{nom}}'s website. I noticed {{probleme}} — some browsers show your
> visitors a "Not secure" warning, which can put them off booking direct and hurts your Google
> ranking. FindYourStay builds & hosts secure direct-booking sites on your own domain; guests pay
> you directly, you keep 100%, no commission. See a free preview, no signup: {{link}}.
> [identity + one-click unsubscribe]

## Before sending (checklist)
- [ ] Fill `[adresse postale]` (a real postal address — required to look legitimate)
- [ ] Wire `{{lien_desabonnement}}` to a working one-click unsubscribe (Resend supports List-Unsubscribe)
- [ ] Warm the sending domain; start ~30–50/day
- [ ] Suppression list honoured on every send
- [ ] Native-speaker eyeball on the final French
