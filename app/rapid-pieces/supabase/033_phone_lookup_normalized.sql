-- La recherche de compte par téléphone (email_for_phone, utilisée à la
-- connexion) comparait le texte de façon stricte (phone = p_phone), ce qui
-- échouait dès que l'espacement ou l'indicatif différait entre la saisie
-- d'inscription (PhoneInput, qui ajoute automatiquement l'indicatif du pays)
-- et la saisie de connexion (simple champ texte, sans reconstruction).
-- Certains utilisateurs ne tapent en plus pas du tout l'indicatif à la
-- connexion.
--
-- On compare désormais uniquement les chiffres (espaces et "+" ignorés), et
-- on essaie, dans l'ordre : correspondance directe, puis chaque indicatif
-- des pays où Rapid Pièces opère ajouté devant le numéro tapé (cas où
-- l'indicatif n'a pas été tapé), puis le cas inverse (indicatif tapé mais
-- absent du numéro stocké). Aucune donnée existante n'est modifiée : seule
-- la logique de comparaison change.
create or replace function public.email_for_phone(p_phone text)
returns text language plpgsql security definer set search_path = public as $$
declare
  typed text := regexp_replace(p_phone, '\D', '', 'g');
  codes text[] := array['229','234','223','228','233','226','225','221','224','227'];
  code text;
  result text;
begin
  select email into result from public.profiles
  where regexp_replace(phone, '\D', '', 'g') = typed
  limit 1;
  if result is not null then return result; end if;

  foreach code in array codes loop
    select email into result from public.profiles
    where regexp_replace(phone, '\D', '', 'g') = code || typed
    limit 1;
    if result is not null then return result; end if;
  end loop;

  foreach code in array codes loop
    if typed like code || '%' then
      select email into result from public.profiles
      where regexp_replace(phone, '\D', '', 'g') = substring(typed from length(code) + 1)
      limit 1;
      if result is not null then return result; end if;
    end if;
  end loop;

  return null;
end;
$$;
