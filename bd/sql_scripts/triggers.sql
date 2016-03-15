use Tagcloud;

delimiter $$

drop trigger if exists nova_publicacao$$
create trigger nova_publicacao after insert on Pesquisador_Publicacao
for each row
begin
    declare autor, coautor integer;
    declare fim boolean;
    declare n integer;

    -- cria link
    -- verifica co-autoria
    declare proximo_coautor cursor for
        select idPesquisador from Pesquisador_Publicacao
            where idPublicacao = NEW.idPublicacao
                and idPesquisador <> NEW.idPesquisador;
    set autor=NEW.idPesquisador;
    open proximo_coautor;
    begin
        declare continue handler for NOT FOUND
            set fim = true;
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
    end;
    close proximo_coautor;
end$$

delimiter ;
