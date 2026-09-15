-- Le compte Infobip est en mode démo (n'autorise l'envoi qu'à des numéros
-- whitelistés manuellement) tant qu'aucun moyen de paiement n'est ajouté —
-- donc bloquant pour de vrais utilisateurs pendant la période de test.
-- Même pattern que seller_verification_required (013) : réglage admin
-- désactivé par défaut, à activer une fois Infobip financé.
insert into public.admin_settings (key, value, description, category)
values (
  'phone_otp_required',
  'false',
  'Exige la vérification du numéro par OTP SMS (Infobip) à l''inscription',
  'trust'
)
on conflict (key) do nothing;
