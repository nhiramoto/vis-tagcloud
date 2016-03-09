use Tagcloud;

delimiter $$

drop trigger if exists create_links$$
create trigger create_links after insert on Pesquisador_Publicacao
for each row
begin
    declare autor, coautor integer;
    declare fim boolean;
    declare n integer;
    -- verifica co-autoria
    declare proximo_coautor cursor for
        select idPesquisador from Pesquisador_Publicacao
            where idPublicacao = NEW.idPublicacao
                and idPesquisador <> NEW.idPesquisador;
    declare continue handler for NOT FOUND
        set fim=true;
    set autor=NEW.idPesquisador;
    open proximo_coautor;
    cada_coautor: loop
        fetch proximo_coautor into coautor;
        if (fim is true) then
            leave cada_coautor;
        end if;
        delete from Links
            where ((idPesq1=autor and idPesq2=coautor) or
                  (idPesq1=coautor and idPesq2=autor));
        insert into Links value (autor, coautor);
    end loop;
    close proximo_coautor;
end$$

delimiter ;
