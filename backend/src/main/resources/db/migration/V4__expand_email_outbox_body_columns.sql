alter table email_outbox
    modify column plain_text_body text not null;

alter table email_outbox
    modify column html_body text null;
