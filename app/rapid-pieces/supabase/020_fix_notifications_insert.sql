-- Bug trouvé en vérifiant les migrations 016/017 (cahier v2) : la table
-- `notifications` n'a que des policies RLS select/update ("users can see/update
-- their own") — aucune policy insert. `notify_request_expiration()` (017)
-- insère pourtant des notifications pour le buyer ET pour d'autres vendeurs
-- (les auteurs des offres sur la demande), en s'exécutant avec les droits de
-- l'utilisateur qui a déclenché l'update (ex. un acheteur, via
-- expireStaleRequests()) — RLS bloque cet insert, ce qui fait échouer toute la
-- transaction : une demande n'expire donc jamais réellement une fois cette
-- migration en place.
--
-- Correction : la fonction passe en security definer (même pattern que
-- seller_offered_on_request(), 009_fix_rls_recursion.sql) pour pouvoir écrire
-- des notifications au nom d'autres utilisateurs sans ouvrir une policy insert
-- générale sur la table.

create or replace function public.notify_request_expiration()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'expired' and old.status = 'open' then
    insert into public.notifications (user_id, title, message, type)
    values (new.buyer_id, 'Demande expirée', 'Votre demande de pièce est arrivée à expiration.', 'request_expired');

    insert into public.notifications (user_id, title, message, type)
    select seller_id, 'Demande expirée', 'La demande sur laquelle vous avez postulé a expiré.', 'request_expired'
    from public.offers
    where request_id = new.id;
  end if;
  return new;
end;
$$;
