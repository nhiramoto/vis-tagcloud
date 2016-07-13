use Tagcloud;

delimiter $$

drop trigger if exists nova_publicacao$$
create trigger nova_publicacao after insert on Pesquisador_Publicacao
for each row
begin
    declare autor, coautor integer;
    declare fim boolean default false;
    declare n integer;
    declare has boolean default false;

    declare idkey integer;

    -- cria link
    -- verifica co-autoria
    declare proximo_coautor cursor for
        select idPesquisador from Pesquisador_Publicacao
            where idPublicacao = NEW.idPublicacao
                and idPesquisador <> NEW.idPesquisador;
    declare proximo_idkey cursor for
        select idKeyword from Publicacao_Keyword
            where idPublicacao = NEW.idPublicacao;

    set autor=NEW.idPesquisador;
    open proximo_coautor;
    begin
        declare continue handler for NOT FOUND
            set fim = true;
        loop1: loop
            fetch proximo_coautor into coautor;
            if (fim is true) then
                leave loop1;
            end if;
            insert into Links (idPesq1, idPesq2, qtd) value (autor, coautor, 1)
                on duplicate key update qtd=qtd+1;
        end loop;
    end;
    close proximo_coautor;

    set fim = false;
    open proximo_idkey;
    begin
        declare continue handler for NOT FOUND
            set fim = true;
        loop2: loop
            fetch proximo_idkey into idkey;
            if fim is true then
                leave loop2;
            end if;
            select exists(select 1 from Pesquisador_Keyword where idPesquisador=NEW.idPesquisador and idKeyword=idkey) into has;
            if has then
                update Pesquisador_Keyword set qtd = qtd + 1
                    where idPesquisador = NEW.idPesquisador
                        and idKeyword = idkey;
            else
                insert into Pesquisador_Keyword (idPesquisador, idKeyword, qtd)
                    value (NEW.idPesquisador, idkey, 1);
            end if;
        end loop;
    end;
    close proximo_idkey;
end$$

drop trigger if exists nova_keyword$$
create trigger nova_keyword after insert on Publicacao_Keyword
for each row
begin
    declare fim boolean default false;
    declare has boolean default false;
    declare idpesq, qtd integer;
    declare proximo_idpesq cursor for
        select idPesquisador from Pesquisador_Publicacao
            where idPublicacao = NEW.idPublicacao;
    declare continue handler for NOT FOUND
        set fim = true;
    open proximo_idpesq;
    loop1: loop
        fetch proximo_idpesq into idpesq;
        if fim is true then
            leave loop1;
        end if;
        select exists(select 1 from Pesquisador_Keyword where idPesquisador=idpesq and idKeyword=NEW.idKeyword) into has;
        if has then
            update Pesquisador_Keyword
                set Pesquisador_Keyword.qtd=Pesquisador_Keyword.qtd+1
                where idPesquisador=idpesq
                    and idKeyword = NEW.idKeyword;
        else
            insert into Pesquisador_Keyword (idPesquisador, idKeyword, qtd)
                value (idpesq, NEW.idKeyword, 1);
        end if;
    end loop;
    close proximo_idpesq;
end$$

delimiter ;
